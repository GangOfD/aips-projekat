import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:"dark",
    user:null,
    token:null,
    game:null,
}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode= state.mode ==="light" ? "dark" : "light";
        },
        changeMode:(state,action)=>{
            state.mode=action.payload;
        },
        setLogin:(state, action) =>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        setUser:(state,action)=>{
          state.user=action.payload.user;
        },
        setLogout:(state,action) =>{
            state.user=null;
            state.token=null;
        },
        setGame:(state,action)=>{
            state.game= action.payload.game;
        },
        setGameStatus: (state, action) => {
            
            if (state.game) {
              state.game.status = action.payload.status;
            }
          },
        
    },
});

export const { setMode,changeMode, setLogin, setUser, setLogout, setGame, setGameStatus} = authSlice.actions;
export default authSlice.reducer;