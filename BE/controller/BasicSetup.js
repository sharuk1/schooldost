const { ACTIVE } = require("../constant/Config");
const { STATE_BOARD, SUPER_ADMIN_EMAIL, ADMIN_USER_NAME, HASH_PASSWORD, PHONE_NUMBER ,SUPER_ADMIN} = require("../constant/Constant");
const { SchoolModel } = require("../models/School")
const { UserModel } = require("../models/User")
const crypto = require("crypto");


class BasicSetup{
    
    constructor(){
        this.createSuperAdminUser();
    }
    
   async createSuperAdminUser(){
        try{
            const user=await UserModel.find({userRole:SUPER_ADMIN});
            if(user.length!==0){
                return false        
            }
            else {
                const newUser=new UserModel({
                    status:ACTIVE,
                    userName:ADMIN_USER_NAME,
                    email:SUPER_ADMIN_EMAIL,
                    uid:"12121",
                    gender:"MALE",
                    password:HASH_PASSWORD,
                    phoneNo:PHONE_NUMBER,
                    _id:crypto.randomBytes(20).toString('hex'),
                    phoneVerified:false,
                    emailVerified:false,
                    userRole:SUPER_ADMIN,
                    groupList:[],
                    notificationToken:"123123123",
                    schoolID:"SCHOOLDOST"
                })
                await newUser.save();
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
   async createAdminSchool(){
        try{
            
            const adminSchoolExists=await SchoolModel.find({primaryEmail:SUPER_ADMIN_EMAIL})
            if(adminSchoolExists){
                return false;
            }
            const schoolSchema=new SchoolModel({
                _id:crypto.randomBytes(20).toString('hex'),
                status:ACTIVE,
                customProperties:{
                    syllabus:STATE_BOARD,
                    state:"TAMIL NADU",
                    district:"TAMIL NADU",
                    location:"TAMIL NADU",
                    schoolName:"School Dost",
                    emailID:SUPER_ADMIN_EMAIL
                },
                primaryEmail:SUPER_ADMIN_EMAIL,
                groupList:[],
                pictureID:'',
                role:{
                    admin:{
                    },
                    teacher:{
                    }
                },
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
        }
        catch(error){
            
        }
}
}






module.exports={
    BasicSetup
}