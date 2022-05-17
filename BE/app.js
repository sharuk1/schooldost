const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const redis = require('redis');

const { authRoute } = require("./routes/Auth");
const { userRoute } = require("./routes/User");
const { schoolRoute } = require("./routes/School");
const { connectRediServer } = require("./middleware/redis");
const { groupRoute } = require("./routes/Group");
const {questionRoute}=require("./routes/Question")
const { BasicSetup } = require("./controller/BasicSetup");
const { testRoute } = require("./routes/Test");
const { courseRoute } = require("./routes/Course");

const origin = {
    credentials: true, origin: 'http://localhost:3000'
};
const client = redis.createClient();

const application=express();
application.use(cors(origin));
application.use(bodyParser.json())
application.use(bodyParser.urlencoded({
    extended: true
}));

application.use(authRoute);
application.use(userRoute);
application.use(schoolRoute);
application.use(groupRoute);
application.use(questionRoute)
application.use(testRoute)
application.use(courseRoute)

mongoose.connect("mongodb://localhost:27017/learningapp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        application.listen(5000, async () => {
            console.log("Application start");
            await connectRediServer();    
            new BasicSetup();
        })
    
    })
    .catch(err => {
        console.log("error");
})