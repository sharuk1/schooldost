import { useEffect, useState } from "react";
import { loginAction } from "../Actions/User";
import {decodeJwt} from "jose"
import { useSelector, useDispatch } from "react-redux"


export const AccessCheckHook = () =>{
    const dispatch = useDispatch()
    
    const [isLogin,setLogin]=useState(false)
    useEffect(()=>{
        dispatch(loginAction())   
    },[])
   
    return {isLogin}
}