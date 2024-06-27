import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://hackkid:Hackkid2846@cluster0.xkjakqu.mongodb.net/buchi-clutter').then(()=>console.log("MongoDB connected"));

}