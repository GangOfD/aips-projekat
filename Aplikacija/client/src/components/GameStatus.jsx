import GameWaiting from "components/GameWaiting";
import GameQuestion from "components/GameQuestion";
import QuestionResult from "components/QuestionResult";
import GameCompleted from "./GameCompleted";
import GameFlow from "./GameFlow";
import { Box } from "@mui/material";

const GameStatus = ({ status, score }) => {
    
    const statusComponents = {
      waiting: GameWaiting,
      inProgress: GameFlow,
      finished: GameCompleted,
    };
  
    
    const SelectedStatus = statusComponents[status] ;
  
    return (
      <>
        <SelectedStatus score={score}/>
      </>
    );
  };
  
  export default GameStatus;