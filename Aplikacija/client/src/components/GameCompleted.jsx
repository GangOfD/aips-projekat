import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import {
    RestartAlt
  } from "@mui/icons-material";
import {Box} from "@mui/material";
import socket from "Socket/socketInstance";
import { useSelector } from "react-redux";


const GameCompleted=({score})=>{

    const game=useSelector((state)=>state.game);
    const token=useSelector((state)=>state.token);
    const date=new Date(game.createdAt);
    const dateDisplay=date.toISOString().split('T')[0];
    const theme=useTheme();
    
    

    return (
        <Box
            p="2.5rem"
            width="60%"
            m="1rem auto"
            borderRadius="20px"
            backgroundColor={theme.palette.neutral.light}
            textAlign="center"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
            >
            <Typography variant="h1" color={theme.palette.primary.main} mb={2}>
                🏆 Game Over 🏆
            </Typography>
            <Typography variant="h4" color={theme.palette.text.secondary} mb={1}>
                Game created at: {dateDisplay}
            </Typography>
            <Typography variant="h4" color={theme.palette.text.secondary} mb={1}>
                🎮 Players who participated in the game 🎮
            </Typography>
            <Box mb={2}>
                {score?.scoreBoard.map((player, index) => (
                <Typography
                    key={index}
                    variant="h4"
                    color={theme.palette.text.secondary}
                >
                    {player.username} : {player.points} points
                </Typography>
                ))}
            </Box>
            <Typography variant="h4" color={theme.palette.text.secondary} mb={1}>
                🏁 Game Status: {game.status}
            </Typography>
            <Typography variant="h4" color={theme.palette.text.secondary} mb={1}>
                🆔 Room ID: {game.gameId}
            </Typography>
            <IconButton onClick={()=>socket.emit('restartGame',{gameId:game.gameId, token:token})}>
                <RestartAlt sx={{ fontSize: "55px" }} />
            </IconButton>
            <Typography variant="h4" color={theme.palette.primary.main} mb={2}>
                Restart game
            </Typography>
        </Box>
    );
}

export default GameCompleted;




