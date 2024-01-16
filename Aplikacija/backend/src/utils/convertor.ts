import {IQuestion, questionDto} from "../models/questionModel"

export default function IQuestionToQuestionDto(question: any): questionDto { //question:IQuestion
    const questionDto: questionDto = {
      questionText: question.question,
      options: question.options.map((option:any) => option.text),
      img: undefined, 
    };
    return questionDto;
  }