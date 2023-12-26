import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogged: false
    },
    reducers:{
        setLoggedIn: (state, action) => {
            state.isLogged = action.payload
        }
    }
        
})

export const {setLoggedIn} = authSlice.actions