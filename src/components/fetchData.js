import axios from 'axios'
const apiKey = import.meta.env.VITE_API_KEY;
export const baseURL = 'https://api.themoviedb.org/3';

export const api = axios.create({
    baseURL,
    params: {
        api_key: apiKey,
    },
});

export const addFavoriteToApi = async (movie, sessionId) => {
    try {
        const response = await api.post(
            `/account/{account_id}/favorite`,
            {
                media_type: 'movie',
                media_id: movie.id,
                favorite: true,
            },
            {
                params: {
                    session_id: sessionId,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to add favorite');
    }
};

export const removeFavoriteFromApi = async (movie, sessionId) => {
    try {
        const response = await api.post(
            `/account/{account_id}/favorite`,
            {
                media_type: 'movie',
                media_id: movie.id,
                favorite: false,
            },
            {
                params: {
                    session_id: sessionId,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to remove favorite');
    }
};

export const fetchFavoritesFromApi = async (sessionId) => {
    try {
        const response = await api.get(`/account/{account_id}/favorite/movies`, {
            params: {
                session_id: sessionId,
            },
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to fetch favorites');
    }
};