// src/components/Approved.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSession } from '../slices/authSlice';
import { useLocation } from 'react-router-dom';

const Approved = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request_token');

    if (requestToken) {
      dispatch(createSession(requestToken));
    }
  }, [dispatch, location]);

  return <div>Approval successful. Creating session...</div>;
};

export default Approved;
