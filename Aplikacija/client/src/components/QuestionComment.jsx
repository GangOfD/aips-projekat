import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";
import Lottie from "lottie-react";
let myData =require('../assets/animation.json');

const QuestionComment=({action})=>{

    const token= useSelector((state)=>state.token);
    const theme=useTheme();
    
    
    return (
      <Box
        width="90%"
        borderRadius="20px"
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundColor={theme.palette.primary.light}
        padding="15px"
        gap="5px"
        margin="auto"
        marginTop="15vh"
      >
        <Box style={{ overflow: 'hidden', maxWidth: '100%', maxHeight: '70%' }}>
          <Typography fontSize="1.5rem" color="#fff" fontWeight="bold">
            {action}
          </Typography>
        </Box>

        <Box style={{ width: '15%', height: '15%' }}>
          <Lottie animationData={myData} />
        </Box>
      </Box>


    );
}

export default QuestionComment;




