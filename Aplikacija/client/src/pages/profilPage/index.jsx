import Navbar from "components/Navbar";
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
import { useDispatch, useSelector } from "react-redux";


const ProfilPage=()=>{
    const profileSchema = yup.object().shape({
        username: yup.string().required("required"),
        oldPassword: yup.string().required("required"),
        newPassword: yup.string(),
        age: yup.number().positive("You must enter positive number").integer("You must enter an integer").required("You must enter your age").min(3,"Babies can'play"),
      });

    const initialValuesProfile = {
        username:"",
        oldPassword: "",
        age:""
      };

    const user= useSelector((state)=>state.user);

    return (
        <Navbar/>

    )
}

export default ProfilPage;