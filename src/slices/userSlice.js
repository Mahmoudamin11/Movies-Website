import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, setPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { loadFavorites } from './favoriteSlice';

// Thunks

export const signupUser = createAsyncThunk('user/signupUser', async ({ name, email, password, photoURL=null }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with the name and photoURL
    await updateProfile(user, { displayName: name, photoURL });

    // Return only serializable data
    return { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL };
});

export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }) => {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL };
});

export const updatePhotoURL = createAsyncThunk('user/updatePhotoURL', async (photoURL, { getState }) => {
    const user = getState().user.user;
    if (user) {
        await updateProfile(auth.currentUser, { photoURL });
        return photoURL;
    } else {
        throw new Error('No user is logged in');
    }
});

export const updateUserPhotoURL = async (imageLink) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            await updateProfile(user, {
                photoURL: imageLink,
            });
            console.log("User photoURL updated successfully!");
        } else {
            console.log("No user is logged in.");
        }
    } catch (error) {
        console.error("Error updating photoURL:", error);
    }
};


export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    await signOut(auth);
    return null;
});

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload; // Only serializable data here
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Signup user
        .addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // Login user
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // Logout user
        .addCase(logoutUser.fulfilled, (state) => {
            console.log("LOGOUT");
            
            state.user = null;
        });
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Check Authentication Status
export const checkAuthStatus = () => (dispatch) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser({ uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }));

            // Load favorites when the user is authenticated
            dispatch(loadFavorites(user.uid));
        } else {
            dispatch(clearUser());
        }
    });
};
