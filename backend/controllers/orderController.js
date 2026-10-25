import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

//global variables
const currency = "inr";
const deliveryCharges = 10;

//gateway initialization
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// Placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User session not found. Please log in." });
        }

        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            address,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User session not found. Please log in as a customer." });
        }

        const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://e-commerceapp-two.vercel.app';

        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
            address,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharges * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//Verify Stripe
const verifyStripe = async (req, res) => {
    const orderId = req.body?.orderId || req.query?.orderId;
    const success = req.body?.success || req.query?.success;
    const userId = req.body?.userId || req.query?.userId;

    try {
        if (success === 'true' || success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            if (userId) {
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
            }
            res.json({ success: true, message: 'Payment Successful' });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: 'Payment Cancelled or Failed' });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};

// Placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
    res.json({ success: false, message: "Razorpay payment method is currently not configured." });
};

// All Orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status from Admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe };
