import jwt from 'jsonwebtoken'
const authMiddleware =async (req, res, next)=>{
        const token = req.cookies?.AccessToken || req.header('authorization')?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({
                "error":true,
                "message":"No Token"
            })
        }
        jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (error , user)=>{
            if(error){
                return res.status(401).json({
                    "error":true,
                    "message":"Verification failed"
                })
            }else{
                req.user= user;
                next();
            }
            
        })
}
//try uniting them


import { User } from './model/user.js'
const generateAccessTokenUtils = async (userID)=>{
    try{
        const user = await User.findById(userID)
        const AccessToken = user.generateAccessToken()
        console.log(AccessToken)
        return AccessToken
    }catch(error){
        return false
    }
}
const generateRefreshTokenUtils = async (userID)=>{
    try{
        const user = await User.findById(userID)
        const RefreshToken = user.generateRefreshToken()
        console.log(RefreshToken)
        user.refreshToken=RefreshToken;
        await user.save({validateBeforeSave:false})
        return RefreshToken
    }catch(error){
        return false
    }
}


import nodemailer from 'nodemailer';
const otpGeneratorAndMailer = async (userEmail)=>{
    try{
        const user=await User.findOne({email:userEmail})
        const otp = await user.generateOTP();
        return otp
    }catch(error){
        return false
    }
}

import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


const mailUtil = (email , text )=>{
    
   let transporter = nodemailer.createTransport({
    service:'outlook',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
    })
    let mailInfo = {
    from:process.env.EMAIL, 
    to:email,
    text:text
    }
    transporter.sendMail(mailInfo , (error , info)=>{
    if(!info){
        console.log(error)
    }else{
        console.log(info)
    }
    })
}

export { authMiddleware,generateAccessTokenUtils , generateRefreshTokenUtils , otpGeneratorAndMailer , mailUtil}