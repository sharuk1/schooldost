import { FormControl, InputLabel ,InputAdornment,Input,Select,MenuItem} from "@mui/material"
import React from "react"
import ListIcon from '@mui/icons-material/List';


function InputElement(data){
        const {isRequired,labelName,type,icon,handleCallback,value,id,isFullWidth}=data
        return <FormControl className="element" fullWidth={isFullWidth?true:false}>
                    <InputLabel required={isRequired?true:false}>{labelName}</InputLabel>
                    <Input  startAdornment={<InputAdornment position="start"> {icon}</InputAdornment>}
                            type={type} id={id} onInput={handleCallback}  value={value} name={id}
                        />
            </FormControl>
}


function SelectElement(data){
        const {isRequired,list,handleCallback,isObject,labelName,isFullWidth,id,icon}=data
        return <FormControl variant="standard" className="element" fullWidth={isFullWidth?true:false} >
                <InputLabel required={isRequired?true:false}>{labelName}</InputLabel>
                <Select startAdornment={<InputAdornment position="start"> {icon?icon:<ListIcon/>}</InputAdornment>} onChange={handleCallback} name={id}>
                    {
                        isObject?
                        list.map(l=>
                            <MenuItem value={l.value}>{l.label}</MenuItem>
                        )
                        :
                        list.map(l=>
                            <MenuItem value={l}>{l}</MenuItem>
                        )
                    }
                </Select>
        </FormControl>
}

export {
    InputElement,
    SelectElement
}