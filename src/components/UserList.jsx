import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import { clearFavorites } from '../slices/favoriteSlice';

const UserList = ({closeList}) => {
    const nav = useNavigate();
    const goToHome = () => { 
        nav('/');
        closeList();
    }
    const goToFavorite = () => { 
        nav('/favorite');
        closeList();
    }
    const goToProfile = () => { 
        nav('/profile');
        closeList();
    }
    const goToSettings = () => { 
        nav('/settings');
        closeList();
    }
    const dispatch = useDispatch();
    const logOut = () => { 
        dispatch(logoutUser());
        dispatch(clearFavorites());
        closeList();
    }
    return (
        <div className='flex flex-col absolute top-full font-semibold left-1/2 -translate-x-1/2  mt-2 rounded-md  bg-white shadow-md text-black z-50'>
            <button onClick={goToHome} className='flex items-center gap-2 py-4 border-b-[1px] border-solid rounded-t-md  outline-none trans hover:scale-105 hover:bg-gray-100 hover:text-third-color px-12'>
                <FontAwesomeIcon icon={faHouse} className={`w-fit text-sm mt-[1px]`} />
                Home
            </button>
            <button onClick={goToFavorite} className='flex items-center gap-2 py-4 border-b-[1px] border-solid outline-none trans hover:scale-105 hover:bg-gray-100 hover:text-third-color px-12'>
                <FontAwesomeIcon icon={faHeart} className={`w-fit text-sm mt-[1px]`} />
                Favorite
            </button>
            <button onClick={goToProfile} className='flex items-center gap-2 py-4 border-b-[1px] border-solid outline-none trans hover:scale-105 hover:bg-gray-100 hover:text-third-color px-12'>
                <FontAwesomeIcon icon={faUser} className={`w-fit text-sm mt-[1px]`} />
                Profile
            </button>
            <button onClick={logOut} className='flex text-red-500 items-center gap-2 py-4 rounded-b-md  outline-none trans hover:scale-105 hover:bg-gray-100 hover:text-third-color px-12'>
                <FontAwesomeIcon icon={faArrowRightFromBracket}  className={`w-fit text-sm mt-[1px]`} />
                Logout
            </button>
        </div>
    )
}

export default UserList