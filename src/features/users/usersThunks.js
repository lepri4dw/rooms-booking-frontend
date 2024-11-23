import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { unsetUser } from './usersSlice';

export const register = createAsyncThunk(
  'users/register',
  async (registerMutation, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(registerMutation);
      keys.forEach(key => {
        const value = registerMutation[key];

        if (value !== null) {
          formData.append(key, value);
        }
      });
      const response = await axiosApi.post('/users', formData);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }

  }
);

export const login = createAsyncThunk(
  'users/login',
  async (loginMutation, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post('/users/sessions', loginMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }

  }
);

export const googleLogin = createAsyncThunk(
  'users/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/users/google', { credential });
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  },
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, {getState, dispatch}) => {
    const token = getState().users.user.token;

    await axiosApi.delete('/users/sessions',  {headers: {'Authorization': token}});
    dispatch(unsetUser());
  }
);