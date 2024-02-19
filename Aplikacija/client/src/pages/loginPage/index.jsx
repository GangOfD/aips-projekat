import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeMode } from "state/authSlice";
import Lottie from "lottie-react";
let backgroundImage =require('../../assets/background.jpg');
let quizAnimation =require('../../assets/quiz-animation.json');

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
        
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        display="flex"
        flexDirection="column"
        justifyContent="center"  
        alignItems="center"   
        textAlign="center"
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",  
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
    >
      <Box
        p="1rem 6%"
        textAlign="center"
      >
        <Typography
          fontWeight="bold"
          fontSize={{
            xs: "2rem",  // Ekstra mali ekrani
            sm: "2.5rem", // Mali ekrani
            md: "3rem",  // Srednji ekrani
            lg: "3.5rem", // Veliki ekrani
            xl: "4rem",  // Ekstra veliki ekrani
          }}
          color={primaryLight}
        >
          Higher&Lower
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "35%" : "70%"}
       
        borderRadius="1.5rem"
        display="flex"
        flexDirection="column"
        justifyContent="center"  
        alignItems="center"      
      >
        <Box style={{ width: '45%', height: '55%'}}>
          <Lottie animationData={quizAnimation} />
        </Box>

        <Typography 
         fontWeight="500"
         variant="h5" 
         color={primaryLight} 
         textAlign="center" 
         sx={{ mb: "1.5rem" }}
         >
          Test your knowledge!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
