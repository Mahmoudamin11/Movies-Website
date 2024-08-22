import React, { useEffect, useMemo, useState } from 'react';
import { getNowPlayingMovies } from '../slices/movieDetailSlice';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Error from '../components/Error';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const NowPlayingMovies = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [showGenres, setShowGenres] = useState(false);
    
    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
        fetchNowPlayingMovies();
    }, [loc]);

    const fetchNowPlayingMovies = async () => {
        try {
            setLoading(true);
            const movies = await getNowPlayingMovies();
            setNowPlayingMovies(movies);
            setError("");
        } catch (error) {
            console.error('Failed to fetch now playing movies:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const goToMovie = (id) => {
        nav(`/movie/${id}`);
    };
    

    return (
        <div className="p-20 max-md:p-10 max-sm:p-5 min-h-screen w-full">
            { 
                loading && <LoadingSpinner />
            }
            { 
                error && <Error error={error} />
            }
            {
                !loading && !error && 
                <div className='flex flex-col gap-8'>
                    <h1 className="text-3xl font-bold">Now Playing Movies</h1>
                    <div className='grid place-items-center grid-cols-1 min-[670px]:grid-cols-2 min-[1050px]:grid-cols-3 min-[1300px]:grid-cols-4 gap-10'>
                        {nowPlayingMovies.length > 0 && nowPlayingMovies.map((movie) => movie.poster_path && movie.backdrop_path  ? (
                            <div key={movie.id} onClick={() => goToMovie(movie.id)} className='max-sm:mx-auto max-[540px]:w-[325px] max-sm:w-[250px] max-sm:text-center flex flex-col items-center'>
                                <div className='flex group flex-col gap-2 cursor-pointer trans hover:scale-105'>
                                    <AsyncImage
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        Transition={Blur}
                                        style={{ width: '300px', height: '500px', borderRadius: "6px" }}
                                        loader={<div className='animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                                        <span className='text-sec-color font-bold text-sm'>{movie.title}</span>
                                        <span>{movie.release_date}</span>
                                    </div>
                                </div>
                            </div>
                        ) : null)}
                    </div>
                    
                </div>
            }
        </div>
    );
}

export default NowPlayingMovies;
