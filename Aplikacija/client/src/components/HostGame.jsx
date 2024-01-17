import Navbar from "components/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    AddCircle,
    Delete
  } from "@mui/icons-material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import socket from "Socket/socketInstance";
  

  const HostGame=({getFreeRooms})=>{

    const token=useSelector((state)=>state.token);
    const user=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const theme=useTheme();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [message,setMessage]=useState("");

    socket.on('createGame',({res})=>{
      console.log(res);
    });

    

    const hostGameSchema = yup.object().shape({
        roomId: yup.string().required("required"),
    });

    const initialGameValues = {
            roomId:""
    };    

    const handleFormSubmit = async (values, action) => {
        //if(action==="host" && values.roomId)  await createGame(values);
        console.log(values);
        if(action==="host" && values.roomId)  socket.emit('createGame',{user:user.username, roomId:values.roomId})
        if(action==="delete" && values.roomId)  await deleteGame(values);
        
    };

    const  createGame= async (values) =>{
        console.log(values, " A token je : " , token);
        // try{
        //     const createGameResponse= await fetch(
        //         `http://localhost:3002/games/`,
        //         {
        //           method: "POST",
        //           headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`,
        //           },
        //           body: JSON.stringify(values),
        //         }
        //       );

        //       const createdGame = await createGameResponse.json();
        //       if (!createGameResponse.ok) {
        //         if(createGameResponse.status==403){
        //           setMessage(createdGame.message);
        //         }
        //         else{
        //           throw new Error('Mistake during create game fetching');
        //         }
                
        //       }
        //       else{
        //         navigate(`/game/${values.roomId}`);
        //       }
             
              
              

        // }
        // catch(error){
        //     console.error("Mistake during creating game",error);
        // }
    };

    const  deleteGame= async (values) =>{
        console.log(values);
        try{
            const deleteGameResponse= await fetch(
                `http://localhost:3002/games/`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                    body: JSON.stringify(values),
                }
              );

              const deletedGame = await deleteGameResponse.json();

              if (!deleteGameResponse.ok) {
                if(deleteGameResponse.status==404){
                  setMessage(deletedGame.message);
                }
                else{
                  throw new Error('Mistake during delete game fetching');
                }
                
              }
              else{
                setMessage(deletedGame.message);
                getFreeRooms();

              }
              

        }
        catch(error){
            console.error("Mistake during deleting game",error);
        }
    };

    return (
        <>
          <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialGameValues}
          validationSchema={hostGameSchema}
          >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) =>(
            <form onSubmit={handleSubmit}>
              <Box
                p="0.7rem"
                width="100%"
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
                  Host game
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
                      label="Room ID"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.roomId || ""}
                      name="roomId"
                      error={Boolean(touched.roomId) && Boolean(errors.roomId)}
                      helperText={touched.roomId && errors.roomId}
                      sx={{ gridColumn: "span 4" }}
                    />

                    <Typography
                        color={theme.palette.primary.light}
                        fontSize={{ xs: "1.0rem", md: "1.0rem" }}
                        textAlign="center"
                        fontWeight="bold"
                        letterSpacing="1px"
                        gridColumn= "span 4" 
                    >
                        {message}
                    </Typography>
                    
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
                  
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginX="20px" 
                  >
                    <IconButton
                      onClick={() => {
                        handleFormSubmit(values, "host");
                        resetForm();
                      }}
                      sx={{ 
                        backgroundColor: theme.palette.success.dark,
                        color: "#fff", }}
                    >
                      <AddCircle sx={{ fontSize: "25px" }} />
                    </IconButton>
                    <Typography
                      color={theme.palette.primary.light}
                      fontSize="1.2rem"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      Create game
                    </Typography>
                  </Box>
    
                  
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginX="20px" 
                  >
                    <IconButton
                      onClick={() => {
                        handleFormSubmit(values, "delete");
                        resetForm();
                      }}
                      sx={{
                        backgroundColor: theme.palette.error.main, color: "#fff"
                      }}
                    >
                      <Delete sx={{ fontSize: "25px" }} />
                    </IconButton>
                    <Typography
                      color={theme.palette.primary.light}
                      fontSize="1.2rem"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      Delete game
                    </Typography>
                  </Box>
                </Box>
              </Box>
    
            </form>
          )}
          </Formik>
        </>
          
      );
}

export default HostGame;