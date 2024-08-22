import React from 'react';
import { useDispatch } from 'react-redux';
import { setRequestToken } from '../slices/sessionSlice'; // Adjust according to your slice
import { redirectToTMDB } from '../utils/authUtils'; // Import the utility function
import { api } from '../components/fetchData';


const LoginWithTMDB = () => {
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            // Use the api instance to get the request token
            const response = await api.get('/authentication/token/new');
            const data = response.data;

            const requestToken = data.request_token;

            // Save request token to Redux or some state management
            dispatch(setRequestToken(requestToken));

            // Redirect to TMDB authentication page
            redirectToTMDB(requestToken);
        } catch (error) {
            console.error('Failed to get request token:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with TMDB</button>
        </div>
    );
};

export default LoginWithTMDB;
