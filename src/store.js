import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import movieDetailReducer from './slices/movieDetailSlice';
import movieCreditsSlice from './slices/movieCreditsSlice';
import MediaSlice from './slices/MediaSlice';
import RecommendationsSlice from './slices/RecommendationsSlice';
import favoriteSlice from './slices/favoriteSlice';
import authReducer from './slices/authSlice';
import sessionSlice from './slices/sessionSlice';
import userSlice from './slices/userSlice';
import RatingSlice from './slices/RatingSlice';

const store = configureStore({
    reducer: {
        search: searchReducer,
        movieDetail: movieDetailReducer,
        favorites: favoriteSlice,
        movieCredits: movieCreditsSlice,
        media: MediaSlice,
        recommendations: RecommendationsSlice,
        auth: authReducer,
        session: sessionSlice,
        user: userSlice,
        ratings:RatingSlice
    },
});

export default store;