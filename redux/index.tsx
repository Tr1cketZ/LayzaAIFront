// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import reducer from './AuthSlice';
import userProfileReducer from './UserProfileSlice';

export const store = configureStore({
    reducer: {
        auth: reducer,
        userProfile: userProfileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;