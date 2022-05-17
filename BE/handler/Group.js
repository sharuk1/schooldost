const { GROUP_EXISTS } = require("../constant/Config");
const { GroupModel } = require("../models/Group");
const { SchoolModel } = require("../models/School");


//checking the  group if exists 
const groupExists=async(req)=>{
    
    const {groupName,standard,batch,status,schoolID,section,type}=req.body
    const query={
        batch,
        name:groupName,
        'customProperties.schoolID':schoolID
    }
    const group=await GroupModel.find(query);
    if(group.length!==0){
        return true
    }
    else {
        return false;
    }
}


const updateGroupToSchool=async(groupID,schoolID,name,batch,status)=>{
    try{
        const groupInfo={
            name,
            id:groupID,
            batch,
            status
        }
        const school=await SchoolModel.updateOne({_id:schoolID},{
            $push:{
                       [`groupList`]:groupInfo
            }   
           }).then(success=>{
               console.log(success);
           })
           .catch(err=>{
               console.log(err);
           })
           return true
    }
    catch(error){
        return false
    }
}

const filterGroup=(data)=>{
    try{
        
    }
    catch(error){
            return false        
    }
}


module.exports={
    groupExistHandler:groupExists,
    updateGroupToSchoolHandler:updateGroupToSchool,
}