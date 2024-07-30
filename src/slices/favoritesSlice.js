import { createSlice } from "@reduxjs/toolkit";


const favoriteSlice = createSlice({
    name:"favorite",
    initialState:{
        movies:[],
    },
    reducers:{
        addFavorite:(state,action) => { 
            state.movies.push(action.payload)
        },
        removeFavorite:(state,action) => { 
            state.movies = state.movies.filter(mov => mov.id !== action.payload.id)
        }
    }
});

export const {addFavorite , removeFavorite} = favoriteSlice.actions;
export default favoriteSlice.reducer;