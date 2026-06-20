import jwt from "jsonwebtoken";

const authMiddleware=async(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return res.status(401).json({
                message:"User is not authenticated"
            });
        }
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        req.user=decoded;
        return next();
    }
    catch(err){
        console.error(err);
        return res.status(401).json({
            message:"Invalid or expireed token!!"
        });
    }
}

export default authMiddleware;