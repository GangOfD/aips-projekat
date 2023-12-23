import mongoose, { Schema, Document } from 'mongoose';

interface IOption {
  text: string;
  picture: string;
}

interface IQuestion extends Document {
  questionText: string;
  options: IOption[];
  correctAnswerIndex: number;
}

const questionSchema: Schema = new Schema({
  questionText: {
    type: String,
    required: true,
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
