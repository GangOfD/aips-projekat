import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:"dark",
    user:null,
    token:null,
   
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
        
    },
});

export const { setMode,changeMode, setLogin, setUser, setLogout} = authSlice.actions;
export default authSlice.reducer;