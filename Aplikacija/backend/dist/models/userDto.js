"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userDto {
    constructor(email, username, age) {
        this.email = email;
        this.age = age;
        this.username = username;
    }
}
//   const toUserDto = (player: typeof Player): UserDto => {
//     return {
//       email: player.email,
//       age: player.age,
//       username: player.username,
//     };
//   };
exports.default = userDto;
