import { SUPER_ADMIN } from "../Constant/Constant";
import { superAdminMenuList } from "../Constant/MenuList";
import { LOGIN_ACTION, NEED_LOGIN, USER_INFO_UPDATE, USER_SIDEMENU } from "../Constant/Reducer/Reducer";

export function updateUserInfo(userDetail){
    return {
        type:USER_INFO_UPDATE,
        data:userDetail
    }
}

export function loginAction(){
    let userDetail=JSON.parse(localStorage.getItem("userDetail"))
    
    if(userDetail===null||userDetail===undefined){
        return {
            type:NEED_LOGIN,
        }
    }
    
    let sideMenu=[]
    const {role}=userDetail
    if(role===SUPER_ADMIN){
        sideMenu=superAdminMenuList
    }
    return {
        type:LOGIN_ACTION,
        userDetail:userDetail,
        sideMenu:sideMenu,
        isLogin:true
    }
}

export function assignSideMenu({role}){

    if(role===SUPER_ADMIN){
        return {
            type:USER_SIDEMENU,
            data:superAdminMenuList
        }
    }

}