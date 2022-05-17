const { ADMIN, TEACHER } = require("../constant/Constant");
const { STATUS } = require("../constant/Payload");
const { SchoolModel } = require("../models/School");
const { customPropertiesQuery } = require("../Utility/Parser");

const filterSchoolHandler=async(req,res,next)=>{
    const queryList=req.body
    const key=Object.keys(queryList);
    let query={};
    for(let index in key){
        if(key[index]===STATUS){
            query={
                ...query,
                status:queryList[key[index]]
            }
        }
        else {
            query={
                ...query,
                [`customProperties.${key[index]}`]:queryList[key[index]]
            }
        }
        
    }
    return query;
}

const addUserToSchool=async(schoolID,id,role)=>{
    
    let uRole=role.toLowerCase()
    try{
        const school=await SchoolModel.updateOne({_id:schoolID},{
         $push:{
                    [`${uRole}List`]:id
         }   
        }).then(success=>{
            console.log(success);
        })
        .catch(err=>{
            console.log(err);
        })
        return true;
    }
    catch(error){
        return false;
    }
}



module.exports={
    filterSchoolHandler,
    addUserToSchool,
}