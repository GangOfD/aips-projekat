import Navbar from "components/Navbar";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Delete,
  ChangeCircle
} from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setUser } from "state/authSlice";
import { useEffect } from "react";

const ProfilPage=()=>{

  const user= useSelector((state)=>state.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const profileSchema = yup.object().shape({
        username: yup.string().required("required"),
        oldPassword: yup.string().required("required"),
        newPassword: yup.string(),
        age: yup.number().positive("You must enter positive number").integer("You must enter an integer").required("You must enter your age").min(3,"Babies can'play"),
  });

 

  const initialValuesProfile = {
        username:user.username,
        oldPassword: "",
        newPassword: "",
        age:user.age
  };    

  const handleFormSubmit = async (values, action) => {
    if(action==="delete" && values.oldPassword)  await deleteProfile(values);
    if(action==="update" && values.oldPassword)  await updateProfile(values);
  };
  
  const deleteProfile= async(values)=>{
    console.log(values);
    console.log("HELO from DELETE");
    console.log(user.username);
      try{
        const deleteProfileResponse = await fetch(
            `http://localhost:3002/player/${user.username}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          if (!deleteProfileResponse.ok) {
            throw new Error('Mistake during delete fetching');
          }
        
          const deletedProfile = await deleteProfileResponse.json();
          console.log(deletedProfile);
          
      
          if (deletedProfile) {
            dispatch( setLogout());
            navigate("/");
          }
    }
    catch(error){
        console.error('Mistake during registration:', error);
    }
  };

  const updateProfile= async(values)=>{
    console.log(values);
    console.log("HELO from UPDATE");
    
      try{
        const updateProfileResponse = await fetch(
            `http://localhost:3002/player/${user.username}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          if (!updateProfileResponse.ok) {
            throw new Error('Mistake during update fetching');
          }
        
          const updatedProfile = await updateProfileResponse.json();
          console.log(updatedProfile.user);
          
      
          if (updatedProfile.user) {
            dispatch( setUser({user:updatedProfile.user}));
          }
    }
    catch(error){
        console.error('Mistake during update fetching:', error);
    }
  };
    

  return (
    <>
      <Navbar/>
      <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesProfile}
      validationSchema={profileSchema}
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
      }) =>(
        <form onSubmit={handleSubmit}>
          <Box
            width={isNonMobile ? "30%" : "93%"}
            p="0.7rem"
            m="0.7rem auto"
            borderRadius="2.5rem"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
            backgroundColor={theme.palette.neutral.light}
          >

            <Typography
              marginBottom="30px"
              color={theme.palette.primary.light}
              fontSize={{ xs: "20px", md: "33px" }}
              textAlign="center"
              fontWeight="bold"
              letterSpacing="1px"
            >
              Your Profile Information
            </Typography>

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <>
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username || ""}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="Age"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age || ""}
                  name="age"
                  error={Boolean(touched.age) && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 4" }}
                />

                <Typography
                  sx={{
                    gridColumn: "span 4",
                    color: theme.palette.primary.light,
                    fontSize: "1.0rem",
                    textAlign: "center",
                    mt: 2,
                  }}
                >
                  Enter your current password to make any changes.
                </Typography>

                <TextField
                  label="Old Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.oldPassword || ""}
                  name="oldPassword"
                  error={Boolean(touched.oldPassword) && Boolean(errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="New Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.newPassword || ""}
                  name="newPassword"
                  error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            </Box>

            {/*Buttons*/}
            <Box
              marginTop="20px"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              {/* Prvi red */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginX="20px" // Dodato rastojanje između parova ikonice i teksta
              >
                <IconButton
                  onClick={() => {
                    handleFormSubmit(values, "delete");
                  }}
                  sx={{ backgroundColor: theme.palette.error.main, color: "#fff" }}
                >
                  <Delete sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography
                  color={theme.palette.primary.light}
                  fontSize="1.2rem"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Delete Profile
                </Typography>
              </Box>

              {/* Drugi red */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginX="20px" // Dodato rastojanje između parova ikonice i teksta
              >
                <IconButton
                  onClick={() => {
                    handleFormSubmit(values, "update");
                  }}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  <ChangeCircle sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography
                  color={theme.palette.primary.light}
                  fontSize="1.2rem"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Update Information
                </Typography>
              </Box>
            </Box>
          </Box>

        </form>
      )}
      </Formik>
    </>
      
  );
};

export default ProfilPage;