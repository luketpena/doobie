import { createSlice } from '@reduxjs/toolkit';
import { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';
import { Profile } from '../util/types/database';
import { AppDispatch } from './store';

interface AuthState {
  initialized: boolean;
  resetting: boolean; // resetting password
  authUser: {
    id: string;
    name: string;
    email: string;
  } | null; // auth user
  activeProfile: Profile | null;
}

const initialState: AuthState = {
  initialized: false,
  resetting: false,
  authUser: null,
  activeProfile: null,
};

export const authenticationSlice: any = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    resetting: (state, action) => {
      state.resetting = action.payload;
    },
    authenticate: (state, action) => {
      state.authUser = action.payload;
    },
    setActiveUserProfile: (state, action) => {
      state.activeProfile = action.payload;
    },
    unauthenticate: (state) => {
      Object.assign(state, {
        ...initialState,
        initialized: true,
      });
    },
    initialized: (state) => {
      state.initialized = true;
    },
  },
});

export const {
  authenticate,
  setActiveUserProfile,
  unauthenticate,
  resetting,
  initialized,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;

// -- THUNKS --

export const handleSessionChange =
  (event: AuthChangeEvent, session: AuthSession | null) =>
  (dispatch: AppDispatch) => {
    switch (event) {
      case 'PASSWORD_RECOVERY':
        dispatch(resetting(true));
        break;
      case 'SIGNED_IN':
        dispatch(authenticate(session?.user));
        break;
      case 'SIGNED_OUT':
      case 'USER_DELETED':
        dispatch(unauthenticate());
        break;
    }
  };

// -- SELECTORS --
export const selectAuthInitialized = (state: any) =>
  state.authentication.initialized;
export const selectAuthUser = (state: any) => state.authentication.authUser;
export const selectProfile = (state: any) => state.authentication.activeProfile;
