
class Store {
    private userStates: { [userId: string]: any } = {};

    updateUserState(userId: string, state: any): void {
        this.userStates[userId] = { ...this.userStates[userId], ...state };
    }

    getUserState(userId: string): any {
        return this.userStates[userId];
    }

    async saveResultsToDatabase(): Promise<boolean> {
        return false;
      
    }

    resetCurrentQuestionState(): void {
        //this.currentQuestionState = {}; // Reset for new question
    }

    calculateResults(): any {
        // Logic to calculate and return results based on currentQuestionState
    }

    // Additional methods as needed
}

export default new Store();



