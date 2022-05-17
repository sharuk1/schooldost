const express=require('express');
const { body, validationResult } = require('express-validator');
const { validQuery } = require('../middleware/vaIid-query');


const { createUserController, updateUserStatus, deleteUser, updateUserInfo, getUserList, getUserByID } = require('../controller/User');
const { checkAuth } = require('../middleware/check-auth');
const { performRBAC } = require('../middleware/rbac');
const  middleWareRBAC  = require('../middleware/RBACRule');

const router=express.Router();


router.post("/api/user", [body("userName").notEmpty(),
body("email").isEmail()],
validQuery,
createUserController
);

router.put("/api/user/:id/:status",checkAuth,updateUserStatus)

router.delete("/api/user/:id",checkAuth,deleteUser)

router.put("/api/user/:id",checkAuth,performRBAC,updateUserInfo)

router.post('/api/user/:offset/:count',checkAuth,performRBAC,getUserList)

router.get('/api/user/:id',checkAuth,performRBAC,middleWareRBAC("/api/user/:id"),getUserByID);

module.exports={
    userRoute:router
}