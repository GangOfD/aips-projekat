import Navbar from "components/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout, setUser } from "state";
import {
    Box,
    useMediaQuery,
    Typography,
    useTheme,
  } from "@mui/material";
  import {
    AddCircle,
    Delete
  } from "@mui/icons-material";
import HostGame from "components/HostGame";
import JoinGame from "components/JoinGame";
  
const HomePage=()=>{

    const token=useSelector((state)=>state.token);
    const user=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const theme=useTheme();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");


    
    return (
        <>
          <Navbar/>
          <Box 
            display= "flex"
            flexDirection={isNonMobile? "row" : "column"}
            width="100%"
            justifyContent="space-evenly"
            mt="100px"
          >
            <HostGame />
            <JoinGame />
        </Box>
          
        </>
          
      );
}

export default HomePage;