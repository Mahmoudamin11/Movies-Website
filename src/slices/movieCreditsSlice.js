import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../components/fetchData';

export const fetchMovieKeywords = async (movieID) => {
    const response = await api.get(`/movie/${movieID}/keywords`);
    return response.data;
};

export const fetchMovieReviews = async (movieID) => {
    const response = await api.get(`/movie/${movieID}/reviews`);
    return response.data.results;
};

export const fetchMovieCredits = createAsyncThunk(
    'movieCredits/fetchMovieCredits',
    async (movieID) => {
        const [credits, keywords, reviews] = await Promise.all([
            api.get(`/movie/${movieID}/credits`),
            fetchMovieKeywords(movieID),
            fetchMovieReviews(movieID),
        ]) 
        return { 
            credits:credits.data,
            keywords:keywords.keywords,
            reviews,
        }
    }
);



const movieCreditsSlice = createSlice({
    name: 'movieCredits',
    initialState: {
        credits: null,
        keywords: [],
        reviews: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMovieCredits.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchMovieCredits.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.credits = action.payload.credits;
            state.keywords = action.payload.keywords;
            state.reviews = action.payload.reviews;
        })
        .addCase(fetchMovieCredits.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
});

export default movieCreditsSlice.reducer;
