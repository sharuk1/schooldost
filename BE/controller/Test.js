const { UPDATED_SUCCESS, FAILED_UPDATE ,DELETE_SUCCESS,DELETE_FAILED, STARTED, FAILED, TEST_ALREADY_STARTED,COMPLETED} = require("../constant/Config");
const { AUTO_TEST_QUERY, TEST_QUERY } = require("../constant/Question/TestConstant");
const { handleAutoTest ,queryTestList, handleGetTest, calculateScore} = require("../handler/Test");
const { QuestionModel } = require("../models/Question");
const { TestModel } = require("../models/Test");
const { queryParser, schemaParser, payloadParser } = require("../Utility/Parser");
const moment=require("moment")


const createTest=async(req,res,next)=>{

    try{
        
    }
    catch(error){
        console.log(error)
    }
}


const autoTest=async(req,res,next)=>{

    try{
        const test=await handleAutoTest(req);
        const testCreate=new TestModel(test);
        await testCreate.save();
        res.status(200).json(testCreate)
        
    }
    catch(error){
            console.log(error)
    }
}

const getTestByID=async(req,res,next)=>{
        
        try{
            const {id}=req.params;
            const testData=await TestModel.findById(id);
            let data=handleGetTest(testData)
            if(data.timer===0&&data.state!==COMPLETED){
                const updateTestStatus=await TestModel.findById(id).updateOne({state:COMPLETED})
                data['state']=COMPLETED
            }
            res.status(200).json(data);
        }
        catch(error){
            console.log(error)
        }
    
}

const updateTestByID=async(req,res,next)=>{
        
        try{
            const {id}=req.params;
            let payload=req.body
            let testQuery={}
            if(payload.hasOwnProperty("addedQuestionIds")){
                testQuery={
                        ...testQuery,
                        questions:await QuestionModel.find({"_id":{$in:payload["addedQuestionIds"]}})
                }
               delete  payload['addedQuestionIds']
            }
            if(payload.hasOwnProperty("removedQuestionIds")){
                testQuery={
                    ...testQuery,
                    
                }
               delete  payload['removedQuestionIds']
            }
            const query=schemaParser(AUTO_TEST_QUERY,payload)
            testQuery={
                        ...testQuery,
                        ...query
            }
            const updateTest=await TestModel.updateOne({_id:id},testQuery)
                             .then(({n})=>{
                                    if(n==1){
                                        return res.status(200).json({message:UPDATED_SUCCESS})
                                    }
                                    else {
                                        return res.status(200).json({message:FAILED_UPDATE})
                                    }
            })
        }
        catch(error){
            console.log(error)
            return res.status(200).json({message:FAILED_UPDATE})
        }
}



const deleteTestByID=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {deletedCount}=await TestModel.deleteOne({_id:id});
        if(deletedCount===1){
            res.status(200).json({message:DELETE_SUCCESS})
        }
        else {
            res.status(200).json({message:DELETE_FAILED})
        }
    }
    catch(error){
        res.status(200).json({message:DELETE_FAILED})
    }
}

const getTestList=async(req,res,next)=>{
    try{
        const {offset,count}=req.params
        let {query,status}=queryTestList(req)
        if(!status){
            return res.status(200).json({message:PROVIDE_FIELD})
        }
        const testList=await TestModel.find(query).skip(+offset).limit(+count);
        const testCount=await TestModel.find(query).countDocuments();
        res.status(200).json({data:testList,count:testCount});
        
    }
    catch(error){
        res.status(200).json({message:DELETE_FAILED})
    }
}


const updateAnswerByTest=async(req,res,next)=>{
    try{
        const {id,questionID}=req.params
        const {answer}=req.body
        const test=await TestModel.find({_id:id}).updateOne({[`selection.${questionID}`]:answer}).then(({nModified})=>{
            if(nModified===1){
                res.status(200).json({message:UPDATED_SUCCESS})
            }
            else {
                return res.status(200).json({message:FAILED_UPDATE})
            }
        })
    
        
    }
    catch(error){
        res.status(200).json({message:FAILED_UPDATE})
    }
}

const startTest=async(req,res,next)=>{
    try{
        const {id}=req.params
        const startTime=moment().format();
        const updateTest=await TestModel.findOne({_id:id,startTime:""}).updateOne({startTime:startTime,state:STARTED})
                         .then(({nModified})=>{
                            if(nModified===1){
                                res.status(200).json({message:STARTED})
                            }
                            else {
                                return res.status(200).json({message:TEST_ALREADY_STARTED})
                            }
                         })
    }
    catch(error){
        res.status(200).json({message:FAILED})
    }
}

const endTest=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const endTime=moment().format();
        const testData=await TestModel.findOne({_id:id})
        const {questions,selection}=testData
        const score=calculateScore(questions.toObject(),selection.toObject());
        const {nModified}=await TestModel.findOne({_id:id,endTime:""}).updateOne({endTime:endTime,state:COMPLETED,score:score})
        if(nModified===1){
            return res.status(200).json({message:COMPLETED})
        }
        else {
            return res.status(200).json({message:FAILED_UPDATE})
        }
    }
    catch(error){
        res.status(200).json({message:FAILED})
    }
}


module.exports={
    createTest,
    autoTest,
    getTestByID,
    updateTestByID,
    deleteTestByID,
    getTestList,
    updateAnswerByTest,
    startTest,
    endTest
}