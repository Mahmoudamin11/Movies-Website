import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../components/fetchData";


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