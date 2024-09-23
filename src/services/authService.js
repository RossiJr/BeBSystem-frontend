import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_URL = 'http://localhost:8080/api/v1';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/authenticate`,
            { username, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Error during login:", error.response ? error.response.data : error);
        throw error;
    }
};

const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }


    const decodedToken = jwtDecode(token);

    const currentDate = new Date();

    const tokenExpirationDate = new Date(decodedToken.exp * 1000); // exp to millisecond

    // Comparison between current date and token expiration date (considering the current date already has the UTC values stored internally, so we do not need to convert to UTC)
    return currentDate >= tokenExpirationDate;
};


export const logout = () => {
    localStorage.removeItem('token'); // Clear token on logout
};

export const getToken = () => {
    let token = localStorage.getItem('token');
    // Check if token is expired, if so, remove it from localStorage and return null
    if (isTokenExpired(token)) {
        token = null;
        localStorage.removeItem('token');
    }
    return token;
};