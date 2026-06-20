import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "JsonWebToken";
import authMiddleware from "../middleware/authMiddleware.js";

const router=Router();

router.post("/register",async(req,res)=>{
    try{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            message:"all fields are required"});
    }

    const result=await pool.query(
        "SELECT * FROM users WHERE email=$1",[email]
    );
    if(result.rows.length>0)//email already exists
    {
        return res.status(400).json({
            message:"user already exists!"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await pool.query(
        "INSERT INTO users (name,email,password) VALUES($1,$2,$3)",[name,email,hashedPassword]
    )
    return res.status(201).json({
        message:"WOOHOO!! Registration is successful!"
    });
}
catch(err){
    console.error(err);
    res.status(500).send("server error");
}
});

router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"email and password is required"
            });
        }
        const result=await pool.query(
            "SELECT * FROM users WHERE email=$1",[email]
        );
        if(result.rows.length==0){//email does not exist
            return res.status(400).json({
                message:"invalid email or password"
            });
        }
         const user=result.rows[0];
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"invalid email or password"
            });
        }
        
            const token=jwt.sign(//generating jwt token if the passsword matches
                {
                    id:user.id
                },process.env.JWT_SECRET,
                {
                    expiresIn:"7d"
                }
            );
            return res.status(200).json({
                message:"Login successful!",
                token
            });
        
        
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"internal server error"});
    }
});



export default router;


