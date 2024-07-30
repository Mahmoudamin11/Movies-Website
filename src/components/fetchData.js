import axios from 'axios'
const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

export const api = axios.create({
    baseURL,
    params: {
        api_key: apiKey,
    },
});

console.log(apiKey);