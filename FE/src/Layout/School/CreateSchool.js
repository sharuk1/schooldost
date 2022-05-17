import { Container,Paper,Grid,Button ,FormControl} from "@mui/material"
import React ,{useState} from "react"
import { emailIcon, homeIcon, schoolIcon } from "../../Constant/Icon/icon"
import { pyUnionLocation, stateLocation, tnDistrictLocation } from "../../Constant/LocationConstant"
import { InputElement, SelectElement } from "../../Template/FECommon"
import { useSelector, useDispatch } from "react-redux"
import { AppbarComponent } from "../../Component/Menubar"
import { AccessCheckHook } from "../../Hooks/AccessCheckHook"
import { payloadValidator } from "../../Utility/Utility"
import { createSchoolPayload } from "../../Constant/PayloadConstant"
import { showAlert } from "../../Actions/Notification"
import { INFO, SYLLABUS } from "../../Constant/Constant"


export function CreateSchool(){
    const dispatch = useDispatch()
    
    const {sideMenu} = useSelector(state => state.user);
    const {isLogin}=AccessCheckHook()
    const [schoolDetails,setSchoolDetails]=useState({
        syllabus:"",
        state:[],
        district:"",
        location:"",
        schoolName:"",
        emailID:"",
        districtList:[]
    })
    
    const handleCreateSchool=()=>{
        const {status,message,data}= payloadValidator(createSchoolPayload,schoolDetails)
        if(status){
                dispatch(showAlert(INFO,message))
        }        
    }
    
    const handleInput=(event)=>{
            
            if(event.target.name==="state"){
                setSchoolDetails({
                    ...schoolDetails,
                    [event.target.name]:event.target.value,
                    districtList:event.target.value==="Puducherry"?pyUnionLocation:tnDistrictLocation 
                })            
            }
            else {
                setSchoolDetails({
                    ...schoolDetails,
                    [event.target.name]:event.target.value
                })
            }
            
    }
    
    const {syllabus,state,district,location,schoolName,emailID,districtList}=schoolDetails
    
    return (
        <div>
            <Container>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                                
                                <Paper className="  paper">
                                        <h1>
                                            Create School
                                        </h1>
                                        <SelectElement isRequired labelName="Syllabus" list={SYLLABUS}   icon={schoolIcon} isFullWidth
                                            handleCallback={handleInput} value={syllabus} id="syllabus"
                                        />
                                        
                                        <InputElement isRequired labelName="School Name" icon={schoolIcon} isFullWidth id="schoolName"
                                            type="text" handleCallback={handleInput} value={schoolName}
                                        />
                                    
                                        <InputElement isRequired labelName="Email ID" icon={emailIcon} isFullWidth
                                            type="email" handleCallback={handleInput} value={emailID} id="emailID"
                                        />                                         
                                       
                                        <SelectElement isRequired labelName="State" list={stateLocation}    isFullWidth
                                            handleCallback={handleInput} value={state} id="state"
                                        />
                                        <SelectElement isRequired labelName="District" list={districtList}  isFullWidth
                                             handleCallback={handleInput} value={district} id="district"
                                        />
                                         <InputElement isRequired labelName="Location" icon={homeIcon} isFullWidth
                                            type="text" handleCallback={handleInput} value={location} id="location"
                                        />
                                        <FormControl required >
                                            <Button variant="contained" className="element" onClick={handleCreateSchool}>
                                                Create School
                                            </Button>
                                        </FormControl>
                                </Paper>
                        </Grid>
                    </Grid>
            </Container>
        </div>
    )
}