const { handleCreateCourse, handleTopic, handleCourseTopic } = require("../handler/Course")
const { CourseModel } = require("../models/Course")
const {ALREADY_COURSE_FOUND, COURSE_SCHEMA_PROPERTIES,COURSE_NOT_FOUND, COURSE_TITLE_SCHEMA_PROPERTIES, COURSE_TOPIC_SCHEMA_PROPERTIES}=require("../constant/CourseConstant")
const { UPDATED_SUCCESS, FAILED_UPDATE ,DELETE_SUCCESS,DELETE_FAILED, STARTED, FAILED, TEST_ALREADY_STARTED,COMPLETED,SUCCESS_MESSAGE,} = require("../constant/Config");
const { updateParser, updateSchemaParser } = require("../Utility/Parser");
const crypto = require("crypto");

const createCourse=async(req,res,next)=>{
    
    try{
        
        const {name,standard,syllabus}=req.body
        
        const findCourse=await CourseModel.find({name,standard,syllabus})
        if(findCourse.length!==0){
            return res.status(200).json({message:ALREADY_COURSE_FOUND})
        }
        else {
            const course=handleCreateCourse(req)
            const courseCreate=new CourseModel(course)
            await courseCreate.save()
            res.status(200).json({message:SUCCESS_MESSAGE,id:course._id})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }

}

const deleteCourse=async(req,res,next)=>{
    try{
        const {id}=req.params
        const {deletedCount}=await CourseModel.findOne({_id:id}).deleteOne({_id:id});
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

const getCourseById=async(req,res,next)=>{
    try{
        const {id}=req.params
        const course=await CourseModel.findById(id)
        if(course.length!==0){
            res.status(200).json({data:course,message:SUCCESS_MESSAGE})
        }
        else {
            res.status(200).json({message:FAILED})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}

const updateCourse=async(req,res,next)=>{
    try{
        const query=updateParser(COURSE_SCHEMA_PROPERTIES,req.body)
        console.log(query)
        const {id}=req.params
        const {nModified}=await CourseModel.findOne({_id:id}).updateOne(query)
        if(nModified===1){
            return res.status(200).json({message:COMPLETED})
        }
        else {
            return res.status(200).json({message:FAILED_UPDATE})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}


const createCourseTitle=async(req,res,next)=>{
    try{
        const {id}=req.params
        
        const course=await CourseModel.findOne({_id:id})
        if(course){
             
                const {title:titleList}=course
                const {status,data}=handleTopic(req,titleList.toObject())
                if(!status){
                    return res.status(200).json({message:data})
                }
                const {nModified}=await CourseModel.updateOne({_id:id},
                        {$push:{'title':data } })
                if(nModified===1){
                            return res.status(200).json({message:COMPLETED,id:data._id})
                }
                else {
                            return res.status(200).json({message:FAILED_UPDATE})
                }
        }
        else {
                return res.status(200).json({message:COURSE_NOT_FOUND})
        }
        
    }
    catch(error){
        res.status(400).json({message:error})
    }
}

const updateCourseTitle=async(req,res,next)=>{
        try{
            const title=updateSchemaParser(COURSE_TITLE_SCHEMA_PROPERTIES,req.body,'title')
            const {id,titleID}=req.params
            const {nModified}=await CourseModel.find({_id:id}).updateOne({'title._id':titleID},
                        {'$set':title})
            if(nModified===1){
                return res.status(200).json({message:UPDATED_SUCCESS})
            }
            else {
                return res.status(200).json({message:FAILED_UPDATE})
            }
        }
        catch(error){
            res.status(400).json({message:error})
        }
}


const deleteCourseTitle=async(req,res,next)=>{
    try{
        const {id,titleID}=req.params
        const {nModified}=await CourseModel.updateOne({_id:id},{$pull:{title:{_id:titleID}}})
        if(nModified===1){
            res.status(200).json({message:DELETE_SUCCESS})
        }
        else {
            res.status(200).json({message:DELETE_FAILED})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}


const createCourseTopic=async(req,res,next)=>{
    try{
        const {id,titleID}=req.params
        const course=await CourseModel.findOne({_id:id,title:{$elemMatch:{_id:titleID}}})
        if(course){
                console.log(course.toObject())
                const {title:titleList}=course
                const {status,data}=handleCourseTopic(req,titleList.toObject())
                if(!status){
                    return res.status(200).json({message:data})
                }
                const {nModified}=await CourseModel.updateOne({_id:id,'title._id':titleID},
                        {$push:{'title.$.topicList':data } })
                if(nModified===1){
                            return res.status(200).json({message:COMPLETED,id:data._id})
                }
                else {
                            return res.status(200).json({message:FAILED_UPDATE})
                }
        }
        else {
                return res.status(200).json({message:COURSE_NOT_FOUND})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}


const updateCourseTopic=async(req,res,next)=>{
    try{
        let topic=updateSchemaParser(COURSE_TOPIC_SCHEMA_PROPERTIES,req.body,'title.$[].topicList.$[topicID]',true)
        const {id,titleID,topicID}=req.params
        
        const {nModified}=await CourseModel.updateOne({'_id':id},
        {
            $set:topic
        },
        {
            arrayFilters: [
                { 'topicID._id': topicID }
                ]
        }
        )
        if(nModified===1){
            return res.status(200).json({message:UPDATED_SUCCESS})
        }
        else {
            return res.status(200).json({message:FAILED_UPDATE})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}

const deleteCourseTopic=async(req,res,next)=>{
    try{
        const {id,titleID,topicID}=req.params
        const {nModified}=await CourseModel.updateOne({_id:id}
                ,{
                    $pull:{"title.0.topicList":{_id:topicID}}
                },
            )
        if(nModified===1){
            res.status(200).json({message:DELETE_SUCCESS})
        }
        else {
            res.status(200).json({message:DELETE_FAILED})
        }
    }
    catch(error){
        res.status(400).json({message:error})
    }
}




module.exports={
    createCourse,
    deleteCourse,
    getCourseById,
    updateCourse,
    createCourseTitle,
    updateCourseTitle,
    deleteCourseTitle,
    createCourseTopic,
    updateCourseTopic,
    deleteCourseTopic
}