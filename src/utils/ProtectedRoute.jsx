import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Profile from '../pages/Profile';

const ProfileProtectedRoute = ({children}) => {
    const user = useSelector((state) => state.user.user);
    console.log(user);
    
    if (!user)
        return <Navigate to={'/'} />

    return (
        <Profile />
    )
}

export default ProfileProtectedRoute