import { Box, Typography } from "@mui/material";
import Navbar from "components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setGame } from "state/authSlice";
import socket from "Socket/socketInstance";
import GameStatus from "components/GameStatus";
import GameQuestion from "components/GameQuestion";
import QuestionResult from "components/QuestionResult";

const GamePage=()=>{

    const token=useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const dispatch= useDispatch();
    const navigate=useNavigate();
    const [question, setQuestion]= useState(null);
    const [result, setResult]= useState(null);
    
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

        socket.on('newQuestion', (data)=>{
            console.log("NEW QUESTION",data);
            setQuestion(data);
             
        });

        socket.on('questionResults', (data)=>{
            console.log("QUESTION RESULT",data);
            setResult(data);
        });
    
        return ()=>{
            //socket.off('newQuestion');
        }
        
    },[socket]);

    

    return(
        <>
            <Navbar/>
            {game.status=='waiting' && (<GameStatus game={game}/>)}
            {game.status=="inProgress" && question && (<GameQuestion question={question}/>)}
            {result && (<QuestionResult results={result}/>)}
        </>
    ) 
}

export default GamePage;