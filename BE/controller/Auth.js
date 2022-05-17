const { SUCCESS_MESSAGE, INVALID_LOGIN_MESSAGE, SECRET_KEY, INVALID_EMAIL, PASSWORD_RESET, EMAIL_OTP } = require("../constant/Config");
const { UserModel } = require("../models/User");
const jwt=require("jsonwebtoken");
const { sendEmail } = require("../middleware/mail");
const redis = require('redis');
const { redisClient} = require("../middleware/redis");
const { REDIS_EXPIRE_PASSWORD_RESET } = require("../constant/Constant");

const loginController=async(req,res,next)=>{
    try{

        const {email,password}=req.body
        const user=await  UserModel.findOne({email:email,password:password});
        if(user){
                const {id:userID,status,userRole,schoolID,userName}=user
                const token=await  jwt.sign(
                            {email:email,id:userID,status,role:userRole,schoolID,userName} , SECRET_KEY )
                return res.status(200).json({message:SUCCESS_MESSAGE,token:token,status:200});
        }
        else {
            return res.status(200).json({message:INVALID_LOGIN_MESSAGE,status:401,token:""});
        }
    }
    catch(error){
        console.log(error);
    }
}

const logout=async(req,res,next)=>{

        try{

        }
        catch(error){

        }

}


const resetPassword=async(req,res,next)=>{
    try{
        const {email}=req.body
        const user=await UserModel.findOne({email:email})
        if(!user){
           return  res.status(400).json({message:INVALID_EMAIL})
        }
        else {
            const randomPassword=parseInt((Math.random()*(900000-100000)+100000));
            const checkPassword=await redisClient.get(`reset-${user._id}`)
            if(checkPassword!==null){
                await redisClient.set(`reset-${user._id}`,randomPassword)
                redisClient.expire(`reset-${user._id}`,REDIS_EXPIRE_PASSWORD_RESET)
                res.status(200).json({message:PASSWORD_RESET})
            }
            else {
                res.status(200).json({message:EMAIL_OTP})
            }
        }
    }
    catch(error){
        console.log(error);
    }
}



const forgotPassword=async(req,res,next)=>{
    try{
        const {email,id}=req.body;
        const randomPassword=await redisClient.get(`reset-${id}`)
        res.status(200).json({message:randomPassword})
    }
    catch(error){
        console.log(error);
    }
}


module.exports={
    loginController,
    resetPassword,
    forgotPassword
}
