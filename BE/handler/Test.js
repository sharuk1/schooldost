const { schemaParser ,payloadParser} = require("../Utility/Parser")
const { QUESTION_CUSTOM_QUERY, UPDATE_QUESTION_QUERY, QA_TEXT, QA_CONTENT } = require("../constant/Question/QuestionConstant");
const { QuestionModel } = require("../models/Question");
const crypto = require("crypto");
const { CREATED,ACTIVE, MULTIPLE_CHOICE, FILL_IN_THE_BLANK } = require("../constant/Constant");
const moment=require("moment");
const { TEST_QUERY } = require("../constant/Question/TestConstant");
const {STARTED}=require("../constant/Config");

const handleQueries=async(std,subject,queries)=>{
        let questions=[]
        for(let index in queries){
                const query=schemaParser(QUESTION_CUSTOM_QUERY,queries[index]);
                let {count}=queries[index]
                const customQuery={
                    'customProperties.std':std,
                    'customProperties.subject':subject,
                    ...query
                }
                if(count>=20){
                        count=20
                }
                const question=await QuestionModel.find(customQuery).skip(0).limit(+count)
                questions=[...questions,...question]
        }
        return questions
}

const handleAutoTest=async(req)=>{
        try{
        let test={}
        const {name,subject,mode,std,type,queries,timePerQuestion,duration,markPerQuestion,groupID,groupTestID,syllabus}=req.body;        
        const {id,schoolID}=req.userData
        const endTime=moment().add(duration,"seconds").format()
        const startTime=moment().format();
        const questions=await handleQueries(std,subject,queries)
        test={
            _id:crypto.randomBytes(20).toString('hex'),
            status:ACTIVE,
            type:type,
            state:CREATED,
            mode:mode,
            score:0,
            duration,
            markPerQuestion,
            selection:{},
            customProperties:{
                    std:std,
                    assignedBy:id,
                    createdBy:id,
                    subject,
                    groupID,
                    name,
                    groupTestID:groupTestID,
                    syllabus,
                    schoolID
            },
            questions:questions
            
        
        
        }
        return test;
    }
    catch(error){
        console.log(error)
    }
}

const checkTestStatus=(state,startTime,duration )=>{
    let rDuration=0
    if(state===STARTED){
            const endDuration=moment(new Date())
            let currentDuration=moment.duration(endDuration.diff(startTime))
            currentDuration=currentDuration.asSeconds();
            if(currentDuration>=testDuraion){
                rDuration=0;
            }
            else {
                rDuration=testDuration-currentDuration
            }
    }
    return rDuration

}

const handleGetTest=(test)=>{
        const {state,startTime,endTime,duration:testDuration} =test
        const {_id:id,questions,status,type,score,markPerQuestion,selection,customProperties,}=test
        let rDuration=checkTestStatus(state,startTime,testDuration)
        // if(state===STARTED){
        //         const endDuration=moment(new Date())
        //         let currentDuration=moment.duration(endDuration.diff(startTime))
        //         currentDuration=currentDuration.asSeconds();
        //         if(currentDuration>=testDuraion){
        //             rDuration=0;
        //         }
        //         else {
        //             rDuration=testDuration-currentDuration
        //         }
        // }
        return {
            id,
            questions,
            status,
            type,
            state,
            score,
            duration:testDuration,
            markPerQuestion,
            selection,
            ...customProperties,
            startTime,
            endTime,
            timer:rDuration
        }
}

const queryTestList=(req)=>{
 
        const {offset,count}=req.params
        let {query,status}=payloadParser(TEST_QUERY,req.body)
        if(!status){
            return {
                status:false,
                query:{}
            }
        } 
        const { startDate, endDate } = req.body
        if (startDate && endDate) {
            let sDate = new Date(startDate);
            let eDate = new Date(endDate);
            query = {
                ...query,
                'startTime': {
                    '$gt': moment(startDate).format()
                },
                'endTime':{
                        '$lte': moment(endDate).add(1,"days").format()
                }
            }
            delete query['startDate']
            delete query['endDate']
            
        }
        return {
                status:true,
                query:query
        }
}

const calculateScore=(questions,selection)=>{
        let score=0;
        let selectionList=Object.keys(selection)
        for(let index in questions){
                const {_id:id,choices,answer,type}=questions[index]
                if(selectionList.includes(id)){
                        if(type===MULTIPLE_CHOICE){
                            if(selection[id].choice===answer.choice){
                                score+=1;
                            }
                        }
                        else if(type===FILL_IN_THE_BLANK){
                            if(selection[id][QA_TEXT]===answer[QA_CONTENT]){
                                score+=1;
                            }
                        }
                }
        }
        return score;
}


module.exports={
        handleAutoTest,
        queryTestList,
        handleGetTest,
        calculateScore
}