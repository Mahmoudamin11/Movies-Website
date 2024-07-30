import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../components/fetchData";

export const fetchSearchResults = createAsyncThunk( "search/fetchSearchResults" ,
    async(query) => { 
        const response = await api.get(`search/movie?query=${query}`);
        return response.data.results;
    }
);

const searchSlice = createSlice({
    name:"search",
    initialState:{
        result:[],
        status:'idle',
        error:null
    },
    reducers:{},
    extraReducers: (builder) => { 
        builder.addCase(fetchSearchResults.pending, (state) => { 
            state.status = 'loading'
        })
        builder.addCase(fetchSearchResults.fulfilled, (state, action) => { 
            state.status = 'succeeded';
            state.result = action.payload;
        })
        builder.addCase(fetchSearchResults.rejected, (state, action) => { 
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default searchSlice.reducer;