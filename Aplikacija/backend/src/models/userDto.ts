import Player from '../models/playerModel'; 

class userDto {
    email: string;
    age?: number;
    username: string;
  
    constructor(email: string, username: string, age?: number) {
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

  
  export default userDto;
  