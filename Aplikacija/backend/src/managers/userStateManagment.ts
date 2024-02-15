// Assuming UserState is already defined elsewhere
import { UserState } from '../models/IUserState';
import { Store } from './store';

export class UserStateManagement {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    public updateUserState(userId: string, updates: Partial<UserState>): void {
        const userState = this.store.getUserState(userId);
        if (userState) {
            const updatedState = { ...userState, ...updates };
            this.store.setUserState(userId, updatedState);
        } else {
            console.error(`UserState not found for userId: ${userId}`);
        }
    }

}
