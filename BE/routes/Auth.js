const express=require("express");
const { loginController, resetPassword, forgotPassword } = require("../controller/Auth");
const { body, validationResult } = require('express-validator');
const { validQuery } = require('../middleware/vaIid-query');

const router=express.Router();


router.post("/api/login",[
            body("email").isEmail(),
            body("password").notEmpty()
            ],validQuery,loginController);


router.post('/api/resetpassword',
[body("email").isEmail()],validQuery,resetPassword);


router.post('/api/forgotpassword',
[body("email").isEmail()],validQuery,forgotPassword);

module.exports={
    authRoute:router
}