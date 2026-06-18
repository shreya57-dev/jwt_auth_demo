import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js';

const app=express();

app.use(cors());
app.use(express.json());//parses incoming json requests and put data in req.body

app.use("/auth",authRouter);

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});