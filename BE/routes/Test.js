const express=require("express");
const { autoTest, getTestByID, updateTestByID, deleteTestByID, getTestList ,updateAnswerByTest,startTest,endTest} = require("../controller/Test");
const { checkAuth } = require("../middleware/check-auth");


const router=express.Router();


router.post("/api/test",checkAuth,autoTest)

router.get("/api/test/:id",checkAuth,getTestByID)

router.put("/api/test/:id",checkAuth,updateTestByID)

router.delete("/api/test/:id",checkAuth,deleteTestByID)

router.post("/api/test/:offset/:count",checkAuth,getTestList)
router.post("/api/test/:id/answer/:questionID",checkAuth,updateAnswerByTest)

router.get("/api/test/:id/start",checkAuth,startTest)
router.put("/api/test/:id/end",checkAuth,endTest)


module.exports={
    testRoute:router
}