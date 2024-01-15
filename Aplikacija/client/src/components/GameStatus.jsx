import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import {Box} from "@mui/material";


const GameStatus=({game})=>{

    const theme=useTheme();

    return (
        <Box
            p="0.7rem"
            width="30%"
            m="0.7rem auto"
            borderRadius="2.5rem"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
            backgroundColor={theme.palette.neutral.light}
            textAlign="center"
        >
            <Typography>
                Hello mortal
            </Typography>
            <Typography>
                {/* Game created {game.createdAt} */}
            </Typography>
            <Typography>
                {/* Nisu to igrači {game.players.forEach(player => {
                    <Typography> {player}</Typography> 
                })} */}
            </Typography>
            <Typography>
               {/* Game status {game.status} */}
            </Typography>
            <Typography>
                {/* Room id {game.gameId} */}
            </Typography>
            <Typography>
                {/* Created by{game.createdBy} */}
            </Typography>
        </Box>
    );
}

export default GameStatus;




