const { SchoolModel } = require("../models/School")
const uuid=require("uuid");
const { ACTIVE, INACTIVE, SUCCESS_MESSAGE, INVALID_ID, UPDATED_SUCCESS, FAILED_UPDATE, INVALID_STATUS, PROVIDE_FIELD } = require("../constant/Config");
const { EMAIL_QUOTA, SMS_QUOTA ,SCHOOL_STATUS_LIST} = require("../constant/Constant");
const { EMAIL_ID_EXISTS } = require("../constant/Message");
const crypto = require("crypto");
const { filterSchoolHandler } = require("../handler/School");
const { propertyRephrase, customPropertiesQuery } = require("../Utility/Parser");


const createSchool=async(req,res,next)=>{
        
        try{
            const {status,syllabus,state,district,location,schoolName,emailID}=req.body
            
            const findSchool=await SchoolModel.find({primaryEmail:emailID});
            if(findSchool.length!==0){
                return res.status(200).json({message:EMAIL_ID_EXISTS});
            }
            
            const schoolSchema=new SchoolModel({
                _id:crypto.randomBytes(20).toString('hex'),
                status:status!==""?ACTIVE:INACTIVE,
                customProperties:{
                    syllabus,
                    state,
                    district,
                    location,
                    schoolName,
                    emailID
                },
                primaryEmail:emailID,
                groupList:[],
                pictureID:'',
                adminList:[],
                teacherList:[],
                studentList:[],
                emailQuota:{
                    allocated:EMAIL_QUOTA,
                    used:0
                },
                smsQuota:{
                    allocated:SMS_QUOTA,
                    used:0
                },
                standardList:[]
            })
            await schoolSchema.save();
            res.status(200).json({message:SUCCESS_MESSAGE,data:schoolSchema});
        }
        catch(error){
            console.log(error)
        }
        
}


const getSchoolByID=async(req,res,next)=>{
        try{
            const {id}=req.params
            const school=await SchoolModel.findById(id)
            if(school){
                res.status(200).json({data:school})
            }
            else {
                res.status(200).json({data:INVALID_ID})
            }
        }
        catch(error){
            res.status(200).json({data:error})
        }
}


const getSchoolList=async(req,res,next)=>{
        try{
            const {offset,count}=req.params
            let query=await filterSchoolHandler(req);
            const school=await SchoolModel.find(query).skip(+offset).limit(+count);
            const schoolCount=await SchoolModel.find(query).countDocuments()
            res.status(200).json({data:school,count:schoolCount});
        }
        catch(error){
            res.status(200).json({data:error})
        }
}


const deleteSchoolByID=async(req,res,next)=>{
    try{
        const {id}=req.params
        const school=await SchoolModel.find({_id:id});
        const deleteSchool=await SchoolModel.deleteOne({_id:id})
    }
    catch(error){
    }
}

const updateStandard=async(req,res,next)=>{
    try{
        const {standardList}=req.body;
        const {id}=req.params;
        const updateStandard=await SchoolModel.updateOne({_id:id},
            {standardList:standardList}
        ).then(success=>{
            res.status(200).json({message:UPDATED_SUCCESS})
        }).catch(error=>{
            res.status(200).json({message:FAILED_UPDATE})
        })
    }
    catch(error){
        res.status(200).json({data:error})
    }
}


const updateSchoolStatus=async(req,res,next)=>{
    try{
        const {status,id}=req.params
        
        if(!SCHOOL_STATUS_LIST.includes(status)) {
            return res.status(200).json({message:INVALID_STATUS})
        }
        const updateStatus=await SchoolModel.updateOne({id:id},{
            status:status
        }).then(success=>{
            res.status(200).json({message:UPDATED_SUCCESS})
        }).catch(error=>{
            res.status(200).json({message:FAILED_UPDATE})
        })
    }
    catch(error){
        res.status(200).json({data:error})
    }
}


const updateSchoolProperty=async(req,res,next)=>{
    try{
        const {id}=req.params
        const {query,status}=customPropertiesQuery(req.body);
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const updatePropery=await SchoolModel.updateOne({_id:id},
            query
        ).then(success=>{
            res.status(200).json({message:UPDATED_SUCCESS})
        }).catch(error=>{
            res.status(200).json({message:FAILED_UPDATE})
        })
    }
    catch(error){
        res.status(200).json({data:error})
    }
}






module.exports={
    createSchoolController:createSchool,
    getSchoolByID,
    getSchoolList,
    updateStandard,
    updateSchoolStatus,
    updateSchoolProperty
}