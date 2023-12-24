import { Box } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const GamePage=()=>{

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

export default GamePage;