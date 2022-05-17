import {decodeJwt} from "jose"
import { ADMIN, PARENT, STUDENT, SUPER_ADMIN } from "../Constant/Constant";

const roleBasedRedirect=()=>{
        const token=localStorage.getItem("access-token")
        console.log( decodeJwt(token,{complete:true}));
        const userDetail=decodeJwt(token,{complete:true})
        localStorage.setItem("userDetail",JSON.stringify(userDetail))
        const {role}=userDetail
        if(role===SUPER_ADMIN){
            window.location.href="#/portal"
        }
        else if(role===ADMIN){
        
        }
        else if(role===PARENT){
        
        }
        else if(role===STUDENT){
        
        }
}

const payloadValidator = function (payload, data) {
    let message = {
      status: false,
      message: "",
    }
    let requestData={}
    for (let index in payload) {
      if (data[payload[index]['id']] === "") {
        message = {
          message: `${payload[index]['label']} missing`,
          status: true,
          data:{}
        }
        return message
      }
      else {
        requestData={
                    ...requestData,
                    [payload[index]['id']]:data[payload[index]['index']]
            }
      }
    
    }
    return {
            ...message,
            data:requestData
        };
  }

export {
    roleBasedRedirect,
    payloadValidator
}