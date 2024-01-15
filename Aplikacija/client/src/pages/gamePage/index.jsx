import { Box } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import socket from "Socket/socketInstance";
import GameStatus from "components/GameStatus";

const GamePage=()=>{

    const token=useSelector((state)=>state.token);
    const navigate=useNavigate();
    const [game,setGame]=useState({status:'waiting'});

    useEffect(()=>{
        if(token==null)
            navigate("/");
    },[]);

    useEffect(()=>{
        socket.on('gameJoined', (data)=>{
            console.log(data.DTO);
            setGame(data.DTO);
        })

        return ()=>{
            socket.off('gameJoined');
        }
    },[]);
    return(
        <Box>
            <Navbar/>
            {game.status=='waiting' && (<GameStatus game={game}/>)}
        </Box>
    ) 
}

export default GamePage;