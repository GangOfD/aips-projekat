"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPassword = void 0;
const validPassword = (password) => {
    const minLength = 6;
    const maxLength = 20;
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < minLength || password.length > maxLength) {
        return { valid: false, message: `Password must be between ${minLength} and ${maxLength} characters` };
    }
    return { valid: true };
};
exports.validPassword = validPassword;
