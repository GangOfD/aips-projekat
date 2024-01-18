import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {Box} from "@mui/material";
import {
    ArrowCircleRight,
    ArrowCircleLeft
  } from "@mui/icons-material";


const GameQuestion=()=>{

   
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
                <Typography fontSize="3.5rem"> Beograd </Typography>
            </Box>
            <Box
                width="30%"
                backgroundColor={theme.palette.neutral.light}
                border= "3px solid green"
            >
                <Typography fontSize="3.5rem"> Koji je glavni grad Srbije? </Typography>
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                >
                    <IconButton >
                        <ArrowCircleLeft sx={{ fontSize: "55px" }} />
                    </IconButton>

                    <IconButton >
                        <ArrowCircleRight sx={{ fontSize: "55px" }} />
                    </IconButton>
                </Box>
                
            </Box>
            <Box
            
            >
                <Typography fontSize="3.5rem"> Novi Sad </Typography>
            </Box>

           
        </Box>
    );
}

export default GameQuestion;




