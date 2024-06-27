import userModel from '../models/userModel.js';

// add products to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId );
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
        }
        else
        {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true,message: "Item added to cart"});
    } catch (error) {
      console.log(error);
        res.json({success:false,message: "Item not added to cart"});  
    }
}

//remove products from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true,message: "Item removed from cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message: "Item not removed from cart"});
    }
}

//get user cart
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData});
    } catch (error) {
        console.log(error);
        res.json({success:false,message: "Cart data not found"});
    }
}



export { addToCart, removeFromCart, getCart };