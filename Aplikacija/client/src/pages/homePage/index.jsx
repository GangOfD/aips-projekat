import { Box } from "@mui/material";
import Navbar from "components/Navbar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage=()=>{

    const token=useSelector((state)=>state.token);
    const navigate=useNavigate();

    useEffect(()=>{
        if(token==null)
            navigate("/");
    },[]);

    return(
        <Box>
            <Navbar/>
        </Box>
    ) 
}

export default HomePage;