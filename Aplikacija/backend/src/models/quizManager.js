class QuizManager {
    constructor() {
      this.rooms = {}; 
    }
  
    async loadQuestionsForRoom(roomID) {
      const questions = await Quiz.findRandomQuestions();
      this.rooms[roomID].questions = questions;
      this.rooms[roomID].currentQuestionIndex = 0;
    }
  
    getCurrentQuestion(roomID) {
      const room = this.rooms[roomID];
      return room.questions[room.currentQuestionIndex];
    }
  
    receiveAnswer(roomID, playerName, answer) {
      const room = this.rooms[roomID];
    }
  
  }
  
  module.exports = new QuizManager();
  