const mongoose = require("mongoose");
const SchoolModel = new mongoose.Schema({
    _id:{
        type:String
    },
    status:{
        type:String
    },
    customProperties:{
        syllabus:{
            type:String
        },
        state:{
            type:String
        },
        district:{
            type:String
        },
        location:{
            type:String
        },
        schoolName:{
            type:String
        },
        emailID:{
            type:String
        }
    },
    primaryEmail:{
        type:String
    },
    groupList:{
        type:Array
    },
    pictureID:{
        type:String
    },
    
    adminList:{
        type:Array
    },
    teacherList:{
        type:Array
    },
    studentList:{
        type:Array
    },
    emailQuota:{
        allocated:{
            type:Number
        },
        used:{
            type:Number
        }
    },
    smsQuota:{
        allocated:{
            type:Number
        },
        used:{
            type:Number
        }
    },
    standardList:{
        type:Array
    }
},
{
    collection: "School"
}
)


// SchoolModel.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: function (doc, ret) { delete ret._id }

// });

module.exports={ 
    SchoolModel:mongoose.model("School", SchoolModel)
};