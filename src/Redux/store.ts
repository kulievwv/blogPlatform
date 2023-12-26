import {combineReducers, configureStore} from '@reduxjs/toolkit';

import { blogAPI } from '../API/api';
import { authSlice } from './Slices';

const rootReducer = combineReducers({
    [blogAPI.reducerPath]: blogAPI.reducer,
    auth: authSlice.reducer
})

export const store =  configureStore({
        reducer: rootReducer,
        middleware: (getGetDefaultMiddleware) =>
        getGetDefaultMiddleware().concat(blogAPI.middleware)
    })

export type RootState = ReturnType<typeof store.getState>;