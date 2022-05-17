const { SUCCESS_MESSAGE, INVALID_ID ,FAILED_UPDATE,UPDATED_SUCCESS,DELETE_FAILED,DELETE_SUCCESS, PROVIDE_FIELD} = require("../constant/Config");
const { QUESTION_CUSTOM_QUERY, UPDATE_QUESTION_QUERY } = require("../constant/Question/QuestionConstant");
const { handleQuestionCreation, getMetaData } = require("../handler/Question")
const { QuestionModel } = require("../models/Question")
const {  queryParser } = require("../Utility/Parser");


const createQuestion=async(req,res,next)=>{
    try{
            const {data,status}=await handleQuestionCreation(req)
            if(!status){
                res.status(200).json({message:data})
            }
            const question=new QuestionModel(data)
            question.save();
            const {_id}=question
            res.status(200).json({message:SUCCESS_MESSAGE,id:_id})
    }
    catch(error){
        console.log(error)
    }

}

const getQuestionByID=async(req,res,next)=>{
    try{
        const {id}=req.params
        let questionData=await QuestionModel.findById(id)
        if(questionData===null){
            return res.status(200).json({message:INVALID_ID})
        }
        const {customProperties,question,answer,explanation,choices,sharedWith,_id,type,status,uploadedBy,uploadedOn,shared}=questionData
        res.status(200).json({data:{
            id:_id,
            type,
            status,
            uploadedBy,
            uploadedOn,
            shared,
            sharedWith,
            question,
            answer,
            explanation,
            choices,
            ...customProperties
        }})
    }
    catch(error){
        res.status(400).json({message:""})
    }
}

const updateQuestionByID=async(req,res,next)=>{
    try{
        const {id}=req.params
        let {query,status}=queryParser(UPDATE_QUESTION_QUERY,req.body);
        if(!status){
            return res.status(200).json({message:"Missing"})
        }
        console.log(query);
        const updateQuestion=await QuestionModel.updateOne({_id:id},
                query
        ).then(({n})=>{
                if(n==1){
                    return res.status(200).json({message:UPDATED_SUCCESS})
                }
                else {
                    return res.status(200).json({message:FAILED_UPDATE})
                }
        })
    }
    catch(error){
        res.status(400).json({message:""})
    }
}


const deleteQuestionByID=async(req,res,next)=>{
    try{
        const {id}=req.params
        
        const {deletedCount}=await QuestionModel.deleteOne({_id:id});
        if(deletedCount===1){
            res.status(200).json({message:DELETE_SUCCESS})
        }
        else {
            res.status(200).json({message:DELETE_FAILED})
        }
    }
    catch(error){
    }
}


const getQuestionList=async(req,res,next)=>{
    try{
        const {offset,count}=req.params;
        let {query,status}=queryParser(UPDATE_QUESTION_QUERY,req.body)
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const questionList=await QuestionModel.find(query).skip(+offset).limit(+count);
        const questionCount=await QuestionModel.find(query).countDocuments();
        res.status(200).json({data:questionList,count:questionCount});
            
    }
    catch(error){
        res.status(200).json({message:DELETE_FAILED})
    }
}

const getQuestionMetaData=async(req,res,next)=>{
    try{
        const {standard}=req.params
        const {schoolID}=req.userData
        let questionMetaData=[];
        const subjectList=await QuestionModel.find({
            'customProperties.std':standard,
            'customProperties.schoolID':schoolID,
        }).distinct("customProperties.subject")
        
        for(let sIndex in subjectList){
                const unitList=await QuestionModel.find({
                    'customProperties.std':standard,
                    'customProperties.subject':subjectList[sIndex]
                }).distinct('customProperties.unit')
                
                
                let unitObject=[],sCount=0
                for(let uIndex in unitList){
                    
                    
                    let {customProperties:{title}}=await QuestionModel.findOne({
                        'customProperties.std':standard,
                        'customProperties.subject':subjectList[sIndex],
                        'customProperties.unit':unitList[uIndex],
                    })
                    
                    let categoryList=await QuestionModel.find({
                        'customProperties.std':standard,
                        'customProperties.subject':subjectList[sIndex],
                        'customProperties.unit':unitList[uIndex],
                    }).distinct('customProperties.category')
                    
                    let categoryObject={},unitCount=0;
                    for(let cIndex in categoryList){
                        
                        let count=await QuestionModel.find({
                            'customProperties.std':standard,
                            'customProperties.subject':subjectList[sIndex],
                            'customProperties.unit':unitList[uIndex],
                            'customProperties.category':categoryList[cIndex],
                        }).countDocuments();
                        categoryObject[categoryList[cIndex]]=count
                        unitCount+=count;
                    }
                    
                    unitObject=[...unitObject,{
                        unit:unitList[uIndex],
                        category:categoryObject,
                        unitCount:unitCount,
                        title:title
                    }]
                    sCount+=unitCount
                }
                questionMetaData=[...questionMetaData,{
                        subject:subjectList[sIndex],
                        unitList:unitObject,
                        subjectCount:sCount
                }]
        }
        
        console.log(questionMetaData)
        res.status(200).json(questionMetaData);
    }
    catch(error){
        res.status(200).json({message:DELETE_FAILED})
    }
}



module.exports={
    createQuestion,
    getQuestionByID,
    updateQuestionByID,
    deleteQuestionByID,
    getQuestionList,
    getQuestionMetaData
}
