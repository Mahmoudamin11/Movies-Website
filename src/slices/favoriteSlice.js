import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Thunks

export const addFavorite = createAsyncThunk('favorites/addFavorite', async ( {uid, details} ) => {
    const favoriteRef = doc(db, 'users', uid, 'favorites', details.id.toString());
    await setDoc(favoriteRef, details );  // Consider using arrayUnion if adding to an array
    return details;
});

export const removeFavorite = createAsyncThunk('favorites/removeFavorite', async (movie, { getState }) => {
    const user = getState().user.user;
    if (user) {
        const movieId = String(movie.id); // Ensure movieId is a string
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', movieId);
        await deleteDoc(favoriteRef);
        return movie; // Return the movie to update the state
    }
    throw new Error('User not logged in');
});

export const loadFavorites = createAsyncThunk('favorites/loadFavorites', async (uid) => {
    
    try {
        // Reference to the user's favorites collection
        const favoritesRef = collection(db, 'users', uid, 'favorites');

        // Create a query to get all documents in the favorites collection
        const q = query(favoritesRef);
        const querySnapshot = await getDocs(q);

        // Extract the data from the documents
        const favorites = [];
        querySnapshot.forEach((doc) => {
            favorites.push(doc.data());
        });
        
        return favorites;
    } catch (error) {
        console.error("Error loading favorites:", error);
        throw error;
    }
});

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearFavorites: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(addFavorite.pending, (state) => {
            state.loading = true;
        })
        .addCase(addFavorite.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.loading = false;
        })
        .addCase(addFavorite.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(loadFavorites.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadFavorites.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        })
        .addCase(loadFavorites.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(removeFavorite.pending, (state) => {
            console.log('Remove favorite pending');
            state.loading = true;
        })
        .addCase(removeFavorite.fulfilled, (state, action) => {
            console.log('Remove favorite fulfilled', action.payload);
            state.items = state.items.filter(item => item.id !== action.payload.id);
            state.loading = false;
        })
        .addCase(removeFavorite.rejected, (state, action) => {
            console.log('Remove favorite rejected', action.error);
            state.loading = false;
            state.error = action.error.message;
        });
    }
});
export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
