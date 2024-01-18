import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeMode } from "state/authSlice";
let backgroundImage =require('../../assets/background.jpg');

const LoginPage = () => {
  const theme = useTheme();
  const navigate= useNavigate();
  const dispatch=useDispatch();
  const token= useSelector((state)=>state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const primaryLight = theme.palette.primary.light;

  useEffect(()=>{
    if(token){
      navigate("/home");
    }
    else{
      dispatch(changeMode("dark"));
    }
  },[]);

  return (
    <Box
        width="100%"
        height="100vh"  // Postavite visinu prema potrebi
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",  
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
    >
      <Box
        width="100%"
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color={primaryLight}>
          Higher&Lower
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
       
      >
        <Typography 
         fontWeight="500"
         variant="h5" 
         color={primaryLight} 
         textAlign="center" 
         sx={{ mb: "1.5rem" }}
         >
          Welcome to the most entertaining game!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
