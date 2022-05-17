import { LOGIN_ACTION, NEED_LOGIN, USER_INFO_UPDATE, USER_SIDEMENU } from "../Constant/Reducer/Reducer";

export default function reducer(
    state={
        userDetails:{
            email:"",
            id:"",
            role:"",
            schoolID:"",
            status:"",
            userName:""
        },
        sideMenu:[],
        isLogin:false
    }
    ,action
){
    switch(action.type){
            case USER_INFO_UPDATE:
                    return {
                        ...state,
                        userDetails:action.data
                    }
            case USER_SIDEMENU:
                    return{
                        ...state,
                        sideMenu:action.data
                    }
            case LOGIN_ACTION:
                    return {
                        ...state,
                        userDetails:action.userDetail,
                        sideMenu:action.sideMenu,
                        isLogin:true
                    }
            case NEED_LOGIN:
                    return {
                            ...state,
                            isLogin:false,
                            userDetails:{
                                email:"",
                                id:"",
                                role:"",
                                schoolID:"",
                                status:"",
                                userName:""
                            },
                            sideMenu:[]
                    }
            default:
                break;
    }
    return state
}