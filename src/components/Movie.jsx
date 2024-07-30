import { AsyncImage } from 'loadable-image'
import { Blur } from 'transitions-kit'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Movie = ({movie}) => {
    if (!movie.poster_path)
        return null;
    const nav = useNavigate()
    const handleOpenMovie = () => { 
        nav(`/movie/${movie.id}`);
    }
    return (
        <div onClick={handleOpenMovie} className='flex group flex-col gap-2 cursor-pointer trans hover:scale-105'>
            <AsyncImage
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    Transition={Blur}
                    style={{ maxWidth: '500px', height: '500px', borderRadius: "6px" }}
                    loader={<div style={{ background: 'var(--third-color)' }} />}
            />
            <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                <span className='text-sec-color  font-bold text-lg'>{movie.title}</span>
                <span>{movie.release_date}</span>
            </div>
        </div>
    )
}

export default Movie