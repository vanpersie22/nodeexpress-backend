import dealModel from "../models/dealModel.js";
import fs from "fs";

// add deal items
const addDeal = async (req, res) => { 

    let image_filename = `${req.file.filename}`;

    const deal = new dealModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        menu: req.body.menu
    })

    try {
        await deal.save();
        res.json({message:"Deal added successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Failed to add deal"})
    }

}

//all deals
const allDeals = async (req, res) => {
    try {
        const deals = await dealModel.find({});
        res.json({success:true,data:deals})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Failed to fetch deals"})
    }

}

//remove deal
const removeDeal = async (req, res) => {
    try {
        const deal = await dealModel.findById(req.body.id);
        fs.unlinkSync(`uploads/${deal.image}`,()=>{});

        await dealModel.findByIdAndDelete(req.body.id);
        res.json({message:"Deal removed successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Failed to remove deal"})
    }

}

export { addDeal, allDeals, removeDeal }