import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Thunks

export const addOrUpdateRating = createAsyncThunk('ratings/addOrUpdateRating', async ({ userId, movie, rating }) => {
    try {
        console.log(movie);
        
        const ratingRef = doc(db, 'ratings', `${userId}_${movie.id}`);
        await setDoc(ratingRef, {
            userId,
            movie,
            rating,
            timestamp: new Date().toISOString()
        }, { merge: true });
        return { userId, movieId: movie.id, rating, movie };
    } catch (error) {
        console.error('Failed to add or update rating:', error);
        throw error;
    }
});

export const fetchRating = createAsyncThunk('ratings/fetchRating', async ({ userId, movieId }) => {
    try {
        const docRef = doc(db, 'ratings', `${userId}_${movieId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return { movieId, rating: data.rating, movie: data.movie };
        } else {
            console.log("No such rating found!");
            return { movieId, rating: null, movie: null };
        }
    } catch (error) {
        console.error('Failed to fetch rating from Firebase:', error);
        throw error;
    }
});

export const fetchAllRatings = createAsyncThunk('ratings/fetchAllRatings', async (userId) => {
    try {
        const ratingsRef = collection(db, 'ratings');
        const q = query(ratingsRef);
        const querySnapshot = await getDocs(q);

        const ratings = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
                ratings.push({ movieId: data.movie?.id, rating: data.rating, movie: data.movie });
            }
        });

        return ratings;
    } catch (error) {
        console.error('Failed to fetch all ratings from Firebase:', error);
        throw error;
    }
});

export const deleteRating = createAsyncThunk('ratings/deleteRating', async ({ userId, movieId }) => {
    try {
        const ratingRef = doc(db, 'ratings', `${userId}_${movieId}`);
        await deleteDoc(ratingRef);
        return { userId, movieId };
    } catch (error) {
        console.error('Failed to delete rating:', error);
        throw error;
    }
});

// Slice
const ratingsSlice = createSlice({
    name: 'ratings',
    initialState: {
        ratings: {}, 
        allRatings:[],
        loading: false,
        error: null,
    },
    reducers: {
        clearRatings: (state) => {
            state.ratings = {};
            state.allRatings = [] ;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add or update rating
            .addCase(addOrUpdateRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(addOrUpdateRating.fulfilled, (state, action) => {
                const { movieId, rating, movie } = action.payload;
                state.ratings[movieId] = { rating, movie };
                state.loading = false;
            })
            .addCase(addOrUpdateRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete rating
            .addCase(deleteRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRating.fulfilled, (state, action) => {
                const { movieId } = action.payload;
                delete state.ratings[movieId];
                state.loading = false;
            })
            .addCase(deleteRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch rating
            .addCase(fetchRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRating.fulfilled, (state, action) => {
                const { movieId, rating, movie } = action.payload;
                state.ratings[movieId] = { rating, movie };
                state.loading = false;
            })
            .addCase(fetchRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch all ratings
            .addCase(fetchAllRatings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllRatings.fulfilled, (state, action) => {
                console.log("PAYLOAD", action.payload);
                
                state.allRatings = [];
                action.payload.forEach(({ movieId, rating, movie }) => {
                    state.allRatings.push({ rating, movie });
                });
                
                state.loading = false;
            })
            .addCase(fetchAllRatings.rejected, (state, action) => {
                console.log("PAYLOAD ERROR", action.payload);
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearRatings } = ratingsSlice.actions;
export default ratingsSlice.reducer;
