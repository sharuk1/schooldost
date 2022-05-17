
const {GroupModel}=require("../models/Group")
const uuid=require("uuid");
const { GROUP_CREATED, GROUP_EXISTS, PROVIDE_FIELD,FAILED_UPDATE,UPDATED_SUCCESS ,INVALID_STATUS,DELETE_FAILED,DELETE_SUCCESS, INVALID_ID, SUCCESS_ADD, USER_PRESENT, USER_NOT_EXIST} = require("../constant/Config");
const { groupExistHandler,updateGroupToSchoolHandler } = require("../handler/Group");
const crypto = require("crypto");
const { customPropertiesQuery, queryParser } = require("../Utility/Parser");
const { SchoolModel } = require("../models/School");
const { SCHOOL_STATUS_LIST, STUDENT, TEACHER } = require("../constant/Constant");
const { FILTER_GROUP_FIELD } = require("../constant/QueryField");
const { UserModel } = require("../models/User");



const createGroup=async(req,res,next)=>{
    
    try{
        const groupExists=await groupExistHandler(req);
        if(groupExists){
            return res.status(200).json({message:GROUP_EXISTS})
        }
        const {groupName,standard,batch,status,schoolID,section,type}=req.body
        const {id}=req.userData
        const group=new GroupModel({
            _id:crypto.randomBytes(20).toString('hex'),
            name:groupName,
            batch,
            standard,
            section,
            customProperties:{
                schoolID,
                classTeacherName:"",
                classTeacherID:''
            },
            studentList:[],
            teacherList:[],
            subjectList:[],
            createdBy:id,
            type,
            createdOn:new Date(),
            status
        })
        
        await group.save()
        
        const {_id:groupID}=group;
        
        const updateStatus=await updateGroupToSchoolHandler(groupID,schoolID,groupName,batch,status)
        
        if(updateStatus){
            res.status(200).json({message:GROUP_CREATED})
        }
        
    }
    catch(error){
        console.log(error);
    }
}


const updateGroupProperty=async(req,res,next)=>{
    try{
        const {id}=req.params
        const {query,status}=customPropertiesQuery(req.body);
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const updatePropery=await GroupModel.updateOne({_id:id},
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

const updateGroupStatus=async(req,res,next)=>{
    try{
        const {id,status}=req.params;
        if(!SCHOOL_STATUS_LIST.includes(status)) {
            return res.status(200).json({message:INVALID_STATUS})
        }
        const updateStatus=await GroupModel.updateOne({_id:id},{
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

const deleteGroup=async(req,res,next)=>{
    try{
        const {id}=req.params
        const {deletedCount}=await GroupModel.deleteOne({_id:id})
        if(deletedCount===1){
            const deleteSchoolEntry=await SchoolModel.updateOne({},{$pull:{groupList:{id:id}}})
            res.status(200).json({message:DELETE_SUCCESS});
        }
        else {
            res.status(200).json({message:INVALID_ID})
        }
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

const getGroupByID=async(req,res,next)=>{
    try{
        const {id}=req.params
        const groupInfo=await GroupModel.findById(id);
        if(groupInfo){
            res.status(200).json({data:groupInfo})
        }
        else {
            res.status(200).json({data:INVALID_ID})
        }
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

const getGroupList=async(req,res,next)=>{
    try{
        const {offset,count}=req.params
        let {query,status}=queryParser(FILTER_GROUP_FIELD,req.body);
        if(!status){
            return res.status(200).json({message:""})
        }
        const group=await GroupModel.find(query).skip(+offset).limit(+count);
        const groupCount=await GroupModel.find(query).countDocuments()
        res.status(200).json({data:group,count:groupCount});
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

const addUserToGroup=async(req,res,next)=>{
    try{
        const {id,role,subject}=req.body
        const {id:groupID}=req.params
        
        const userInfo=await UserModel.find({_id:id})
        if(userInfo.length===0){
            return res.status(200).json({message:USER_NOT_EXIST})
        }
        const {userName,email,groupList}=userInfo[0]
        if(groupList.includes(groupID)){
            return res.status(200).json({message:`${USER_PRESENT} in the group`})
        }
        let uRole=role.toLowerCase()
        let userEntry={}
        if(role===STUDENT){
            userEntry={
                name:userName,
                email,
                id
            }
        }
        else if(role===TEACHER){
            userEntry={
                name:userName,
                email,
                subject,
                id
            }
        }
        
        
        const updateGroup=await GroupModel.updateOne({_id:groupID},{
            $push:{
                [`${uRole}List`]:userEntry
            }
        }).then( async success=>{
                const{n:isUpdated} =success
                if(isUpdated){
                    const userUpdate=await UserModel.updateOne({_id:id},{
                        $push:{
                                'groupList':groupID
                        }
                        }).then(success=>{
                           return  res.status(200).json({message:SUCCESS_ADD})    
                        })
                        .catch(error=>{
                           return  res.status(200).json({message:error})
                        })
                }
                else {
                    return res.status(200).json({message:FAILED_UPDATE})
                }
                
        }).catch(error=>{
            res.status(200).json({message:error});
        })
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

const addSubjectToGroup=async(req,res,next)=>{
    try{
        const {subjectList}=req.body
        const {id}=req.params
        const updateSubject=await GroupModel.updateOne({_id:id},{
            $push:{
                'subjectList':subjectList
            }
        }).then(status=>{
                const {n:isUpdated}=status
                if(isUpdated){
                    return res.status(200).json({message:UPDATED_SUCCESS})
                }
                else {
                    return res.status(200).json({message:FAILED_UPDATE})
                }
        })
        
    }
    catch(error){
        res.status(200).json({data:error})
    }
}


const getUserListGroup=async(req,res,next)=>{
    try{
        const {id,role}=req.params
        const groupInfo=await GroupModel.find({_id:id})
        if(groupInfo.length===0){
            res.status(200).json({message:USER_NOT_EXIST});
        }
        else {
            let {studentList,teacherList}=groupInfo[0]
            res.status(200).json({studentList,teacherList})
        }
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

const deleteUserGroup=async(req,res,next)=>{
    try{
        const {id,userID}=req.params
        
        const userInfo=await UserModel.find({_id:userID})
        
        if(userInfo.length===0){
            return res.status(200).json({message:USER_NOT_EXIST})
        }
        else {
            const {userRole:role}=userInfo[0];
            const uRole=role.toLowerCase()
            const updateGroup=await GroupModel.updateOne({},{
                $pull:{
                [`${uRole}List`]:{id:userID}
                }
                
            })
            console.log(updateGroup);
            res.status(200).json({message:DELETE_SUCCESS})
        }
        
        
    }
    catch(error){
        res.status(200).json({data:error})
    }
}

module.exports={
    createGroupController:createGroup,
    updateGroupProperty,
    updateGroupStatus,
    deleteGroup,
    getGroupByID,
    getGroupList,
    addUserToGroup,
    addSubjectToGroup,
    getUserListGroup,
    deleteUserGroup
}

