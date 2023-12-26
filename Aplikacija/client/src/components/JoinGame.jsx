import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout, setUser } from "state";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    IconButton,
    Modal,
  } from "@mui/material";
  import {
    Casino,
    PlaylistPlay,
    Cancel
  } from "@mui/icons-material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import CustomModal from "./CustomModal";

  const JoinGame=()=>{

    const token=useSelector((state)=>state.token);
    const user=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const theme=useTheme();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [message,setMessage]=useState("");
    const [freeRooms, setFreeRooms]=useState([]);
    const [roomModal, setRoomModal]=useState(false);

    useEffect(()=>{
        getFreeRooms();
    },[])

    console.log(freeRooms);
    const joinGameSchema = yup.object().shape({
        roomId: yup.string().required("required"),
       });

    const joinGameValues = {
            roomId:""
    };    

    const handleFormSubmit = async (values, action) => {
         if(action==="join" && values.roomId)  await joinGame(values);
    };

    const  joinGame= async (values) =>{
        console.log(values);
        try{
            // const joinGameResponse= await fetch(
            //     `http://localhost:3002/game/${values.roomId}`,
            //     {
            //       method: "POST",
            //       headers: { "Content-Type": "application/json" },
            //       body: JSON.stringify(values),
            //     }
            //   );
            //   if (!joinGameResponse.ok) {
            //     throw new Error('Mistake during joining game fetching');
            //   }
            
            //   const joinedGame = await joinGameResponse.json();
            //   console.log(joinedGame);
            //   setMessage(`You can't join game because: ${joinedGame.message}`);
              setMessage(`You can't join game because: `);
              navigate(`/game/${values.roomId}`);
              

        }
        catch(error){
            console.error("Mistake during joining game",error);
        }
    };

    const  getFreeRooms= async () =>{
        
        try{
            // const freeGamesResponse= await fetch(
            //     `http://localhost:3002/game/`,
            //     {
            //       method: "GET",
            //       headers: { "Content-Type": "application/json" },
            //       body: JSON.stringify(values),
            //     }
            //   );
            //   if (!freeGamesResponse.ok) {
            //     throw new Error('Mistake during games fetching');
            //   }
            
            //   const freeGames = await freeGamesResponse.json();
            //   console.log(freeGames);
           
            setFreeRooms([123,32,42,14,42,421,4242]);
              

        }
        catch(error){
            console.error("Mistake during joining game",error);
        }
    };

    

    return (
        <>
          <Formik
          onSubmit={handleFormSubmit}
          initialValues={joinGameValues}
          validationSchema={joinGameSchema}
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
                    m="0.7rem auto"
                    width="100%"
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
                    Join game
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
                            handleFormSubmit(values, "join");
                        }}
                        sx={{ 
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff", }}
                        >
                        <Casino sx={{ fontSize: "25px" }} />
                        </IconButton>
                        <Typography
                        color={theme.palette.primary.light}
                        fontSize="1.2rem"
                        textAlign="center"
                        fontWeight="bold"
                        >
                        Join game
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
                            setRoomModal(prevModal=>!prevModal)
                            
                        }}
                        sx={{
                            backgroundColor: theme.palette.neutral.medium, color: "#fff"
                        }}
                        >
                        <PlaylistPlay sx={{ fontSize: "25px" }} />
                        </IconButton>
                        <Typography
                        color={theme.palette.primary.light}
                        fontSize="1.2rem"
                        textAlign="center"
                        fontWeight="bold"
                        >
                        Show free rooms
                        </Typography>
                    </Box>
                    </Box>
                </Box>
        
            </form>
            )}
            </Formik>

            <CustomModal
                open={roomModal}
                onClose={() => setRoomModal(prevModal => !prevModal)}
                title="Free rooms ids"
                content={freeRooms.map((room, index) => (
                <Typography key={index}>{room}</Typography>
                ))}
            />
        </>
          
      );
}

export default JoinGame;