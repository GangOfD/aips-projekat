import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
let brainAnimation =require('../assets/brain-animation.json');

const GameQuestion=({action})=>{

    const token= useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const theme=useTheme();
    const mode=useSelector((state)=>state.mode);
    const [isAnimating, setAnimating]=useState({left:false, right:false});
    const containerRef = useRef(null);
    const [timer, setTimer] = useState(10);

    const startAnimation=(side)=>{
      side=="left"? setAnimating({left:true}): setAnimating({right:true});
      
      setTimeout(() => {
        setAnimating({left:false, right:false});
      }, 1000); 
    }    
    
    useEffect(() => {
      const handleKeyPress = (event) => {
        
        console.log("KeyPressed:", event.key);
        socket.emit("receiveKeyPressAnswer", {token:token, keyPressed:event.key, gameId:game.gameId});
  
      };
      
      window.addEventListener("keydown", handleKeyPress);
      containerRef.current && containerRef.current.focus();

      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
  
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
        clearInterval(timerInterval);
      };
    }, [timer]);

    return (
        <Box
          tabIndex={0}
          width="100%"
          textAlign="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Box
            width="33%"
            minHeight="100vh"
            backgroundColor={isAnimating.left? theme.palette.primary.main: theme.palette.primary.light}
            padding="20px"
            
          >
            <Typography
              marginTop="250px"
              fontSize="5.5vw" 
              color="#FFFF"
            >
              {action?.options[0]}
            </Typography>
          </Box>
          <Box
            width="33%"
            minHeight="100vh"
            backgroundColor= {theme.palette.primary.main}
            border="3px solid green"
            padding="20px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            
          >
            <Box marginBottom="30px" style={{ width: '95%', height: '75%' }}>
              <Lottie animationData={brainAnimation} loop={false}/>
            </Box>
            <Typography variant="h3" >
              {action?.questionText}
            </Typography>
            <Typography variant="h3" >
              Time: {timer}
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
            width="33%"
            minHeight="100vh"
            backgroundColor={isAnimating.right?  theme.palette.neutral.light : theme.palette.primary.light}
            padding="20px"
            
          >
            <Typography
              marginTop="250px"
              fontSize="5.5vw" 
              color="#FFFF"
            >
              {action?.options[1]}
            </Typography>
          </Box>
        </Box>
    );
}

export default GameQuestion;




