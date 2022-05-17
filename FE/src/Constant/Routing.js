import { LoginLayout } from '../Layout/Auth/Login';
import Course from '../Layout/Course/Course';
import { Portal } from '../Layout/Dashboard/Portal';
import { CreateSchool } from '../Layout/School/CreateSchool';


const Routing=[

    {
        url:"course",
        component:<Course/>
    },
    {
        url:"login",
        component:<LoginLayout/>
    },
    {
        url:"portal",
        component:<Portal/>
    },
    {
        url:"createschool",
        component:<CreateSchool/>
    }

]


export {Routing}