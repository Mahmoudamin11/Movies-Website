// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../components/fetchData';

export const fetchRequestToken = createAsyncThunk(
  'auth/fetchRequestToken',
  async () => {
    const response = await api.get('/authentication/token/new');
    return response.data;
  }
);

export const createSession = createAsyncThunk(
  'auth/createSession',
  async (requestToken) => {
    const response = await api.post('/authentication/session/new', {
      request_token: requestToken,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    requestToken: null,
    sessionId: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequestToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requestToken = action.payload.request_token;
      })
      .addCase(fetchRequestToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessionId = action.payload.session_id;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
