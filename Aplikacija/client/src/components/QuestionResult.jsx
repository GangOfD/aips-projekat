import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";


const QuestionResult=({action})=>{

    const token= useSelector((state)=>state.token);
    const game= useSelector((state)=>state.game);
    const theme=useTheme();
    
    return (
        <Box
          width="100%"
          borderRadius="20px"
          textAlign="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor={theme.palette.primary.light}
          padding="15px"
          gap="5px"
          height="40%"  
          margin="auto"  
          marginTop="15vh"
        >
          <Typography fontSize="2.5rem" color="#fff" fontWeight="bold">
            Question asked: {action.questionsAsked}
          </Typography>

          <Box
            width="98%"
            borderRadius="10px"
            backgroundColor={theme.palette.background.default}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            margin="auto"
          >
            <Typography variant="h3" marginBottom="20px" color={theme.palette.primary.main}>
              Scoreboard:
            </Typography>

            {action.scoreBoard.map((score, index) => (
              <Typography key={index} fontSize="1.2rem" color={theme.palette.text.primary}>
                User: {score.username} | Points: {score.points}
              </Typography>
            ))}
          </Box>
        </Box>
    );
}

export default QuestionResult;




