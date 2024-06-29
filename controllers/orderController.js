import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Paystack from 'paystack-api';


const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "https://buchimarkethub.ng";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, { $set: { cartData: {} } });

        const amountInKobo = req.body.amount * 100; // Convert amount to kobo

        const payment = await paystack.transaction.initialize({
            email: req.body.email, // Ensure email is passed in orderData from frontend
            amount: amountInKobo,
            callback_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`
        });

        res.json({ success: true, authorization_url: payment.data.authorization_url });
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
