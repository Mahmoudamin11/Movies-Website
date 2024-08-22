import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, baseURL } from '../components/fetchData';
import axios from 'axios';


export const fetchMovieMedia = createAsyncThunk(
    'media/fetchMovieMedia',
    async (movieID) => {
        const [images, videos] = await Promise.all([
            api.get(`/movie/${movieID}/images`),
            api.get(`/movie/${movieID}/videos`),
        ]);
        return { 
            images: images.data,
            videos: videos.data,
        };
    }
);

export const getPopularPeople = async (page = 1) => {
    try {
        const response = await axios.get(`${baseURL}/person/popular`, {
            params: {
                api_key: import.meta.env.VITE_API_KEY,
                page: page, 
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch popular people:', error);
        throw error;
    }
};



const movieMediaSlice = createSlice({
    name: 'media',
    initialState: {
        images: [],
        videos: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMovieMedia.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchMovieMedia.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.images = action.payload.images;
            state.videos = action.payload.videos;
        })
        .addCase(fetchMovieMedia.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
});

export default movieMediaSlice.reducer;
