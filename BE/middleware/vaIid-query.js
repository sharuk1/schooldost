const { body, validationResult } = require('express-validator');
const HttpError = require('./http-error');
const validQuery=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const [data]=errors.array();
        const message=`${data.param} Missing`
        return res.json({message:message});
    }
    else {
        next();
    }
}

module.exports={
    validQuery
}