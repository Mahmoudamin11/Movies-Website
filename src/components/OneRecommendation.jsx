import { AsyncImage } from 'loadable-image'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Blur } from 'transitions-kit'

const OneRecommendation = (movie) => {
    const nav = useNavigate();
    const goToMovie = () => { 
        nav(`/movie/${movie.movie.id}`)
    }
    return (
        
        <div onClick={goToMovie} key={movie.movie.id} className="relative group overflow-hidden min-w-[25%] trans hover:scale-105 h-fit cursor-pointer flex flex-col gap-2 rounded-md">
            <AsyncImage
                className='group'
                src={`https://image.tmdb.org/t/p/w342${movie.movie.backdrop_path}`}
                alt="Movie video"
                Transition={Blur}
                style={{ minWidth: '220px', height: '128px', borderRadius: '6px' }}
                loader={<div className='animate-pulse' style={{ background: 'var(--third-color)' }} />}
                loading="lazy"
            />
            <div className='flex p-2 absolute bg-white bottom-[-200%] group-hover:bottom-0 trans justify-between w-full'>
                <p>{movie.movie.title}</p>
                <p>{Math.floor(movie.movie.vote_average * 10 )}%</p>
            </div>
        </div>
    )
}

export default OneRecommendation