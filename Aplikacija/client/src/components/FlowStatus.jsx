import GameQuestion from "components/GameQuestion";
import QuestionResult from "components/QuestionResult";
import QuestionComment from "./QuestionComment";
import { Box } from "@mui/material";

const FlowStatus = ({ flow}) => {
    
    console.log(flow);
    const flowComponents = {
      question: GameQuestion,
      result: QuestionResult,
      comment: QuestionComment,
    };
  
    
    const SelectedFlow = flowComponents[flow.flowName] ;
  
    return (
      <>
        <SelectedFlow action={flow.flowAction}/>
      </>
    );
  };
  
  export default FlowStatus;