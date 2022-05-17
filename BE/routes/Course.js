const express=require("express");
const { createCourse ,deleteCourse,getCourseById,updateCourse,
        createCourseTitle,updateCourseTitle,deleteCourseTitle,createCourseTopic,
        updateCourseTopic,deleteCourseTopic} = require("../controller/Course");
const { checkAuth } = require("../middleware/check-auth");


const router=express.Router();

//create the course
router.post('/api/course',checkAuth,createCourse)

//update the course by id
router.put("/api/course/:id",checkAuth,updateCourse)

// //delete the  course by id 
router.delete("/api/course/:id",checkAuth,deleteCourse)

// //Get the course by id 
router.get("/api/course/:id",checkAuth,getCourseById)


//create list of title for the course

router.post('/api/course/:id/title',checkAuth,createCourseTitle)

router.put("/api/course/:id/title/:titleID",checkAuth,updateCourseTitle)

router.delete("/api/course/:id/title/:titleID",checkAuth,deleteCourseTitle)

router.post('/api/course/:id/title/:titleID',checkAuth,createCourseTopic)

router.put('/api/course/:id/title/:titleID/topic/:topicID',checkAuth,updateCourseTopic)
router.delete('/api/course/:id/title/:titleID/topic/:topicID',checkAuth,deleteCourseTopic)



module.exports={
    courseRoute:router
}