import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    price: {type:Number,required:true},
    image: {type:String,required:true},
    menu: {type:String,required:true},
});

const dealModel = mongoose.models.deal || mongoose.model("deal",dealSchema)

export default dealModel;