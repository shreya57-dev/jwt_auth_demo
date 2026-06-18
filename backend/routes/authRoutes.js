import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

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
    console.log(err);
    res.status(500).send("server error");
}
});


export default router;


