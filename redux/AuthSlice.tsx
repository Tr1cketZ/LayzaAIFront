// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens(state, action: PayloadAction<{ access: string; refresh: string }>) {
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        clearTokens(state) {
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;