import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const Analytics = ({ token }) => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [aiBrief, setAiBrief] = useState(null);
    const [aiEngine, setAiEngine] = useState('Deterministic-Statistical-AI');

    // Copilot Q&A state
    const [question, setQuestion] = useState('');
    const [askingAi, setAskingAi] = useState(false);
    const [copilotAnswer, setCopilotAnswer] = useState(null);

    // Quick stock edit state
    const [editingStockId, setEditingStockId] = useState(null);
    const [tempStock, setTempStock] = useState('');
    const [tempCost, setTempCost] = useState('');

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/analytics/dashboard`, {
                headers: { token }
            });

            if (response.data.success) {
                setAnalytics(response.data.analytics);
                setAiBrief(response.data.aiBrief);
                setAiEngine(response.data.aiEngine || 'Deterministic-Statistical-AI');
            } else {
                toast.error(response.data.message || 'Failed to fetch analytics');
            }
        } catch (error) {
            console.error('Fetch Analytics Error:', error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAskAi = async (customPrompt) => {
        const queryToAsk = customPrompt || question;
        if (!queryToAsk.trim()) {
            toast.warning('Please enter a question or click a prompt');
            return;
        }

        try {
            setAskingAi(true);
            setCopilotAnswer(null);

            const response = await axios.post(
                `${backendUrl}/api/analytics/ask-ai`,
                { question: queryToAsk },
                { headers: { token } }
            );

            if (response.data.success) {
                setCopilotAnswer({
                    query: queryToAsk,
                    answer: response.data.answer,
                    engine: response.data.engine
                });
                if (!customPrompt) setQuestion('');
            } else {
                toast.error(response.data.message || 'AI request failed');
            }
        } catch (error) {
            console.error('Ask AI Error:', error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setAskingAi(false);
        }
    };

    const handleSaveStock = async (productId) => {
        try {
            const payload = { id: productId };
            if (tempStock !== '') payload.stock = Number(tempStock);
            if (tempCost !== '') payload.costPrice = Number(tempCost);

            const response = await axios.post(
                `${backendUrl}/api/product/update-stock`,
                payload,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Stock & cost updated!');
                setEditingStockId(null);
                fetchAnalytics();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Update Stock Error:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAnalytics();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-gray-500">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium text-sm">Computing financial metrics & AI analysis...</p>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No analytics data available yet. Place an order or add products to get started.</p>
                <button
                    onClick={fetchAnalytics}
                    className="mt-4 px-4 py-2 bg-black text-white text-sm rounded cursor-pointer"
                >
                    Retry
                </button>
            </div>
        );
    }

    const { summary, productList = [], categoryBreakdown = [] } = analytics;

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-800">AI Store & Inventory Intelligence</h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {aiEngine.includes('Gemini') ? 'Gemini 2.0 AI Live' : 'Deterministic Statistical AI'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Executive sales analytics, profit margin telemetry, and automated AI inventory diagnostics.
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="self-start sm:self-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-2"
                >
                    <span>🔄</span> Refresh Telemetry
                </button>
            </div>

            {/* Top Row - 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Gross Revenue & Margin */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <span>Total Gross Revenue</span>
                            <span>💰</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {currency}{summary.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Gross Profit:</span>
                        <span className="font-semibold text-emerald-600">
                            {currency}{summary.grossProfit.toLocaleString()} ({summary.grossMarginPercent}%)
                        </span>
                    </div>
                </div>

                {/* 2. Orders & AOV */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <span>Orders & Velocity</span>
                            <span>📦</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {summary.totalOrders} <span className="text-sm font-normal text-gray-500">Orders</span>
                        </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Avg Order Value (AOV):</span>
                        <span className="font-semibold text-gray-800">{currency}{summary.averageOrderValue}</span>
                    </div>
                </div>

                {/* 3. Inventory Capital */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <span>Inventory Capital</span>
                            <span>🏭</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {summary.totalStockUnits} <span className="text-sm font-normal text-gray-500">Units</span>
                        </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Cost Value:</span>
                        <span className="font-semibold text-gray-800">{currency}{summary.inventoryCostValuation.toLocaleString()}</span>
                    </div>
                </div>

                {/* 4. Stock Health Risk */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <span>Stock Risk Radar</span>
                            <span>⚠️</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {summary.lowStockCount + summary.outOfStockCount}{' '}
                            <span className="text-sm font-normal text-gray-500">Alerts</span>
                        </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Critical (≤5 units):</span>
                        <span className={`font-semibold ${summary.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {summary.lowStockCount} SKUs
                        </span>
                    </div>
                </div>
            </div>

            {/* Featured AI Executive Brief Card */}
            {aiBrief && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-700 pb-3">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">✨</span>
                            <h2 className="text-lg font-bold text-white tracking-wide">
                                Automated AI Executive Brief
                            </h2>
                        </div>
                        <span className="text-xs text-gray-400">
                            Synthesized from {summary.totalProducts} SKUs & {summary.totalOrders} Transactions
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {/* Column 1: Financial & Margin Pulse */}
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/60 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span>📈</span> Financial & Margin Pulse
                            </span>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                {aiBrief.executivePulse}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 border-t border-gray-700/50 pt-2">
                                {aiBrief.marginAnalysis}
                            </p>
                        </div>

                        {/* Column 2: Inventory Anomaly & Stock Radar */}
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/60 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span>⚠️</span> Inventory Risk Radar
                            </span>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                {aiBrief.inventoryAlerts}
                            </p>
                        </div>

                        {/* Column 3: Tactical Growth Actions */}
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/60 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span>🎯</span> Tactical Next Actions
                            </span>
                            <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                                {Array.isArray(aiBrief.tacticalRecommendations) &&
                                    aiBrief.tacticalRecommendations.map((rec, i) => (
                                        <li key={i} className="leading-relaxed">
                                            {rec}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Interactive "Ask Store Copilot" Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <h2 className="text-base font-bold text-gray-800">Ask Store AI Copilot</h2>
                    <span className="text-xs text-gray-400 font-normal ml-2">
                        Query financial velocity, restock schedules, or margin optimization
                    </span>
                </div>

                {/* Prompt Pills */}
                <div className="flex flex-wrap gap-2 my-3">
                    {[
                        'Which category generates the highest profit margin?',
                        'Which products are at critical risk of stock-out?',
                        'How can I increase Average Order Value (AOV)?',
                        'What dead stock should I bundle to liberate cash?'
                    ].map((promptText, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAskAi(promptText)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full border border-gray-300 transition-colors cursor-pointer text-left"
                        >
                            💬 {promptText}
                        </button>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="flex gap-2 mt-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                        placeholder="Type any business or inventory question (e.g. 'What is my current inventory runway?')..."
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                    <button
                        onClick={() => handleAskAi()}
                        disabled={askingAi}
                        className="px-5 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        {askingAi ? 'Analyzing...' : 'Ask AI'}
                    </button>
                </div>

                {/* Answer Display */}
                {copilotAnswer && (
                    <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-gray-800">
                        <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
                            <span>Q: {copilotAnswer.query}</span>
                            <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                                {copilotAnswer.engine}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-800 mt-1 whitespace-pre-line">
                            {copilotAnswer.answer}
                        </p>
                    </div>
                )}
            </div>

            {/* Category Revenue Contribution Breakdown */}
            {categoryBreakdown.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span>📊</span> Category Revenue Contribution
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {categoryBreakdown.map((cat, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">{cat.category}</span>
                                    <span>{cat.sharePercent}% Share</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {currency}{cat.revenue.toLocaleString()}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div
                                        className="bg-black h-1.5 rounded-full"
                                        style={{ width: `${Math.min(100, cat.sharePercent)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 block">
                                    {cat.unitsSold} units ordered
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Stock, Velocity & Margin Matrix */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">Product Velocity & Margin Matrix</h2>
                        <p className="text-xs text-gray-500">
                            Monitor unit-level stock runway, cost price vs selling price, and estimated gross margin.
                        </p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded">
                        Total SKUs: {productList.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4">Product</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Stock Level</th>
                                <th className="py-3 px-4">Selling Price</th>
                                <th className="py-3 px-4">Cost Price</th>
                                <th className="py-3 px-4">Margin %</th>
                                <th className="py-3 px-4">Units Sold</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {productList.map((prod) => {
                                const isEditing = editingStockId === prod.id;
                                const marginPct =
                                    prod.price > 0 ? Math.round(((prod.price - prod.costPrice) / prod.price) * 100) : 0;

                                let stockStatusBadge = (
                                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                        Optimal ({prod.stock})
                                    </span>
                                );
                                if (prod.stock === 0) {
                                    stockStatusBadge = (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                                            Out of Stock (0)
                                        </span>
                                    );
                                } else if (prod.stock <= 5) {
                                    stockStatusBadge = (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                                            Low Stock ({prod.stock})
                                        </span>
                                    );
                                }

                                return (
                                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900 flex items-center gap-2.5">
                                            {prod.image ? (
                                                <img
                                                    src={prod.image}
                                                    alt={prod.name}
                                                    className="w-8 h-8 rounded object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                            )}
                                            <span className="truncate max-w-[200px]" title={prod.name}>
                                                {prod.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{prod.category}</td>
                                        <td className="py-3 px-4">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={tempStock}
                                                    onChange={(e) => setTempStock(e.target.value)}
                                                    className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-xs"
                                                    placeholder={prod.stock.toString()}
                                                />
                                            ) : (
                                                stockStatusBadge
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            {currency}{prod.price}
                                        </td>
                                        <td className="py-3 px-4">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={tempCost}
                                                    onChange={(e) => setTempCost(e.target.value)}
                                                    className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-xs"
                                                    placeholder={prod.costPrice.toString()}
                                                />
                                            ) : (
                                                <span className="text-gray-500">{currency}{prod.costPrice}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`font-semibold ${
                                                    marginPct >= 40
                                                        ? 'text-emerald-600'
                                                        : marginPct >= 20
                                                        ? 'text-gray-700'
                                                        : 'text-amber-600'
                                                }`}
                                            >
                                                {marginPct}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 font-medium">
                                            {prod.unitsSold} units
                                        </td>
                                        <td className="py-3 px-4">
                                            {isEditing ? (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleSaveStock(prod.id)}
                                                        className="px-2 py-1 bg-black text-white text-[11px] rounded hover:bg-gray-800 cursor-pointer"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingStockId(null)}
                                                        className="px-2 py-1 border border-gray-300 text-gray-600 text-[11px] rounded hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingStockId(prod.id);
                                                        setTempStock(prod.stock.toString());
                                                        setTempCost(prod.costPrice.toString());
                                                    }}
                                                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                                                >
                                                    Edit Stock/Cost
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
