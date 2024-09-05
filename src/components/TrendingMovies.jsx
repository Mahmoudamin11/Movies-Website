// TrendingMovies.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { getTrendingMovies } from '../slices/movieDetailSlice';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { useNavigate } from 'react-router-dom';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import Error from './Error';
import DivError from '../utils/DivError';
import LoadingSpinner from './LoadingSpinner';

const TrendingMovies = memo(() => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);
    const mainContainerRef = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (trendingMovies.length > 0)
            setBackgroundImage(`https://image.tmdb.org/t/p/w780${trendingMovies[0]?.backdrop_path}`)


        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        
        if (isInView) {
            
            const fetchTrendingMovies = async () => {
                try {
                    setLoading(true);
                    // changeLoading(true);
                    const movies = await getTrendingMovies();
                    setTrendingMovies(movies.results);
                    if (movies.results.length > 0)
                        setBackgroundImage(`https://image.tmdb.org/t/p/w1280${movies.results[0].backdrop_path}`)
                } catch (error) {
                    console.error('Failed to fetch trending movies:', error);
                    setError(error.message);
                } finally { 
                    setLoading(false);
                    // changeLoading(false);
                }
            };

            fetchTrendingMovies();
        }
        
    }, [isInView]);

    const nav = useNavigate()
    const handleOpenMovie = (id) => { 
        nav(`/movie/${id}`);
    }

    

    const changeBackground = (movie) => { 
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
        img.onload = () => {
            setBackgroundImage(`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`);
        };
        

    }

    return (
        <>
            
            { 
            <div ref={containerRef} className="w-full py-10 flex flex-col gap-5">
                {!loading && <h1 className='text-3xl flex items-center gap-3 font-bold'>
                    Trending
                    <span className='text-sm py-1 cursor-default mt-2 bg-black flex items-center justify-center rounded-full px-3 text-fourth-color'>Today</span>
                </h1>}
                {loading && <LoadingSpinner />}
                {!error && !loading &&  <div 
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'all 0.5s ease-in-out',
                    }}
                    ref={mainContainerRef}  className="relative trans py-2 px-4 border-[1px] border-solid border-gray-200 rounded-md w-full h-fit flex overflow-x-scroll overflow-y-hidden gap-10 ">
                        
                        {
                            trendingMovies.length > 0 &&
                            trendingMovies.map((movie) => (
                                <div onMouseEnter={() => changeBackground(movie)} key={movie.id} onClick={() => handleOpenMovie(movie.id)} className='z-40 flex group flex-col gap-2 pt-4 pl-2 cursor-pointer trans hover:scale-105'>
                                    <AsyncImage
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                            Transition={Blur}
                                            style={{ width: '150px', height: '250px', borderRadius: "6px" }}
                                            loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                                        <span className='text-white font-bold text-sm'>{movie.title}</span>
                                    </div>
                                </div>
                            ))
                        }
                </div>}
            </div>
            }
            
            {
                !loading && error && <div className='mb-10'>
                    <DivError error={error} />
                </div>
            }
        </>
    );
});

export default TrendingMovies;
