const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
    _id:{
        type:String
    },
    status:{
            type:String
    },
    userName:{
        type:String
    },
    createdBy:{
        type:String
    },
    email:{
        type:String
    },
    uid:{
        type:String
    },
    gender:{
        type:String
    },
    password:{
        type:String
    },
    phoneNo:{
        type:Number
    },
    phoneVerified:{
        type:Boolean
    },
    emailVerified:{
        type:Boolean
    },
    userRole:{
        type:String
    },
    groupList:{
        type:Array
    },
    notificationToken:{
        type:String
    },
    schoolID:{
            type:String
    }
},
    {
        collection: "User"
    }
)



module.exports={ 
     UserModel:mongoose.model("User", UserModel)
};