import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state/authSlice";



const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  age: yup.number().positive("You must enter positive number").integer("You must enter an integer").required("You must enter your age").min(3,"Babies can'play"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  username:"",
  email: "",
  password: "",
  age:""
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [message, setMessage]= useState("");

  const register = async (values, onSubmitProps) => {
    
    try{
        const savedUserResponse = await fetch(
            "http://localhost:3002/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          if (!savedUserResponse.ok) {
            throw new Error('Mistake during reg fetching');
          }
        
          const savedUser = await savedUserResponse.json();
          console.log(savedUser);
          onSubmitProps.resetForm();
      
          if (savedUser) {
            setPageType("login");
          }
    }
    catch(error){
        console.error('Mistake during registration:', error);
    }
    
  };

  const login = async (values, onSubmitProps) => {

    try{
        
        const loggedInResponse = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        });

        const loggedIn = await loggedInResponse.json();

        if(!loggedInResponse.ok){
            if(loggedInResponse.status==400){
                  setMessage(loggedIn.message);
                }
            else{
                  throw new Error('Mistake during create game fetching');
            }
        }
       
        else{
          if (loggedIn.user) {
            dispatch(
                setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
                })
            );
            navigate("/home");
         }
        }
        onSubmitProps.resetForm();

        
    }
    catch(error){
        console.error('Mistake during login:', error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
            }}
          >
            {isRegister && (
              <>
                
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username || ""}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Age"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age ||""}
                  name="age"
                  error={Boolean(touched.age) && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email || ""}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password || ""}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 2"}}
              
            />

            <Typography
                color={palette.primary.light}
                fontSize={{ xs: "1.0rem", md: "1.0rem" }}
                textAlign="center"
                fontWeight="bold"
                letterSpacing="1px"
                gridColumn= "span 4"         
            >
                {message}
            </Typography>
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.light,
                color: palette.neutral.light,
                "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.dark,
                  },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.light,
                "&:hover": {
                  cursor: "pointer",
                  color:palette.primary.dark,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
