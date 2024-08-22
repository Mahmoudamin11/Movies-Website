import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, baseURL } from "../components/fetchData";
import axios from "axios";
import TopRatedMovies from "../pages/TopRatedMovies";

// fetch the trending movies 
export const getTrendingMovies = async () => {
    const response = await api.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_API_KEY}`);
    return response.data;
};

const genreToIdMap = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'TV Movie': 10770,
    'Thriller': 53,
    'War': 10752,
    'Western': 37,
};

export const getPopularMovies = async (selectedGenresArray = [], page= 1) => {
    try {
        const genreIds = selectedGenresArray.map(genre => genreToIdMap[genre]).join(',');
        const response = await axios.get(`${baseURL}/discover/movie`, {
            params: {
                api_key: import.meta.env.VITE_API_KEY,
                with_genres: genreIds,
                sort_by: 'popularity.desc',
                page: page
            }
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to fetch popular movies');
    }
};

export const getNowPlayingMovies = async () => {
    try {
        
        const response = await axios.get(`${baseURL}/movie/now_playing`, {
            params: {
                api_key: import.meta.env.VITE_API_KEY,
                sort_by: 'release_date.desc',
            }
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to fetch now playing movies');
    }
};

export const getUpcomingMovies = async (page = 1) => {
    try {
        const response = await api('/movie/upcoming', {
            params: {
                language: 'en-US',
                page: page,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        throw error;
    }
};

export const getTopRatedMovies = async (selectedGenresArray = [], page = 1) => {
    
    try {
        const genreIds = selectedGenresArray.map(genre => genreToIdMap[genre]).join(',');
        const response = await axios.get(`${baseURL}/discover/movie`, {
            params: {
                api_key: import.meta.env.VITE_API_KEY,
                with_genres: genreIds,
                sort_by: 'vote_average.desc',
                'vote_count.gte': 500, // Min rate required
                page: page, 
            }
        });

        return response.data.results;
    } catch (error) {
        throw new Error('Failed to fetch top rated movies');
    }
};

// fetch the free to watch movies 
export const getFreeToWatchMovies = async () => {
    try {
        const response = await api.get('/discover/movie', {
            params: {
                with_watch_providers: '8', // Assuming '8' is the provider ID for free to watch movies
                watch_region: 'EG', // You can adjust the region as needed
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch free to watch movies:', error);
        throw error;
    }
};

export const fetchMovieDetails = createAsyncThunk("movieDetail/fetchMovieDetails", 
    async (movieID) => { 
        const response = await api.get(`/movie/${movieID}`);
        return response.data;
    }
);

const movieDetailSlice = createSlice({ 
    name:"movieDetail",
    initialState:{ 
        details:[],
        status: 'idle',
        error: null,
    },
    reducers:{},
    extraReducers:(builder) => { 
        builder.addCase(fetchMovieDetails.pending, 
            (state) => { 
                state.status = "loading"
            }
        )
        builder.addCase(fetchMovieDetails.fulfilled, 
            (state, action) => { 
                state.status = "succeeded";
                state.details = action.payload;
            }
        )
        builder.addCase(fetchMovieDetails.rejected, 
            (state, action) => { 
                state.status = "failed";
                state.error = action.error.message;
            }
        )
    }
});

export default movieDetailSlice.reducer;