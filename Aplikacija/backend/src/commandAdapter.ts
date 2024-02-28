import { ENV } from "./enviroments/constants";
export default function keyToAnswerValue(key: string): number | null {
    switch (key) {
        case ENV.firstKeyOption:
            return 0; 
        case ENV.secondKeyOption:
            return 1;
        case ENV.undoKeyOption:
            return 43;
        default:
            return null;
    }
}