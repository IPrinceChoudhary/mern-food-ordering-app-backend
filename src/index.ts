import express, {Request, Response} from "express";
import cors from "cors"
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("connected to db"))

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response)=>{
  res.send({message: "Health OK!"})
})

app.use("/api/my/user", myUserRoute) // using my in a route indicates that these routes are related to something with the current logged in user, one of the convention in REST API

app.listen(7000,()=>{
  console.log("started in 7000")
})