import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import {Box} from "@mui/material";


const GameStatus=({game})=>{

    const date=new Date(game.createdAt);
    const dateDisplay=date.toISOString().split('T')[0];
    const theme=useTheme();

    return (
        <Box
            p="1.5rem"
            width="40%"
            m="1rem auto"
            borderRadius="20px"
            backgroundColor={theme.palette.neutral.light}
            textAlign="center"
            >
            <Typography variant="h4" color={theme.palette.primary.main} mb={2}>
                Hello mortal
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={1}>
                Game created {dateDisplay}
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={1}>
                Nisu to igrači
            </Typography>
            <Box mb={2}>
                {game.players.map((player, index) => (
                <Typography
                    key={index}
                    variant="body2"
                    color={theme.palette.text.secondary}
                >
                    {player}
                </Typography>
                ))}
            </Box>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={1}>
                Game status {game.status}
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} mb={1}>
                Room id {game.gameId}
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary}>
                Created by {game.createdBy}
            </Typography>
        </Box>
    );
}

export default GameStatus;




