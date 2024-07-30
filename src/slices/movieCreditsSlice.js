import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../components/fetchData';


export const fetchMovieCredits = createAsyncThunk(
    'movieCredits/fetchMovieCredits',
    async (movieID) => {
        const response = await api.get(`/movie/${movieID}/credits`);
        return response.data;
    }
);

const movieCreditsSlice = createSlice({
    name: 'movieCredits',
    initialState: {
        credits: null,
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
            state.credits = action.payload;
        })
        .addCase(fetchMovieCredits.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
});

export default movieCreditsSlice.reducer;
