import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import movieDetailReducer from './slices/movieDetailSlice';
import favoritesReducer from './slices/favoritesSlice';
import movieCreditsSlice from './slices/movieCreditsSlice';

const store = configureStore({
    reducer: {
        search: searchReducer,
        movieDetail: movieDetailReducer,
        favorites: favoritesReducer,
        movieCredits: movieCreditsSlice,
    },
});

export default store;