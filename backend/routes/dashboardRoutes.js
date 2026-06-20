import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router=Router();

router.get("/",authMiddleware,(req,res)=>{
    try{
        return res.status(200).json({
            message:"welcome to the dashboard",
            userId: req.user.id
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"internal server error"});
    }
});

export default router;