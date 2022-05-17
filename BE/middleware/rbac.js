const { DENIED, UN_AUTH ,ALLOWED} = require("../constant/Config")
const { RBAC_RULE } = require("../constant/RBAC")


const performRBAC=async(req,res,next)=>{
    const {userData,url,method}=req
    const {id,role}=userData
    const rbacRule=RBAC_RULE
    console.log(req.baseUrl);
    switch(url){
        case "/api/group":
                const groupUserAccess=rbacRule.group[method];
                let status=checkRole(groupUserAccess,role); 
                if(!status){
                        return res.status(403).json({message:UN_AUTH})
                }
                break;
        case "/api/school":
                const schoolUserAccess=rbacRule.school[method]
                if(!checkRole(schoolUserAccess,role)){
                    return res.status(403).json({message:UN_AUTH})
                }
                break;
        case "/api/user":
                const userAccess=rbacRule.user[method]
                if(!checkRole(userAccess,role)){
                        return res.status(403).json({message:UN_AUTH})
                }
                break;
       case "/api/question":
                        const questionUserAccess=rbacRule.question[method]
                        if(!checkRole(questionUserAccess,role)){
                                return res.status(403).json({message:UN_AUTH})
                        }
                        break;
    }
    next();
}




const checkRole=(accessList,role)=>{
        const access=accessList[role]
        if(access===ALLOWED){
            return true   
        }
        else if(access===DENIED){
             false;
        }
}


module.exports={
    performRBAC,
}