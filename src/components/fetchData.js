import axios from 'axios'
const apiKey = `2f1b8e48747508db4050f87a65c42f1d`
const baseURL = 'https://api.themoviedb.org/3';

export const api = axios.create({
    baseURL,
    params: {
        api_key: apiKey,
    },
});