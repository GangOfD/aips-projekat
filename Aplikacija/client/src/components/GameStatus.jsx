import GameWaiting from "components/GameWaiting";
import GameQuestion from "components/GameQuestion";
import QuestionResult from "components/QuestionResult";
import GameCompleted from "./GameCompleted";
import GameFlow from "./GameFlow";
import { Box } from "@mui/material";

const GameStatus = ({ status }) => {
    
    const statusComponents = {
      waiting: GameWaiting,
      inProgress: GameFlow,//Ovde je bilo GameQuestion
      completed: GameCompleted,
    };
  
    
    const SelectedStatus = statusComponents[status] ;
  
    return (
      <>
        <SelectedStatus/>
      </>
    );
  };
  
  export default GameStatus;