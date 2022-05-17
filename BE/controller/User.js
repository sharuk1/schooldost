const { UserModel } = require("../models/User")
const { body, validationResult } = require('express-validator');
const { EMAIL_EXIST, UPDATED_SUCCESS, INVALID_STATUS, FAILED_UPDATE, INVALID_ID, DELETE_SUCCESS, USER_NOT_EXIST, PROVIDE_FIELD } = require("../constant/Config");
const crypto = require("crypto");
const { addUserToSchool } = require("../handler/School");
const { USER_STATUS_LIST } = require("../constant/Constant");
const {TempUserModel}=require("../models/TempUser");
const { queryParser } = require("../Utility/Parser");
const { USER_FIELD, USER_QUERY_DB } = require("../constant/QueryField");
const createUser=async(req,res,next)=>{
        try{
            const {status,userName,email,uid,gender,phoneNo,
                    phoneVerified,emailVerified,userRole,schoolID
            }=req.body
            
            const findUser=await UserModel.find({email:email})
            if(findUser.length!==0){
                console.log("user exists");
                return res.json({message:EMAIL_EXIST})
            }
            const notificationToken="";
            const password=parseInt((Math.random()*(900000-100000)+100000));
            const newUser=new UserModel({
                status,
                userName,
                email,
                uid,
                gender,
                password:password,
                phoneNo:phoneNo,
                _id:crypto.randomBytes(20).toString('hex'),
                phoneVerified:false,
                emailVerified:false,
                userRole,
                groupList:[],
                notificationToken,
                schoolID
            })
            await newUser.save();
            console.log(newUser);
            const {_id:userID}=newUser
            const updateUser=await addUserToSchool(schoolID,userID,userRole);
            if(updateUser){
                res.json({message:"successfully created"});
            }
            else {
                res.json({message:"Something went wrong"});
            }
            
            
        }
        catch(error){
            console.log(error);
        }

}

const updateUserStatus=async(req,res,next)=>{
    try{
        const {status,id}=req.params
        if(!USER_STATUS_LIST.includes(status)){
            return res.status(200).json({message:INVALID_STATUS});
        }
        const userStatus=await UserModel.updateOne({_id:id},{
            status:status
        }).then(success=>{
            if(success.n){
                res.status(200).json({message:UPDATED_SUCCESS})
            }
            else {
                res.status(200).json({message:INVALID_ID})
            }
        })
        .catch(error=>{
            res.status(200).json({message:FAILED_UPDATE})
        })
    }
    catch(error){
        res.status(200).json({message:error})
    }
}


const deleteUser=async(req,res,next)=>{
    try{
        const {id}=req.params
        const userInfo=await UserModel.find({_id:id});
        
        if(userInfo.length===0){
            return res.status(200).json({message:USER_NOT_EXIST});
        }
        const {userName,status,email,uid,gender,password,phoneNo,phoneVerified,emailVerified,
        userRole,groupList,notificationToken,schoolID}=userInfo[0]
        const {deletedCount}=await UserModel.deleteOne({_id:id});
        if(deletedCount===1){
            const tempUser=new TempUserModel({
                status,
                userName,
                email,
                uid,
                gender,
                password,
                phoneNo,
                userID:id,
                _id:crypto.randomBytes(20).toString('hex'),
                phoneVerified,
                emailVerified,
                userRole,
                groupList,
                notificationToken,
                schoolID
            })
            await tempUser.save();
            res.status(200).json({message:DELETE_SUCCESS})
        }
        else {
            res.status(200).json({message:INVALID_ID})
        }
    }
    catch(error){
        res.status(200).json({message:error})
    }
}

const updateUserInfo=async(req,res,next)=>{
    try{
        const {id}=req.params
        let {query:data,status}=queryParser(USER_FIELD,req.body)
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const userInfo=await UserModel.updateOne({_id:id},data)
                        .then(success=>{
                            const {n}=success
                            if(n==1){
                                return res.status(200).json({message:UPDATED_SUCCESS});
                            }
                            else {
                                return res.status(200).json({message:INVALID_ID})
                            }
                        })
                        .catch(error=>{
                            return  res.status(200).json({message:error})
                        })
    }
    catch(error){
        res.status(200).json({message:error})
    }
}


const getUserList=async(req,res,next)=>{
    try{
        const {offset,count}=req.params
        let {query,status}=queryParser(USER_FIELD,req.body)
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const userList=await UserModel.find(query).skip(+offset).limit(+count).select(`${USER_QUERY_DB}`);
        const userCount=await UserModel.find(query).countDocuments();
        res.status(200).json({data:userList,count:userCount})
    }
    catch(error){
        res.status(200).json({message:error})
    }
}

const getUserByID=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const userInfo=await UserModel.find({_id:id});
        if(userInfo.length===0){
            res.status(200).json({message:USER_NOT_EXIST});
        }
        else {
            res.status(200).json({data:userInfo[0]});
        }
    }
    catch(error){
    }
}

module.exports={
    createUserController:createUser,
    updateUserStatus,
    deleteUser,
    updateUserInfo,
    getUserList,
    getUserByID
}