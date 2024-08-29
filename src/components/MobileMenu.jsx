import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from '../slices/userSlice';
import { clearFavorites } from '../slices/favoriteSlice';
const MobileMenu = ({isOpen, toggleIsOpen}) => {
    const [showMovies, setShowMovies] = useState(false)
    const [showPeople, setShowPeople] = useState(false)
    const user = useSelector((state) => state.user.user);
    const nav = useNavigate();
    const dispatch = useDispatch();

    const goToHome = () => { 
        nav('/');
        toggleIsOpen();
    }
    const goToFavorites = () => { 
        nav('/favorite');
        toggleIsOpen();
    }
    const goToLogin = () => { 
        nav('/login', {state :{comingFrom : `/`}});
        toggleIsOpen();
    }
    const logOut = () => { 
        dispatch(logoutUser());
        dispatch(clearFavorites());
        toggleIsOpen();
    }
    const openMovies = () => { 
        setShowMovies(!showMovies)
    }
    const openPeople = () => { 
        setShowPeople(!showPeople)
    }
    const goToPopularPeoplePage = () => { 
        nav(`/popularPeople`);
        toggleIsOpen();
    }
    const goToPopularMovies = () => { 
        nav(`/popularMovies`)
        toggleIsOpen();
    }
    const goToNowPlayingMovies = () => { 
        nav(`/nowPlayingMovies`)
        toggleIsOpen();
    }
    const goToUpcomingMovies = () => { 
        nav(`/upcoming`)
        toggleIsOpen();
    }
    const goToTopRatedMovies = () => { 
        nav(`/topRated`)
        toggleIsOpen();
    }
    const goToProfile = () => { 
        nav(`/profile`)
        toggleIsOpen();
    }
    return (
        <div className={`trans sm:hidden px-8 py-12 ${isOpen ? "translate-x-0" : "translate-x-[120%]"} fixed w-full h-full top-[75px] right-0 bg-sec-color z-50 flex flex-col gap-8 `}>
            {
                (user && user?.uid) && (
                    !user.photoURL ? 
                    <div className='flex gap-2 items-center w-fit mx-auto'>
                        <div onClick={goToProfile} className='flex trans hover:opacity-scale-105 items-center justify-center mx-auto  w-14 h-14  trans rounded-full bg-white'>
                            <FontAwesomeIcon icon={faUser} className='text-[20px] text-sec-color' />
                        </div>
                        <p className='text-lg w-fit text-white font-bold'>{user.displayName}</p>
                    </div>
                : <div className='flex gap-2 items-center w-fit mx-auto'>
                    <div onClick={goToProfile} className='flex trans hover:opacity-scale-105 items-center justify-center mx-auto  w-14 h-14  trans rounded-full bg-white'>
                            <AsyncImage
                                src={user?.photoURL}
                                Transition={Blur}
                                style={{ width: '100%', height: '100%', borderRadius: "100%", objectFit: 'cover' }}
                                loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                            />
                        </div>
                        <p className='text-lg font-bold w-fit text-white'>{user.displayName}</p>
                </div>
                )
                
            }
            <div className='flex flex-col gap-10 text-start text-white'>
                <button onClick={goToHome} className='font-semibold w-fit text-xl'>Home</button>
                <button onClick={goToFavorites} className='font-semibold w-fit text-xl'>Favorites</button>
                <div className=' flex flex-col gap-2'>
                    <button onClick={openMovies} className='font-semibold w-fit text-xl'>Movies</button>
                    {showMovies && <div className='flex flex-col gap-1'>
                        <button onClick={goToPopularMovies} className='outline-none trans w-full text-start px-5 py-2 '>Popular Movies</button>
                        <button onClick={goToTopRatedMovies} className='outline-none trans w-full text-start px-5 py-2 '>Top Rated</button>
                        <button onClick={goToNowPlayingMovies} className='outline-none trans w-full text-start px-5 py-2 '>Now Playing</button>
                        <button onClick={goToUpcomingMovies} className='outline-none trans w-full text-start px-5 py-2 '>Upcoming</button>
                    </div>}
                </div>

                <div className='flex flex-col gap-2'>
                    <button onClick={openPeople} className='font-semibold w-fit text-xl'>People</button>
                    {showPeople && <button onClick={goToPopularPeoplePage} className='outline-none trans w-full px-5 py-2 text-start '>Popular People</button>}
                </div>
                {user && user?.uid && <button onClick={logOut} className='px-3 py-1 text-red-500 trans  bg-white rounded-md font-semibold'>Logout</button>}
            </div>
        </div>
    )
}

export default MobileMenu