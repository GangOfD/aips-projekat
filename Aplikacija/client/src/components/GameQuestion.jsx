import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


const GameQuestion=({action})=>{

    const token= useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const theme=useTheme();
    const mode=useSelector((state)=>state.mode);
    const [isAnimating, setAnimating]=useState({left:false, right:false});

    const startAnimation=(side)=>{
      side=="left"? setAnimating({left:true}): setAnimating({right:true});
      
      setTimeout(() => {
        setAnimating({left:false, right:false});
      }, 1000); 
    }    

    return (
        <Box
          width="100%"
          height="50vh"
          borderRadius="20px"
          textAlign="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Box
            width="30%"
            backgroundColor={mode=="dark" ? theme.palette.primary.light: theme.palette.neutral.light}
            borderRadius="10px"
            padding="20px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            
          >
            <Typography fontSize="5.5vw">{action?.options[0]}</Typography>
          </Box>
          <Box
            width="30%"
            backgroundColor={theme.palette.neutral.light}
            border="3px solid green"
            borderRadius="10px"
            padding="20px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          >
            <Typography variant="h4" marginBottom="20px">
              {action?.questionText}
            </Typography>
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <IconButton
                onClick={() =>{
                  startAnimation("left");
                  socket.emit("receiveAnswer", {
                    token: token,
                    answerValue: 0,
                    gameId: game.gameId,
                  })
                }
                }
              >
                <ArrowCircleLeft sx={{ 
                  fontSize:isAnimating.left? "8.5vw" :"5.5vw" ,
                  color: isAnimating.left? theme.palette.primary.main: theme.palette.primary.light,
                  }}
                />
              </IconButton>

              <IconButton
                onClick={() =>{
                  startAnimation("right");
                  socket.emit("receiveAnswer", {
                    token: token,
                    answerValue: 1,
                    gameId: game.gameId,
                  })
                }
                }
              >
                <ArrowCircleRight sx={{ 
                  fontSize:isAnimating.right? "8.5vw" :"5.5vw" ,
                  color: isAnimating.right? theme.palette.primary.main: theme.palette.primary.light,
                  }} />
              </IconButton>
            </Box>
          </Box>
          <Box
            width="30%"
            backgroundColor={mode=="dark" ? theme.palette.primary.light: theme.palette.neutral.light}
            borderRadius="10px"
            padding="20px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          >
            <Typography fontSize="5.5vw">{action?.options[1]}</Typography>
          </Box>
        </Box>
    );
}

export default GameQuestion;




