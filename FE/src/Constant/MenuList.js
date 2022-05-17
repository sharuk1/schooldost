import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import CourseIcon from '@mui/icons-material/FeaturedVideo';

const courseMenu={
            url:'#/course',
            title:"Course",
            icon:<CourseIcon fontSize="large"/>,
            children:[
                {
                    url:"#/createcourse",
                    title:"Create Course",
                    icon:""
                },
                {
                    url:"#/viewcourse",
                    title:"View Course",
                    icon:""
                },
                {
                    url:"#/managecourse",
                    title:"Manage Course",
                    icon:""
                }
            ]
    }

const schoolMenu={
        url:"#/school",
        title:'School',
        icon:<SchoolIcon  fontSize="large"/>,
        children:[
            {
                url:"#/createschool",
                title:"Create School",
                icon:<SchoolIcon />
            },
            {
                url:"#/manageschool",
                title:"Manage School",
                icon:<SchoolIcon />
            }
        ]

}

const groupMenu={
        url:"#/group",
        title:"Group",
        icon:<GroupIcon fontSize="large"/>,
        children:[
            {
                url:"#/creategroup",
                title:"Create Group",
                icon:<GroupIcon/>
            },
            {
                url:"#/viewgroup",
                title:"View Group",
                icon:<GroupIcon/>
            },
            {
                url:"#/managegroup",
                title:"Manage Group",
                icon:<GroupIcon fontSize="large"/>
            },
        ]
}


const superAdminMenuList=[
        schoolMenu,
        groupMenu,
        courseMenu,
]

export {
    superAdminMenuList
}