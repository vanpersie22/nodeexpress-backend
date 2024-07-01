import dealModel from "../models/dealModel.js";
import fs from "fs";

// add deal items
const addDeal = async (req, res) => { 
    // Process multiple files
    let image_filenames = req.files.map(file => file.filename);

    const deal = new dealModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filenames, // Save as an array of images
        menu: req.body.menu
    })

    try {
        await deal.save();
        res.json({message: "Deal added successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to add deal"})
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
        if (!deal) {
            return res.status(404).json({message: "Deal not found"});
        }

        // Since `deal.image` is an array, iterate over it to delete each image
        deal.image.forEach((filename) => {
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image ${filename}: ${err}`);
                    // Optionally handle the error, e.g., logging or sending a response
                }
            });
        });

        await dealModel.findByIdAndDelete(req.body.id);
        res.json({message: "Deal and associated images removed successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to remove deal"});
    }
}

export { addDeal, allDeals, removeDeal }