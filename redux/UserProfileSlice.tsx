import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PerfilResponse } from '../utils/Objects';

interface UserProfileState {
    profile: PerfilResponse | null;
}

const initialState: UserProfileState = {
    profile: null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUserProfile(state, action: PayloadAction<PerfilResponse>) {
            state.profile = action.payload;
        },
        clearUserProfile(state) {
            state.profile = null;
        },
    },
});

export const { setUserProfile, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
