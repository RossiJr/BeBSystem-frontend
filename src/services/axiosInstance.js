import axios from 'axios';
import { getToken } from './authService';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
        } else {
            throw new Error('Token not found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;