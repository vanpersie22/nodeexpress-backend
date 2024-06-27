import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import dealRouter from "./routes/dealRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

// api routes
app.use("/api/deal", dealRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart/",cartRouter)
app.use("/api/order", orderRouter)


app.get("/", (req, res) => res.status(200).send("Hello World"))

// listen
app.listen(port,() => {
    console.log(`Listening on http://localhost:${port}`)
})
