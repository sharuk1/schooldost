const crypto = require("crypto");
const { COURSE_TITLE_ALREADY_CREATED, COURSE_TOPIC_ALREDY_CREATED } = require("../constant/CourseConstant");


const handleCreateCourse=(req)=>{
    const {name,standard,syllabus,schoolID,isPublic,description}=req.body
    const {userName,email}=req.userData
    const course={
        _id:crypto.randomBytes(20).toString('hex'),
        name,
        standard,
        syllabus,
        schoolID,
        isPublic,
        description:description||null,
        authorName:userName,
        authorEmail:email,
        title:[],
    }
    return course
}

const handleTopic=(req,titleList)=>{
    const {name,description}=req.body
    
    const findTitle=titleList.filter(({name:titleName})=>name===titleName)
    if(findTitle.length!==0){
        return {
            status:false,
            data:COURSE_TITLE_ALREADY_CREATED
        }
    }
    const {userName}=req.userData
    const courseTitle={
        name,
        description,
        author:userName,
        _id:crypto.randomBytes(20).toString('hex'),
        duration:0,
        topicList:[]
    }
    return {
        status:true,
        data:courseTitle
    }   
}

const handleCourseTopic=(req,titleData)=>{
        const {name,isQuiz,url}=req.body
        const {titleID}=req.params
        const {userName}=req.userData
        const [titleList]=titleData.filter(({_id})=>_id===titleID)
        const {topicList}=titleList
        const topicData=topicList.filter(({name:tName})=>tName===name)
        
        if(topicData.length!==0){
            return {
                status:false,
                data:COURSE_TOPIC_ALREDY_CREATED
            }
        }
        const topic={
            name,
            author:userName,
            _id:crypto.randomBytes(20).toString('hex'),
            duration:0,
            url,
            isQuiz:isQuiz,
            testID:[],
            materialID:[]
        }
        return {
            status:true,
            data:topic
        }
        
}


module.exports={
    handleCreateCourse,
    handleTopic,
    handleCourseTopic
}