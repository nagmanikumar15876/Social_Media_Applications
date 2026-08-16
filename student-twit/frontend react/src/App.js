import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './Components/Authentication/Authentication';
import HomePage from './Components/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserProfile } from './Store/Auth/Action';
import Message from "./Components/Message/Message";
import ClubDetails from './Components/Club/ClubDetails';

import darkTheme from './Theme/DarkTheme';
import lightTheme from './Theme/LightTheme';
import { Box, Button, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Palette } from '@mui/icons-material';
import VerifiedSuccess from './Components/VerifiedSuccess/VerifiedSuccess';
import Education from './Components/Education/Education';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Clubs from './Components/Club/Clubs';
import CreateClubForm from './Components/Club/CreateClubForm';
import ManageClub from './Components/Club/ManageClub';

function App() {
  const dispatch=useDispatch();
  const {auth}=useSelector(store=>store);
  const jwt = localStorage.getItem("jwt")
  const [currentTheme,setCurrentTheme]=useState("");
  const {theme}=useSelector(store=>store);
  

  useEffect(()=>{

    if(jwt){
      dispatch(getUserProfile(jwt))
    }
  
  },[auth.jwt,jwt])

  useEffect(()=>{
setCurrentTheme(localStorage.getItem("theme"))
  },[theme.currentTheme])
 
  console.log("them ",theme.currentTheme)
  return (
    <ThemeProvider theme={currentTheme==="dark"? darkTheme:lightTheme} className="">
      <CssBaseline />
      <Box sx={{}}>
        {/* <Button variant='content' color='success'>Check Theme</Button> */}
          <Routes>
        <Route path='/*' element={ auth.user?.fullName? <HomePage/>:<Authentication/>}></Route>
        <Route path='/signin' element={<Authentication/>}></Route>
        <Route path='/signup' element={<Authentication/>}></Route>
        <Route path='/verified' element={<VerifiedSuccess/>}></Route>
        <Route path="/education" element={<Education />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/clubs" element={<Clubs/>} />
        <Route path="/clubs/create" element={<CreateClubForm />} />
        <Route path="/clubs/:id" element={<ClubDetails />} />
        <Route path="/clubs/:id/manage" element={<ManageClub />} />
        <Route
            path="/messages"
            element={
              auth.user?.fullName
                ? <Message />
                : <Authentication/>
            }
          />
        {/* <Route path='/profile' element={<HomePage/>}></Route> */}
      </Routes>
      </Box>
    
      
    </ThemeProvider>
  );
}

export default App;
