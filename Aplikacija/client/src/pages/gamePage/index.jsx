import { Box } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setGame } from "state/authSlice";
import socket from "Socket/socketInstance";
import GameStatus from "components/GameStatus";

const GamePage=()=>{

    const token=useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const dispatch= useDispatch();
    const navigate=useNavigate();

    useEffect(()=>{
        if(token==null)
            navigate("/");

        socket.on('newQuestion', (data)=>{
            console.log(data);
             
        })
    
        return ()=>{
            //socket.off('newQuestion');
        }
        //msm da ovde treba socket.on('gameStarted');
        // pitanja osluskujem na newQuestion(question:string, optins:string[]) a saljem receiveAnsver(token, roomId, answeredIndex)
        //console.log(game);
    },[]);

    return(
        <Box>
            <Navbar/>
            {game.status=='waiting' && (<GameStatus game={game}/>)}
        </Box>
    ) 
}

export default GamePage;