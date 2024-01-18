import { Box } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setGame } from "state/authSlice";
import socket from "Socket/socketInstance";
import GameStatus from "components/GameStatus";
import GameQuestion from "components/GameQuestion";

const GamePage=()=>{

    const token=useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const dispatch= useDispatch();
    const navigate=useNavigate();

    
    game.status="inProgres";
    console.log(game);
    useEffect(()=>{
        if(token==null)
            navigate("/");

        socket.on('newQuestion', (data)=>{
            console.log(data);
             
        })

        socket.on('gameJoined',(data)=>{
            console.log(data.DTO);
            dispatch(setGame({game:data.DTO}));
        });

        socket.on('gameStarted',(data)=>{
            console.log("Hello form Started",data);
            dispatch(setGame({game:data}));
        });
    
        return ()=>{
            //socket.off('newQuestion');
        }
        //msm da ovde treba socket.on('gameStarted');
        // pitanja osluskujem na newQuestion(question:string, optins:string[]) a saljem receiveAnsver(token, roomId, answeredIndex)
        //console.log(game);
    },[socket]);

    return(
        <Box>
            <Navbar/>
            {game.status=='waiting' && (<GameStatus game={game}/>)}
            {game.status=="inProgres" && (<GameQuestion/>)}
        </Box>
    ) 
}

export default GamePage;