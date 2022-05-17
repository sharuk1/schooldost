const express=require("express");
const { body, validationResult } = require('express-validator');
const { performRBAC } = require("../middleware/rbac");
const { checkAuth } = require("../middleware/check-auth");
const {createQuestion, getQuestionByID, updateQuestionByID, deleteQuestionByID, getQuestionList, getQuestionMetaData}=require("../controller/Question")
const { validQuery } = require('../middleware/vaIid-query');


const router=express.Router();


router.post('/api/question',[
        body("type").notEmpty(),
        body("std").notEmpty(),
        body("subject").notEmpty(),
        body("unit").notEmpty(),
        body("title").notEmpty(),
        body("category").notEmpty(),
        body("schoolID").notEmpty(),
        body("syllabus").notEmpty()
],
validQuery,checkAuth,performRBAC,createQuestion
);

router.get("/api/question/:id",checkAuth,performRBAC,getQuestionByID)


router.put("/api/question/:id",checkAuth,performRBAC,updateQuestionByID)

router.delete("/api/question/:id",checkAuth,performRBAC,deleteQuestionByID)

router.post("/api/question/:offset/:count",checkAuth,performRBAC,getQuestionList)

router.get("/api/question/meta/subject/:standard",checkAuth,performRBAC,getQuestionMetaData)

module.exports={
    questionRoute:router
}