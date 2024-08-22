import { setSessionId } from '../slices/sessionSlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { api } from '../components/fetchData';
import { useEffect } from 'react';

const Authenticate = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const requestToken = query.get('request_token');

    useEffect(() => {
        if (requestToken) {
            const authenticate = async () => {
                try {
                    console.log('Request token:', requestToken); // Log request token

                    const response = await api.post('/authentication/session/new', null, {
                        params: {
                            request_token: requestToken,
                        }
                    });

                    console.log('API Response:', response); // Log full response

                    if (response.data.success) {
                        const sessionId = response.data.session_id;
                        console.log('Session ID retrieved:', sessionId);

                        if (sessionId) {
                            console.log('Dispatching session ID:', sessionId);
                            dispatch(setSessionId(sessionId));
                            //window.location.href = '/'; // Redirect after successful authentication
                        } else {
                            console.error('Session ID is null or undefined');
                        }
                    } else {
                        console.error('Failed to create session:', response.data);
                    }
                } catch (error) {
                    console.error('Failed to create session:', error.response?.data || error.message);
                    console.log('Error object:', error); // Log error details
                }
            };


            authenticate();
        } else {
            console.error('Request token or approval status missing');
        }
    }, [dispatch, requestToken]);

    return <div>Authenticating...</div>;
};

export default Authenticate;
