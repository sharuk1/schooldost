const mongoose = require("mongoose");
const GroupModel = new mongoose.Schema({
    _id:{
        type:String
    },
    
    name:{
        type:String
    },
    batch:{
        type:String
    },
    standard:{
        type:String
    },
    section:{
        type:String
    },
    customProperties:{
        schoolID:{
            type:String
        },
        classTeacherName:{
            type:String
        },
        classTeacherID:{
            type:String
        }
    },
    studentList:{
        type:Array
    },
    teacherList:{
        type:Array
    },
    subjectList:{
        type:Array  
    },
    createdBy:{
        type:String
    },
    type:{
        type:String
    },
    status:{
        type:String
    },
    createdOn:{
        type:Date
    }
},
{
    collection: "Group"
}
);


// GroupModel.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: function (doc, ret) { delete ret._id }

// });

module.exports={ 
    GroupModel:mongoose.model("Group", GroupModel)
};