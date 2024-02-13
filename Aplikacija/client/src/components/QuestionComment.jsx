import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";


const QuestionComment=({action})=>{

    const token= useSelector((state)=>state.token);
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
        >
          <Typography variant="h3" color="#fff" fontWeight="bold">
            Comment: Why are you gay?
          </Typography>

        </Box>
    );
}

export default QuestionComment;




