
import dotenv from 'dotenv'
import OpenAI from "openai";

const openai = new OpenAI();

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export function generateAIResponse(input: string) : string{
return " " ;
}
