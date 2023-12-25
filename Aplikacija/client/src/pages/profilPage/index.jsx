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
import { setLogout } from "state";
import { useEffect } from "react";

const ProfilPage=()=>{

  const user= useSelector((state)=>state.user);
  const theme = useTheme();
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
    if(action==="delete")  await deleteProfile(values);
    if(action==="update")  await updateProfile(values);
  };
  
  const deleteProfile= async(values)=>{
    console.log(values);
    console.log("HELO from DELETE");
    
  //   try{
  //     const deleteProfileResponse = await fetch(
  //         "http://localhost:3002/user/delete",
  //         {
  //           method: "DELETE",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(values),
  //         }
  //       );
  //       if (!deleteProfileResponse.ok) {
  //         throw new Error('Mistake during delete fetching');
  //       }
      
  //       const deletedProfile = await deleteProfileResponse.json();
  //       console.log(deletedProfile);
        
    
  //       if (deletedProfile) {
  //         dispatch(
  //           setLogout()
  //       );
  //       
  //       navigate("/");
  //       }
  // }
  // catch(error){
  //     console.error('Mistake during registration:', error);
  // }
  };

  const updateProfile= async(values)=>{
    console.log(values);
    console.log("HELO from UPDATE");
    
  //   try{
  //     const updateProfileResponse = await fetch(
  //         "http://localhost:3002/user/delete",
  //         {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(values),
  //         }
  //       );
  //       if (!updateProfileResponse.ok) {
  //         throw new Error('Mistake during delete fetching');
  //       }
      
  //       const updatedProfile = await deleteProfileResponse.json();
  //       console.log(updatedProfile);
        
    
  //       if (deletedProfile) {
  //         dispatch(
  //           setUser({updatedProfile})
  //       );
  //       
  //       }
  // }
  // catch(error){
  //     console.error('Mistake during registration:', error);
  // }
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
             p="2rem"
             m="2rem auto"
             borderRadius="1.5rem"
          >
            <Typography
              marginBottom="30px"
              color={theme.palette.primary.light}
              fontSize="40px"
              textAlign="center"
            >
              Profile information
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
                  value={values.age ||""}
                  name="age"
                  error={Boolean(touched.age) && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Old password"
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
                  label="New password"
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

            {/*Butons*/}
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
                marginX="20px"  // Dodato rastojanje između parova ikonice i teksta
              >
                <IconButton onClick={()=>{
                  handleFormSubmit(values,"delete");
                  }}>
                  <Delete sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography 
                  color={theme.palette.primary.light}
                  fontSize="1.2rem"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Obriši profil
                </Typography>
              </Box>

              {/* Drugi red */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginX="20px"  // Dodato rastojanje između parova ikonice i teksta
              >
                <IconButton onClick={()=>{
                  handleFormSubmit(values, "update");
                  }}>
                  <ChangeCircle sx={{ fontSize: "25px" }} />
                </IconButton>
                <Typography 
                  color={theme.palette.primary.light}
                  fontSize="1.2rem"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Izmeni podatke
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