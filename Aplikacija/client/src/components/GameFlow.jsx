import { Box, Typography } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setGame } from "state/authSlice";
import socket from "Socket/socketInstance";
import FlowStatus from "./FlowStatus";

const GameFlow=()=>{

    const token=useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const [flow, setFlow]= useState({flowName:"", flowAction:null});
    // const [question, setQuestion]=useState(null);
    // const [result, setResult]= useState(null);
    // const [comment, setComment]= useState(null);
    useEffect(()=>{
        
        socket.on('questionResults', (data)=>{
            console.log("QUESTION RESULT",data);
            setFlow({flowName:"result",flowAction:data});
        });

        
        socket.on('newQuestion', (data)=>{
            console.log("NEW QUESTION",data);
            setFlow({flowName:"question", flowAction:data});
        });
    
        return ()=>{
            //socket.off('newQuestion');
        }
        
    },[socket]);

    

    return(
        <>
            {flow.flowAction && (<FlowStatus flow={flow}/>)}
        </>
    ) 
}

export default GameFlow;