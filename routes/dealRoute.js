import express from "express"
import { addDeal , allDeals, removeDeal } from "../controllers/dealController.js"
import multer from "multer"

const dealRouter = express.Router();

//image upload

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})

const upload = multer({storage:storage})

dealRouter.post("/add", upload.single("image"),addDeal)
dealRouter.get("/list", allDeals)
dealRouter.post("/remove", removeDeal)






export default dealRouter;