import axios from 'axios';
import {apiURL} from "./constants";

const axiosApi = axios.create({
  baseURL: apiURL,
});

export const addInterceptors = (store) => {
  axiosApi.interceptors.request.use((config) => {
    const token = store.getState().users.user?.token;
    const headers = config.headers;
    headers.set('Authorization', token);

    return config;
  });
};

export default axiosApi;