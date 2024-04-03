import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {
    PlayCircleOutline
  } from "@mui/icons-material";
import {Box} from "@mui/material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


const GameWaiting=()=>{

    const game=useSelector((state)=>state.game);
    const token=useSelector((state)=>state.token);
    const date=new Date(game.createdAt);
    const dateDisplay=date.toISOString().split('T')[0];
    const theme=useTheme();
    const [message, setMessage]= useState("");
    
    useEffect(()=>{
        socket.on('startError',(data)=>{
            console.log(data);
            setMessage(data);
        })
    },[])

    return (
        <Box
            p="1.5rem"
            width="40%"
            m="1rem auto"
            borderRadius="20px"
            backgroundColor={theme.palette.neutral.light}
            textAlign="center"
            >
            <Typography variant="h3" color={theme.palette.primary.main} mb={2}>
                Hello mortal
            </Typography>
            <Typography variant="h5" color={theme.palette.text.secondary} mb={1}>
                Game created: {dateDisplay}
            </Typography>
            <Typography variant="h5" color={theme.palette.text.secondary} mb={1}>
                Players:
            </Typography>
            <Box mb={2}>
                {game.players.map((player, index) => (
                <Typography
                    key={index}
                    variant="body2"
                    color={theme.palette.text.secondary}
                >
                    {player}
                </Typography>
                ))}
            </Box>
            <Typography variant="h5" color={theme.palette.text.secondary} mb={1}>
                Game status: {game.status}
            </Typography>
            <Typography variant="h5" color={theme.palette.text.secondary} mb={1}>
                Room id: {game.gameId}
            </Typography>
            <Typography variant="h5" color={theme.palette.text.secondary}>
                Created by: {game.createdBy}
            </Typography>
            <IconButton onClick={()=>socket.emit('startGame',{roomId:game.gameId, token:token})}>
                <PlayCircleOutline sx={{ fontSize: "55px" }} />
            </IconButton>
            <Typography variant="h4" color={theme.palette.primary.main} mb={2}>
                Start game
            </Typography>
            <Typography variant="h4" color={theme.palette.primary.main} mb={2}>
                {message}
            </Typography>
        </Box>
    );
}

export default GameWaiting;




