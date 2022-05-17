const express=require("express");
const { body, validationResult } = require('express-validator');
const { createGroupController ,updateGroupProperty,updateGroupStatus, deleteGroup,getGroupByID, getGroupList, addUserToGroup, addSubjectToGroup, getUserListGroup, deleteUserGroup} = require("../controller/Group");
const { validQuery } = require('../middleware/vaIid-query');
const { checkAuth } = require("../middleware/check-auth");
const { performRBAC } = require("../middleware/rbac");

const router=express.Router();


router.post("/api/group",checkAuth,performRBAC, [
    body("standard").notEmpty(),
    body("status").notEmpty(),
    body("schoolID").notEmpty(),
    body("section").notEmpty(),
    body("section").notEmpty()
],
validQuery,
createGroupController
)

router.put("/api/group/:id/property",checkAuth,performRBAC,updateGroupProperty)

router.put("/api/group/:id/status/:status",checkAuth,performRBAC,updateGroupStatus)

router.delete("/api/group/:id",checkAuth,performRBAC,deleteGroup)

router.get("/api/group/:id",checkAuth,performRBAC,getGroupByID)

router.post("/api/group/:offset/:count",checkAuth,performRBAC,getGroupList)

router.put("/api/group/:id/user",checkAuth,performRBAC,addUserToGroup)

router.put("/api/group/:id/subject",checkAuth,performRBAC,addSubjectToGroup)

router.get("/api/group/:id/user",checkAuth,performRBAC,getUserListGroup)

router.delete("/api/group/:id/user/:userID",checkAuth,performRBAC,deleteUserGroup)

module.exports={
    groupRoute:router
}