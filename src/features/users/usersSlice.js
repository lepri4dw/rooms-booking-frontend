import { createSlice } from '@reduxjs/toolkit';
import {googleLogin, login, logout, register} from './usersThunks';


const initialState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  logoutLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.registerError = null;
      state.registerLoading = true;
    });
    builder.addCase(register.fulfilled, (state, {payload: user}) => {
      state.registerLoading = false;
      state.user = user;
    });
    builder.addCase(register.rejected, (state, {payload: error}) => {
      state.registerLoading = false;
      state.registerError = error || null;
    });

    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(login.fulfilled, (state, {payload: user}) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state, {payload: error}) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });

    builder.addCase(googleLogin.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, {payload: user}) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(googleLogin.rejected, (state, {payload: error}) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });

    builder.addCase(logout.pending, (state) => {
      state.logoutLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.logoutLoading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.logoutLoading = false;
    });
  }
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser} = usersSlice.actions;

export const selectUser = (state) => state.users.user;
export const selectRegisterLoading = (state) => state.users.registerLoading;
export const selectRegisterError = (state) => state.users.registerError;
export const selectLoginLoading = (state) => state.users.loginLoading;
export const selectLoginError = (state) => state.users.loginError;
export const selectLogoutLoading = (state) => state.users.logoutLoading;