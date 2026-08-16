import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PendingIcon from '@mui/icons-material/Pending';

export const navigationMenu=[
    {
        title:"Home",
        icon:<HomeIcon/>,
        path:"/home"
    },
    { title: "Education", icon: <MessageIcon />, path: "/education" },
    {
        title: "Notifications",
        icon:<NotificationsIcon/>,
        path:"/notifications"
    },
    {
        title:"Messages" ,
        icon:<MessageIcon/>,
        path:"/messages"
    },
    {
        title:"Lists" ,
        icon:<ListAltIcon/>,
        path:"/lists"
    },
    {
    title: "Clubs",              
    icon: <GroupIcon />,         
    path: "/clubs",              
  },
    {
        title: "Verified",
        icon:<VerifiedIcon/>,
        path:"/verified"
    },
    {
        title:"Profile" ,
        icon:<AccountCircleIcon/>,
        path:"/profile"
        
    },
    { title: "Admin Panel", icon: <MessageIcon />, path: "/admin", adminOnly: true },
]