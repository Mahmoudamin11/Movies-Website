import React from 'react'
import { useEffect, useState } from 'react';
import { api } from './fetchData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from './LoadingSpinner';
import Error from './Error';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { useNavigate } from 'react-router-dom';

const DiscoveredMovies = () => {
    const [data, setdata] = useState([]);
    const [loading, setLoading] = useState([]);
    const [currError, setCurrError] = useState("");
    const nav = useNavigate();
    const handleOpenMovie = (id) => { 
        nav(`/movie/${id}`);
    }
    const fetchMovies = async () => {
        try {
            const response = await api.get('/discover/movie?include_adult=false');
            return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error.message);
            setCurrError(error.message)
            throw error;
        }
    };
    
    useEffect(() => {
        const getMovies = async () => {
            try {
                setLoading(true);
                const data = await fetchMovies();
                setdata(data.results);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
        
    }, []);

    const goToPopularMovies = () => { 
        nav(`/popularMovies`)
    }
    
  return (
    <>
        {
            loading && <LoadingSpinner />
        }

        { 
            currError && 
            <Error error={currError} />
        } 
        
        {
            !currError && 
            <div className='flex flex-col gap-5'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-3xl font-bold'>Popular Movies</h1>
                    <button onClick={goToPopularMovies} className='font-bold mt-2 w-fit flex items-center gap-2 trans hover:text-fourth-color otuline-none text-third-color'>
                        <span>See All</span>
                        <FontAwesomeIcon icon={faArrowRight} className='w-fit' />
                    </button>
                </div>
                <div className='w-full bg-waves bg-cover bg-top flex overflow-x-scroll overflow-y-hidden py-2 px-4 gap-10'>
                    {
                        data.length > 0 && !loading&&
                        data.slice(0, 8).map((mov) => (
                            <div onClick={() => handleOpenMovie(mov.id)} className='flex group flex-col  gap-2 cursor-pointer trans hover:scale-105'>
                                <AsyncImage
                                        src={`https://image.tmdb.org/t/p/w342${mov.poster_path}`}
                                        Transition={Blur}
                                        style={{ width: '150px', height: '250px', borderRadius: "6px" }}
                                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                />
                                <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                                    <span className='text-sec-color  font-bold text-sm'>{mov.title}</span>
                                    {/* <span className='text-xs'>{mov.release_date}</span> */}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        }
    </>
  )
}

export default DiscoveredMovies