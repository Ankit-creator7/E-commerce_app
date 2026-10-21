import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// Helper to compute deep business analytics from MongoDB data
const computeStoreMetrics = async () => {
    const products = await productModel.find({});
    const orders = await orderModel.find({});

    // 1. Sales & Revenue Calculations
    let totalRevenue = 0;
    let totalCogs = 0; // Cost of Goods Sold
    let paidOrdersCount = 0;
    const categoryRevenueMap = {};
    const productSalesMap = {}; // productId -> { name, quantitySold, revenue, category }

    // Initialize product sales tracking
    products.forEach((p) => {
        const costPrice = p.costPrice !== undefined && p.costPrice > 0 ? p.costPrice : Math.round(p.price * 0.6);
        const stock = p.stock !== undefined ? p.stock : 25;

        productSalesMap[p._id.toString()] = {
            id: p._id.toString(),
            name: p.name,
            price: p.price,
            costPrice,
            stock,
            category: p.category,
            image: p.image?.[0] || "",
            unitsSold: 0,
            revenue: 0,
            profit: 0
        };
    });

    orders.forEach((order) => {
        totalRevenue += Number(order.amount) || 0;
        if (order.payment || order.paymentMethod === "COD") {
            paidOrdersCount += 1;
        }

        // Iterate through line items
        if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
                const pId = (item._id || item.productId || "").toString();
                const qty = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;
                const cost = productSalesMap[pId]?.costPrice || Math.round(price * 0.6);

                totalCogs += cost * qty;

                if (productSalesMap[pId]) {
                    productSalesMap[pId].unitsSold += qty;
                    productSalesMap[pId].revenue += price * qty;
                    productSalesMap[pId].profit += (price - cost) * qty;
                }

                // Category tracking
                const category = item.category || productSalesMap[pId]?.category || "General";
                if (!categoryRevenueMap[category]) {
                    categoryRevenueMap[category] = { revenue: 0, units: 0 };
                }
                categoryRevenueMap[category].revenue += price * qty;
                categoryRevenueMap[category].units += qty;
            });
        }
    });

    const grossProfit = Math.max(0, totalRevenue - totalCogs);
    const grossMarginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;
    const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    // 2. Inventory & Stock Valuation
    let totalStockUnits = 0;
    let inventoryCostValuation = 0;
    let inventoryRetailValuation = 0;
    const lowStockProducts = [];
    const outOfStockProducts = [];

    const productList = Object.values(productSalesMap);

    productList.forEach((prod) => {
        totalStockUnits += prod.stock;
        inventoryCostValuation += prod.stock * prod.costPrice;
        inventoryRetailValuation += prod.stock * prod.price;

        if (prod.stock === 0) {
            outOfStockProducts.push(prod);
        } else if (prod.stock <= 5) {
            lowStockProducts.push(prod);
        }
    });

    // 3. Velocity & Product Performance
    const topSellingProducts = [...productList]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const deadStockProducts = productList
        .filter((p) => p.unitsSold === 0)
        .slice(0, 5);

    // 4. Category breakdown formatted
    const categoryBreakdown = Object.keys(categoryRevenueMap).map((cat) => ({
        category: cat,
        revenue: categoryRevenueMap[cat].revenue,
        unitsSold: categoryRevenueMap[cat].units,
        sharePercent: totalRevenue > 0 ? Math.round((categoryRevenueMap[cat].revenue / totalRevenue) * 100) : 0
    }));

    return {
        summary: {
            totalRevenue,
            totalOrders: orders.length,
            paidOrdersCount,
            totalCogs,
            grossProfit,
            grossMarginPercent,
            averageOrderValue,
            totalStockUnits,
            inventoryCostValuation,
            inventoryRetailValuation,
            lowStockCount: lowStockProducts.length,
            outOfStockCount: outOfStockProducts.length,
            totalProducts: products.length
        },
        categoryBreakdown,
        topSellingProducts,
        deadStockProducts,
        lowStockProducts,
        outOfStockProducts,
        productList
    };
};

// Heuristic fallback generator when Gemini API is not configured or fails
const generateDeterministicBrief = (metrics) => {
    const { summary, topSellingProducts, lowStockProducts, deadStockProducts } = metrics;
    const topSellerNames = topSellingProducts.map(p => p.name).slice(0, 2).join(" & ");

    return {
        executivePulse: `Your store has generated a total revenue of $${summary.totalRevenue.toLocaleString()} across ${summary.totalOrders} orders with a healthy Gross Margin of ${summary.grossMarginPercent}%. Average Order Value (AOV) is currently sitting at $${summary.averageOrderValue}.`,
        marginAnalysis: `Gross profit stands at $${summary.grossProfit.toLocaleString()} against Cost of Goods Sold (COGS) of $${summary.totalCogs.toLocaleString()}. Your inventory on hand represents $${summary.inventoryCostValuation.toLocaleString()} in wholesale working capital and $${summary.inventoryRetailValuation.toLocaleString()} in retail earning potential.`,
        inventoryAlerts: lowStockProducts.length > 0
            ? `Immediate restock recommended: ${lowStockProducts.length} product(s) have 5 or fewer units left (${lowStockProducts.map(p => p.name).slice(0, 3).join(", ")}). Prioritize reordering top performers before stock-outs impact sales momentum.`
            : `Inventory health is stable. All active SKUs maintain safety stock thresholds of >5 units across warehouse channels.`,
        tacticalRecommendations: [
            topSellerNames
                ? `Double-down on high-velocity items: ${topSellerNames} account for the majority of revenue. Feature these on homepage hero banners.`
                : `Focus marketing spend on primary categories to accelerate initial customer acquisition.`,
            deadStockProducts.length > 0
                ? `Promotional Clearance: ${deadStockProducts.length} products have recorded zero sales (${deadStockProducts.map(p => p.name).slice(0, 2).join(", ")}). Consider bundle deals or 15% flash discounts to liberate trapped working capital.`
                : `Monitor product page conversion rates to boost cross-sell opportunities at cart checkout.`,
            `Implement minimum spend thresholds (e.g. Free shipping above $${summary.averageOrderValue > 0 ? Math.round(summary.averageOrderValue * 1.25) : 50}) to increase your current AOV of $${summary.averageOrderValue}.`
        ]
    };
};

// Call Gemini API via native fetch if API key exists
const callGeminiAI = async (prompt, systemInstruction) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            console.error("Gemini API error status:", response.status, await response.text());
            return null;
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
        console.error("Gemini API call failed:", err.message);
        return null;
    }
};

// Endpoint: GET /api/analytics/dashboard
const getDashboardAnalytics = async (req, res) => {
    try {
        const metrics = await computeStoreMetrics();
        const deterministicBrief = generateDeterministicBrief(metrics);

        // Attempt Gemini enhanced brief if API key is configured
        let aiBrief = deterministicBrief;
        if (process.env.GEMINI_API_KEY) {
            const prompt = `Here are the latest e-commerce store metrics:
- Revenue: $${metrics.summary.totalRevenue}
- Orders: ${metrics.summary.totalOrders}
- AOV: $${metrics.summary.averageOrderValue}
- Gross Profit: $${metrics.summary.grossProfit}
- Gross Margin %: ${metrics.summary.grossMarginPercent}%
- Inventory Units on Hand: ${metrics.summary.totalStockUnits}
- Inventory Cost Valuation: $${metrics.summary.inventoryCostValuation}
- Low Stock Items (${metrics.summary.lowStockCount}): ${metrics.lowStockProducts.map(p => p.name).join(", ") || "None"}
- Top Sellers: ${metrics.topSellingProducts.map(p => `${p.name} ($${p.revenue})`).join(", ")}
- Dead Stock Items (${metrics.deadStockProducts.length}): ${metrics.deadStockProducts.map(p => p.name).join(", ")}

Generate a professional JSON response with exact keys:
"executivePulse": 1-2 sentences on overall financial health.
"marginAnalysis": 1-2 sentences on margin efficiency and inventory valuation.
"inventoryAlerts": 1-2 sentences on stock-out risks and dead stock.
"tacticalRecommendations": Array of 3 specific, data-backed business action points.
Output ONLY raw valid JSON without markdown fences.`;

            const systemInstruction = "You are the Senior AI Business Analyst for an e-commerce platform. Provide sharp, executive-level financial analysis and inventory recommendations.";
            const geminiRaw = await callGeminiAI(prompt, systemInstruction);

            if (geminiRaw) {
                try {
                    const cleaned = geminiRaw.replace(/```json/g, "").replace(/```/g, "").trim();
                    aiBrief = JSON.parse(cleaned);
                } catch (e) {
                    console.error("Failed to parse Gemini JSON output, falling back to deterministic brief", e);
                }
            }
        }

        res.json({
            success: true,
            analytics: metrics,
            aiBrief,
            aiEngine: process.env.GEMINI_API_KEY ? "Gemini-2.0-Flash" : "Deterministic-Statistical-AI"
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Endpoint: POST /api/analytics/ask-ai
const askAICopilot = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.json({ success: false, message: "Please provide a question" });
        }

        const metrics = await computeStoreMetrics();

        // 1. Try Gemini Live AI
        if (process.env.GEMINI_API_KEY) {
            const prompt = `Current Store Telemetry:
- Total Gross Revenue: $${metrics.summary.totalRevenue}
- Orders: ${metrics.summary.totalOrders}
- AOV: $${metrics.summary.averageOrderValue}
- Gross Profit: $${metrics.summary.grossProfit} (Margin: ${metrics.summary.grossMarginPercent}%)
- Total Stock Units: ${metrics.summary.totalStockUnits} (Valuation: $${metrics.summary.inventoryCostValuation})
- Low Stock Items: ${metrics.lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(", ") || "None"}
- Top Sellers: ${metrics.topSellingProducts.map(p => `${p.name} (Sold: ${p.unitsSold}, Revenue: $${p.revenue})`).join(", ")}
- Dead Stock Items (0 sales): ${metrics.deadStockProducts.map(p => p.name).join(", ") || "None"}

Store Owner's Question: "${question}"

Provide a concise, analytical response (3-4 sentences maximum) directly answering the question using the telemetry data above. Give specific numbers and actionable steps.`;

            const systemInstruction = "You are the AI Business Analyst and financial co-pilot for the store owner. Be strategic, data-driven, and concise.";
            const geminiAnswer = await callGeminiAI(prompt, systemInstruction);

            if (geminiAnswer) {
                return res.json({
                    success: true,
                    answer: geminiAnswer.trim(),
                    engine: "Gemini-2.0-Flash"
                });
            }
        }

        // 2. Intelligent Deterministic heuristic response
        const q = question.toLowerCase();
        let fallbackAnswer = "";

        if (q.includes("margin") || q.includes("profit")) {
            fallbackAnswer = `Your store operates at a ${metrics.summary.grossMarginPercent}% gross margin, yielding $${metrics.summary.grossProfit.toLocaleString()} in gross profit on $${metrics.summary.totalRevenue.toLocaleString()} revenue. To optimize margins, prioritize scaling top-selling high-margin items while reviewing procurement costs for low-margin SKUs.`;
        } else if (q.includes("stock") || q.includes("reorder") || q.includes("inventory")) {
            const lowCount = metrics.lowStockProducts.length;
            fallbackAnswer = lowCount > 0
                ? `You have ${lowCount} product(s) in the critical reorder zone (≤5 units remaining): ${metrics.lowStockProducts.map(p => p.name).join(", ")}. Total inventory capital on hand is $${metrics.summary.inventoryCostValuation.toLocaleString()} across ${metrics.summary.totalStockUnits} units.`
                : `All ${metrics.summary.totalProducts} active products are adequately stocked with a cumulative inventory valuation of $${metrics.summary.inventoryCostValuation.toLocaleString()} wholesale ($${metrics.summary.inventoryRetailValuation.toLocaleString()} retail).`;
        } else if (q.includes("aov") || q.includes("order value") || q.includes("sales")) {
            fallbackAnswer = `Your Average Order Value (AOV) is currently $${metrics.summary.averageOrderValue}. Implementing bundle discounts or a free-shipping threshold at $${Math.round(metrics.summary.averageOrderValue * 1.3)} will encourage customers to add a complementary item to their carts.`;
        } else {
            fallbackAnswer = `Based on your ${metrics.summary.totalOrders} orders, your store has generated $${metrics.summary.totalRevenue.toLocaleString()} in revenue with a ${metrics.summary.grossMarginPercent}% profit margin. Your primary growth levers are clearing ${metrics.deadStockProducts.length} dead stock items and ensuring high-velocity products remain in stock.`;
        }

        res.json({
            success: true,
            answer: fallbackAnswer,
            engine: "Deterministic-Statistical-AI"
        });

    } catch (error) {
        console.error("AI Copilot Error:", error);
        res.json({ success: false, message: error.message });
    }
};

export { getDashboardAnalytics, askAICopilot };
