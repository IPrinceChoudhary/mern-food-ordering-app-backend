import express, {Request, Response} from "express";
import cors from "cors"
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
import myRestaurantRoute from "./routes/MyRestaurantRoute"
import restaurantRoute from "./routes/RestaurantRoute"
import {v2 as cloudinary} from 'cloudinary'
import orderRoute from "./routes/OrderRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("connected to db"))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response)=>{
  res.send({message: "Health OK!"})
})

app.use("/api/my/user", myUserRoute) // using my in a route indicates that these routes are related to something with the current logged in user, one of the convention in REST API
app.use("/api/my/restaurant", myRestaurantRoute)
app.use("/api/restaurant", restaurantRoute)
app.use("/api/order", orderRoute)

app.listen(7000,()=>{
  console.log("started in 7000")
})