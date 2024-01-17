import Navbar from "components/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Box,
    useMediaQuery,
    Typography,
    useTheme,
  } from "@mui/material";
  import {
    AddCircle,
    Delete
  } from "@mui/icons-material";
import HostGame from "components/HostGame";
import JoinGame from "components/JoinGame";
  
const HomePage=()=>{

    const token=useSelector((state)=>state.token);
    const user=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const theme=useTheme();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [freeRooms, setFreeRooms]=useState([]);

    useEffect(()=>{
      getFreeRooms();
    },[])

    const  getFreeRooms= async () =>{
        
      try{
          const freeGamesResponse= await fetch(
              `http://localhost:3002/games/Active`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                
              }
            );
            if (!freeGamesResponse.ok) {
              throw new Error('Mistake during games fetching');
            }
          
            else{
              const freeGames = await freeGamesResponse.json();
              setFreeRooms(freeGames.availableGames);
            }
            
            

      }
      catch(error){
          console.error("Mistake during free games method",error);
      }
  };



    
    return (
        <>
          <Navbar/>
          <Box 
            display= "flex"
            flexDirection={isNonMobile? "row" : "column"}
            width="100%"
            justifyContent="space-evenly"
            mt="100px"
          >
            <HostGame getFreeRooms={getFreeRooms} />
            <JoinGame freeRooms={freeRooms} />
        </Box>
          
        </>
          
      );
}

export default HomePage;