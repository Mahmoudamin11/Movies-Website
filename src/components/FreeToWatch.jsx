import { AsyncImage } from 'loadable-image';
import React, { memo, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Blur } from 'transitions-kit';
import { getFreeToWatchMovies } from '../slices/movieDetailSlice';
import arrowRight from '../assets/arrow-right.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const FreeToWatch = memo(() => {
    const [freeMovies, setFreeMovies] = useState([]);
    const [moviesCount, setMoviesCount] = useState(7);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const loc = useLocation();
    useEffect(() => { 
        window.scroll(0,0);
    }, [loc])
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        
        if (isInView) {
            
            const fetchFreeMovies = async () => {
                try {
                    setLoading(true)
                    const movies = await getFreeToWatchMovies();
                    setFreeMovies(movies);
                    
                } catch (error) {
                    console.error('Failed to fetch free to watch movies:', error);
                    setError(error.message);
                }finally{
                    setLoading(false);
                }
            };

            fetchFreeMovies();
        }
        
    }, [isInView]);

    const nav = useNavigate()
    const handleOpenMovie = (id) => { 
        nav(`/movie/${id}`);
    }
    const goToFreeToWatch = () => { 
        nav(`/nowPlayingMovies`);
    }

    const loadMore = () => { 
        if (freeMovies.length > 0) { 
            if (freeMovies.length < moviesCount + 5)
                setMoviesCount(freeMovies.length)
            else
            setMoviesCount(prev => prev + 5);
        }
    }


    return (
        <>
            {/* {loading && <LoadingSpinnerSections />} */}
            { !error && !loading && 
                <div ref={containerRef} className="w-full py-10 flex flex-col gap-5">
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-3xl font-bold'>
                        Free to watch
                    </h1>
                    <button onClick={goToFreeToWatch} className='font-bold w-fit mt-2 flex items-center gap-2 trans hover:text-fourth-color otuline-none text-third-color'>
                        <span>See All</span>
                        <FontAwesomeIcon icon={faArrowRight} className='w-fit' />
                    </button>
                </div>
                <div className="relative trans pt-2 pb-4 px-4 outline-none    bg-waves bg-cover bg-top   rounded-md w-full h-fit flex overflow-x-scroll overflow-y-hidden gap-10 ">
                        {
                            freeMovies?.length > 0 &&
                            freeMovies.slice(0, moviesCount).map((movie) => (
                                <div key={movie.id} onClick={() => handleOpenMovie(movie.id)} className='z-40 flex group flex-col  gap-2 pt-4 px-2 cursor-pointer trans hover:scale-105'>
                                    <AsyncImage
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                            Transition={Blur}
                                            style={{ width: '150px', height: '250px', borderRadius: "6px" }}
                                            loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className=' group-hover:opacity-80 trans '>
                                        <span className=' font-bold text-sm'>{movie.title}</span>
                                    </div>
                                </div>
                            ))
                        }
                        {freeMovies.length > 0 && moviesCount < freeMovies.length && 
                            <button onClick={loadMore} className="bg-slate-50 outline-none  trans hover:scale-105 group cursor-pointer rounded-md mt-4 min-w-[150px] font-semibold flex  items-center px-2 h-[250px] ">
                                    <div  className='flex gap-1 items-center cursor-pointer'>
                                        <button className='trans outline-none opacity-100 group-hover:opacity-70 '>Load More</button>
                                        <img src={arrowRight} alt="" className='w-4 mt-1' />
                                    </div>
                            </button>
                            }
                    </div>
            </div>}
        </>
    );
})

export default FreeToWatch