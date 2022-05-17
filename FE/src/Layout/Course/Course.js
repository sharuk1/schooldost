import { Container ,Paper,Button,Grid} from "@mui/material";
import React ,{useState} from "react"
import { useSelector, useDispatch } from "react-redux"
import { GET_COURSE_BY_ID } from "../../Constant/Reducer/Reducer";
import { ReducerAction } from "../../Actions/action"
import { InputElement,SelectElement } from "../../Template/FECommon";
import { nameIcon } from "../../Constant/Icon/icon";

export default function Course(){
    const courseStore = useSelector(state => state.course);
    
    const dispatch = useDispatch()
    
    const { sendAction } = ReducerAction()
    
    const [course,setCourse]=useState({
        name:"",
        standard:"",
        syllabus:"",
        schoolID:'',
        isPublic:"",
        description:""
    })
    
    const sendHTTP=()=>{
        dispatch(sendAction({
            url: `http://localhost:5000/api/course/7b7262417ecf787130235577c1a1d9e72ae1d8e2`,
            method: "GET",
            query: {},
            contentType: 'application/json;charset=UTF-8',
            reducerType: GET_COURSE_BY_ID
        }))
    }
    
    const inputHandleCallback=(event)=>{
        setCourse({
                ...course,
                [event.target.id]:event.target.value
        })
    }
    
    const {name,standard,syllabus,schoolID,isPublic,description}=course
    
    return (
        <div>
            <Container>
                <Paper elevation={3}>
                        <h6>
                            Create Course
                        </h6>
                        <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputElement isRequired labelName="Name"
                                        type="text" icon={nameIcon} handleCallback  ={inputHandleCallback} 
                                        value={name} id="name"
                                    />
                                    
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <SelectElement labelName="standard" name="Standard" isRequired list={[1,2,345,2]}
                                        handleCallback={inputHandleCallback} 
                                    />
                                </Grid>
                                
                        </Grid>
                </Paper>
            </Container>
        </div>
    )
}