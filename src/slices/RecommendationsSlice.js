import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../components/fetchData';


export const fetchRecommendations = createAsyncThunk( "recommendations/fetchRecommendations" ,
    async(movieID) => { 
        const response = await api.get(`/movie/${movieID}/recommendations`);
        return response.data.results;
    }
);

const recSlice = createSlice({
    name: 'recommendations',
    initialState: {
        recommendations: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRecommendations.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(fetchRecommendations.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.recommendations = action.payload;
        })
        .addCase(fetchRecommendations.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
});

export default recSlice.reducer;