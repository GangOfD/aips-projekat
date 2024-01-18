import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";


const GameQuestion=({question})=>{

    const token= useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const theme=useTheme();

    return (
        <Box
            
            width="100%"
            height="100vh"
            
            borderRadius="20px"
            textAlign="center"
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"

            >
            
            <Box
                
            >
                <Typography fontSize="3.5rem"> {question.options[0]} </Typography>
            </Box>
            <Box
                width="30%"
                backgroundColor={theme.palette.neutral.light}
                border= "3px solid green"
            >
                <Typography fontSize="3.5rem"> {question.questionText} </Typography>
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                >
                    <IconButton onClick={()=>socket.emit('receiveAnswer',{token:token, answerValue:0, gameId:game.gameId})}>
                        <ArrowCircleLeft sx={{ fontSize: "55px" }} />
                    </IconButton>

                    <IconButton onClick={()=>socket.emit('receiveAnswer',{token:token, answerValue:1, gameId:game.gameId})}>
                        <ArrowCircleRight sx={{ fontSize: "55px" }} />
                    </IconButton>
                </Box>
                
            </Box>
            <Box
            
            >
                <Typography fontSize="3.5rem"> {question.options[1]} </Typography>
            </Box>

           
        </Box>
    );
}

export default GameQuestion;




