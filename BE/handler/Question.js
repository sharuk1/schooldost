const { MULTIPLE_CHOICE, TRUEORFALSE, FILL_IN_THE_BLANK, QUESTION_TYPE_LIST } = require("../constant/Constant")
const crypto = require("crypto");
const {ACTIVE}=require("../constant/Config");
const { customPropertiesQuery } = require("../Utility/Parser");


const handleQuestionCreation=async(req)=>{
    const {type,std,subject,unit,title,category,question,choices
            ,answer,explanation,videoURL,shared,schoolID,syllabus}=req.body
    
    if(!QUESTION_TYPE_LIST.includes(type)){
            return {
                    status:false,
                    data:'type invalid'
            }
    }
    
    const {id}=req.userData
    
    let questionData={
        _id:crypto.randomBytes(20).toString('hex'),
        type,
        status:ACTIVE,
        uploadedBy:id,
        uploadedOn:new Date(),
        customProperties:{
            std,
            unit,
            subject,
            schoolID,
            title,
            category,
            syllabus,
            qid:`QID_${crypto.randomBytes(20).toString('hex')}`
        },
        question,
        answer,
        explanation,
        shared:shared,
        sharedWith:[],
    }
    
    if(type===MULTIPLE_CHOICE){
        questionData={
                        ...questionData,
                        choices
        }
    }
    else if(type===TRUEORFALSE){
        questionData={
                        ...questionData,
                        choices:{}
        }
    }
    else if(type===FILL_IN_THE_BLANK){
        questionData={
            ...questionData,
            choices:{}
        }
    }
    return {
        data:questionData,
        status:true
    };
}

const getMetaData=(questionData)=>{
        const subjectList=[...new Set(questionData.map(({customProperties:{subject}})=>subject))]
        // console.log(subjectList);
        const unitList=questionData.filter(({customProperties:{unit,subject}})=>subjectList[0]===subject)
        console.log(unitList)
        
        let questionMetaData=[];
        
        for(let index in subjectList){
                
                for(let qIndex in questionData){
                        
                }
        }
        
        return subjectList
}

module.exports={
    handleQuestionCreation,
    getMetaData
}