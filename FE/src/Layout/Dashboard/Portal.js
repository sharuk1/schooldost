import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { AppbarComponent } from "../../Component/Menubar";
import { superAdminMenuList } from "../../Constant/MenuList";


export function Portal(){
    const userStore = useSelector(state => state.user);
    
    return (
        <div>
            <AppbarComponent  menuList={superAdminMenuList} />
        </div>
    )
}