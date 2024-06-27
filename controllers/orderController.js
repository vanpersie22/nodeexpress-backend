import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://buchi-clutter-frontend.onrender.com";

    try {
        // Create a new order with request body data
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        // Clear the user's cart after placing an order
        await userModel.findByIdAndUpdate(req.body.userId, { $set: { cartData: {} } });

        // Prepare line items for Stripe checkout
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'INR',
                product_data: {
                    name: item.name,
                },
                // Assuming item.price is already in INR, convert to paise
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        // Add delivery charge as a separate line item
        line_items.push({
            price_data: {
                currency: 'INR',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: 200 * 100, // Delivery charge in paise
            },
            quantity: 1,
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Respond with the session URL for the frontend to redirect
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Order placement failed. Please try again later." });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: "true" });
            res.json({ success: true, message: "Order placed successfully" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order placement failed. Please try again later." });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Order placement failed. Please try again later." });
    }
}

// user orders

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({ success: true, data:orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch orders. Please try again later." });
    }
}

//orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data:orders });
    } catch (error) {
       console.log(error); 
         res.json({ success: false, message: "Failed to fetch orders. Please try again later." });
    }

}

//api for updating order status
const updateStatus  = async  (req, res) => {
try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
    res.json({ success: true, message: "Order status updated successfully" });
} catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to update order status. Please try again later." });
}
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus};
