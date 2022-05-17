import { Container ,FormControl,Grid,Paper,Button, Avatar,Fab,CircularProgress} from "@mui/material"
import React ,{useState} from "react"
import { appIcon, nameIcon, passwordIcon } from "../../Constant/Icon/icon"
import { InputElement } from "../../Template/FECommon"
import { useSelector, useDispatch } from "react-redux"
import { hideDialog, showAlert, showDialog } from "../../Actions/Notification"
import { useHttpClient } from "../../Hooks/HttpHook"
import { CONTENT_TYPE_JSON, DOMAIN_URL, INFO, POST_METHOD } from "../../Constant/Constant"
import { roleBasedRedirect } from "../../Utility/Utility"
import { USER_INFO_UPDATE } from "../../Constant/Reducer/Reducer"
import {decodeJwt} from "jose"
import { assignSideMenu, updateUserInfo } from "../../Actions/User"


export function LoginLayout(){
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const [loginDetails,setLoginDetails]=useState({
            userName:"",
            password:""
    })
    
    const dispatch = useDispatch()
    
    
    const handleInput=(event)=>{
            setLoginDetails({
                    ...loginDetails,
                    [event.target.id]:event.target.value
            })
    }
    
    const handleLogin=async()=>{
        const query={
                email:userName,
                password:window.Sha256.hash(password)
        }
        const {data:{message,status,token}}=await sendRequest(`${DOMAIN_URL}/login`,POST_METHOD,query,{
                'content-type':CONTENT_TYPE_JSON
        })
        if(status===401){
            dispatch(showAlert(INFO,message))
        }
        else if(status===200){
                localStorage.setItem("access-token",token)
                roleBasedRedirect()
                const userDetail=decodeJwt(token,{complete:true})
                dispatch(assignSideMenu(userDetail))
                dispatch(updateUserInfo(userDetail))
        }
        
            
    }
    
    const {userName,password}=loginDetails
    return (
                <Container fixed >
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} className="center login-center" >
                                <Paper elevation={2} className="paper center">
                                        <h1>Login your 
                                            <span> <Fab>
                                                <Avatar src={appIcon}/>
                                            </Fab> </span>
                                        account</h1>
                                        <InputElement isRequired labelName="User Name" type="text" 
                                            icon={nameIcon} handleCallback={handleInput} value={userName} id="userName" isFullWidth
                                        />
                                        <br/>
                                        <InputElement isRequired labelName="Password" type="password" 
                                            icon={passwordIcon} handleCallback={handleInput} value={password} id="password" isFullWidth
                                        />
                                        <br/>
                                        <FormControl required fullWidth>
                                        <Button variant="contained" className="element" onClick={handleLogin}>
                                            SUBMIT
                                        </Button>
                                        </FormControl>
                                </Paper>
                            </Grid>
                        </Grid>
                </Container>                
    )
}


