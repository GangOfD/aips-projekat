import { Box, Typography } from "@mui/material";
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

        socket.on('gameJoined',(data)=>{
            console.log(data.DTO);
            dispatch(setGame({game:data.DTO}));
        });

        socket.on('gameStarted',(data)=>{
            console.log("Hello form Started",data);
            dispatch(setGame({game:data}));
        });

        socket.on('gameCompleted',(data)=>{
            console.log("Hello from completed game", data);
            dispatch(setGame({game:data}));
        })

        return ()=>{
            
        }
        
    },[socket]);

    

    return(
        <>
            <Navbar/>
            <GameStatus status={game.status}/>
            
        </>
    ) 
}

export default GamePage;