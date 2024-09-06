import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import UserInfo from './UserInfo';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MobileMenu from './MobileMenu';

const Navbar = memo(() => {
  const nav = useNavigate()
  const [moviesON, setMoviesON] = useState(false)
  const [personON, setPersonON] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const goToHome = () => { 
    nav("/")
    setPersonON(false);
    setMoviesON(false);
    if (isOpen)
      toggleIsOpen();
  }
  const popularRef = useRef(null);
  const moviesRef = useRef(null);
  const location = useLocation();
  
  const handleMouseEnterMovies = () => { 
    
    if (moviesRef.current) { 
      moviesRef.current.style.display = "block";
    }
    if (popularRef.current)
      popularRef.current.style.display = "none";
      
  }
  const handleMouseEnter = () => { 
    
    if (popularRef.current) { 
      popularRef.current.style.display = "block";
    }
    if (moviesRef.current) { 
      moviesRef.current.style.display = "none";
    }
  }
  const handleMouseLeaveMovies = () => { 
    
    if (moviesRef.current) { 
      moviesRef.current.style.display = "none";
    }
  }

  const handleMouseLeavePeople = () => { 
    
    if (popularRef.current) { 
      popularRef.current.style.display = "none";
    }
  }

  

  const goToPopularPeoplePage = () => { 
    nav(`/popularPeople`);
    setMoviesON(false);
    setPersonON(true);
  }
  const goToPopularMovies = () => { 
    nav(`/popularMovies`)
    setMoviesON(true);
    setPersonON(false);
  }
  const goToNowPlayingMovies = () => { 
    nav(`/nowPlayingMovies`)
    setMoviesON(true);
    setPersonON(false);
  }
  const goToUpcomingMovies = () => { 
    nav(`/upcoming`)
    setMoviesON(true);
    setPersonON(false);
  }
  const goToTopRatedMovies = () => { 
    nav(`/topRated`)
    setMoviesON(true);
    setPersonON(false);
  }
  const goToLogin = () => { 
    nav('/login', {state :{comingFrom : `/`}});
  }
  const user = useSelector((state) => state.user.user);

  const toggleIsOpen = () => {
    setIsOpen(prevState => {
      document.body.style.overflowY = prevState ? 'scroll' : 'hidden';
      return !prevState;
    });
  };
  useEffect(() => {
      if (document.body.style.overflowY !== 'scroll') {
        document.body.style.overflowY = 'scroll';
      }
      
      if (isOpen)
        setIsOpen(false);
      return () => {
        document.body.style.overflowY = '';
      };
  }, [location]);
  return (
    <div  className='w-full flex items-center justify-between bg-main-color trans   py-5 max-[800px]:px-10 px-20 max-sm:px-5'>
        <div  className='flex gap-24 items-center'>
          <div onClick={goToHome} className="cursor-pointer outline-none  text-background-color hover:opacity-80" >
              <span className=' font-bold text-4xl outline-none'>Movies</span> <span className='text-2xl text-third-color font-semibold outline-none'>Camp</span>
          </div>
          <ul  className='flex gap-8 text-white max-[700px]:hidden text-center  sm:h-[60px]  items-center mt-2'>
            <div onMouseLeave={handleMouseLeaveMovies} onMouseEnter={handleMouseEnterMovies}  className='relative h-[50px] text-center cursor-pointer flex items-center group outline-none'>
              <span className={`${moviesON ? "opacity-100" : "opacity-70"} font-bold trans group-hover:opacity-100`}>Movies</span>
              <div ref={moviesRef} className='hidden z-50 trans absolute text-black bg-gray-50  w-40 text-sm top-[75%] mt-2 left-0 py-2  group trans rounded-md cursor-pointer'>
                <button onClick={goToPopularMovies} className='outline-none trans w-full text-start px-5 py-2 hover:bg-gray-100'>Popular Movies</button>
                <button onClick={goToTopRatedMovies} className='outline-none trans w-full text-start px-5 py-2 hover:bg-gray-100'>Top Rated</button>
                <button onClick={goToNowPlayingMovies} className='outline-none trans w-full text-start px-5 py-2 hover:bg-gray-100'>Now Playing</button>
                <button onClick={goToUpcomingMovies} className='outline-none trans w-full text-start px-5 py-2 hover:bg-gray-100'>Upcoming</button>
              </div>
            </div>

            <div onMouseLeave={handleMouseLeavePeople} onMouseEnter={handleMouseEnter}  className='relative cursor-pointer h-[50px] flex items-center group outline-none '>
              <span className={`${personON ? "opacity-100" : "opacity-70"} font-bold trans group-hover:opacity-100 `}>People</span>
              <div role='button' ref={popularRef} onClick={goToPopularPeoplePage}  className='hidden z-50 trans absolute text-black bg-gray-50  w-40 text-sm top-[75%] mt-2 left-0 py-2  group trans rounded-md cursor-pointer'>
                <button className='outline-none trans w-full px-5 py-2 text-start hover:bg-gray-100'>Popular People</button>
              </div>
            </div>
          </ul>
        </div>
        {
          (user && user?.uid ) &&  <div >
            <div className='max-sm:hidden'>
              <UserInfo />
            </div>
          </div>
        }
        {!isOpen && <FontAwesomeIcon onClick={toggleIsOpen} icon={faBars} className={`sm:hidden cursor-pointer text-white text-2xl w-fit mt-2`} />}
        {isOpen && <FontAwesomeIcon onClick={toggleIsOpen} icon={faXmark} className={`sm:hidden cursor-pointer text-white text-2xl w-fit mt-2`} /> }
          
        {(!user && !user?.uid ) && <button onClick={goToLogin} className=' max-sm:hidden bg-white px-5 py-2 text-sec-color rounded-md font-semibold trans hover:bg-gray-100'>
          Login
        </button>}

        <MobileMenu isOpen={isOpen} toggleIsOpen={toggleIsOpen} />

    </div>
  )
})

export default Navbar;