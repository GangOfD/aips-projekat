import mongoose, { Schema, Document } from 'mongoose';
import { PredefinedTags } from './tags/enumTags';
interface IOption {
  text: string;
  picture: string;
  hint:string;
}

export interface questionDto {
  questionText: string;
  options: string[];
  img:string|undefined;
}

export interface IQuestion {
  id: mongoose.Types.ObjectId;
  questionText: string;
  options: IOption[];
  correctAnswerIndex: number;
  hint:{
    type:string[],
    required:false,
    min:0,
    max:100
  },
  proof:{
    type:string[],
    required:false,
    min:0,
    max:100
  }
  difficulty:{ 
    type:number,
    default:undefined,
    min:0,
    max:100
  }
  tags:{
   type:PredefinedTags[];
   min:0,
   max:5
  }
}
//TODO
interface ITagValidationProps {
  value: string[]; // Adjust this type according to the actual structure of your tags
}

const questionSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
 tags: {
  type: [String],
  required: false,
  max: 5,
  validate: {
    validator: function(v: string[]) {
     // return v.every(tag => Object.values(PredefinedTags).includes(tag));
    },
    message: (props: ITagValidationProps) => `${props.value} is not a valid tag`
  }
},
  options: {
    type: [{
      text: { type: String, required: true },
      picture: { type: String, required: true }
    }],
    required: true,
    validate: [
      (value: IOption[]) => value.length === 2,
      'Options array must contain exactly two items.',
    ],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    // validate: {
    //   validator: function(value: number) {
    //     return value >= 0 && value < this.options.length;
    //   },
    //   message: 'Correct answer index must be within the range of the options array.',
    // },
  },
});

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
