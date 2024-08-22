import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
    requestToken: null,
    sessionId: "",
    status: 'idle',
    error: null,
};

// Thunk to fetch request token (if needed in your flow)
export const fetchRequestToken = createAsyncThunk(
    'session/fetchRequestToken',
    async () => {
        try {
            const response = await fetch('/authentication/token/new');
            const data = await response.json();
            return data.request_token;
        } catch (error) {
            throw new Error('Failed to fetch request token');
        }
    }
);

// Thunk to create session ID with request token
export const createSession = createAsyncThunk(
    'session/createSession',
    async (requestToken) => {
        try {
            const response = await fetch(`/authentication/session/new?request_token=${requestToken}`);
            const data = await response.json();
            return data.session_id;
        } catch (error) {
            throw new Error('Failed to create session');
        }
    }
);

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setRequestToken: (state, action) => {
            state.requestToken = action.payload;
        },
        setSessionId: (state, action) => {
            console.log("Entered : " ,action.payload);
            
            state.sessionId = action.payload;
        },
        clearSession: (state) => {
            state.requestToken = null;
            state.sessionId = null;
        },
    },
    extraReducers: (builder) => {
        // Handle fetchRequestToken actions
        builder
            .addCase(fetchRequestToken.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequestToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requestToken = action.payload;
            })
            .addCase(fetchRequestToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

        // Handle createSession actions
        builder
            .addCase(createSession.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sessionId = action.payload;
            })
            .addCase(createSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setRequestToken, setSessionId, clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
