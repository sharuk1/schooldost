const express=require("express");
const { createSchoolController, getSchoolByID, getSchoolList ,updateStandard, updateSchoolStatus,updateSchoolProperty} = require("../controller/School");
const { body, validationResult } = require('express-validator');
const { validQuery } = require('../middleware/vaIid-query');
const { checkAuth } = require("../middleware/check-auth");
const { performRBAC } = require("../middleware/rbac");


const router=express.Router();

router.post("/api/school",checkAuth,performRBAC,[
                body("syllabus").notEmpty(),
                body("state").notEmpty(),
                body("district").notEmpty(),
                body("emailID").notEmpty(),
                body("schoolName").notEmpty(),
],validQuery,createSchoolController)


router.get("/api/school/:id",checkAuth,performRBAC,getSchoolByID)

router.post("/api/school/:offset/:count",checkAuth,performRBAC,getSchoolList)

router.put("/api/school/:id/standard",checkAuth, [
    body("standardList").notEmpty()
],validQuery, performRBAC,updateStandard)

router.put("/api/school/:id/status/:status",checkAuth,performRBAC,updateSchoolStatus)

router.put("/api/school/:id/property",checkAuth,performRBAC,updateSchoolProperty)


module.exports={
    schoolRoute:router
}
