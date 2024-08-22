import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovieCredits } from '../slices/movieCreditsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';

const TopBilledCast = memo(() => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const {credits, status , error} = useSelector((state) => state.movieCredits);
    const nav = useNavigate();
    useEffect(() => { 
        dispatch(fetchMovieCredits(id));
    }, [dispatch , id]);
    const castMembers = credits?.cast?.slice(0,9) || [];
    const goToMember = (id, name) => {
        const hyphenatedName = name.replace(/\s+/g, '-');
        const encodedName = encodeURIComponent(hyphenatedName);
        const url = `${id}-${encodedName}`;
        nav(`/person/${url}`);
    };
  return (
    <div className=''>
        {
            status === 'succeeded' &&  
            <div className='flex flex-col gap-5 -mt-1 relative '>
                <h1 className='text-2xl font-bold'>Top Billed Cast</h1> 
                <div className='flex gap-5 overflow-x-scroll py-2 pl-1 '>
                    {castMembers.map((castMember) => castMember.profile_path ?  (
                        <div onClick={() => goToMember(castMember.id, castMember.name)} key={castMember.id} className=' cursor-pointer trans hover:scale-105 rounded-md bg-white shadow-md flex flex-col  w-[150px] h-fit '>
                            <AsyncImage
                                src={`https://image.tmdb.org/t/p/w154/${castMember.profile_path}`}
                                Transition={Blur}
                                style={{minWidth: '150px', height: '150px', borderRadius: "6px 6px 0px 0px" }}
                                loader={<div className=" animate-pulse" style={{ background: 'var(--third-color)' }} />}
                            />
                            <div className='flex flex-col justify-center gap-1 p-2 h-20 rounded-b-md '>
                                <p className='font-bold text-sm'>{castMember.name}</p>
                                <p className='text-xs'>{castMember.character}</p>
                            </div>
                        </div>
                    ) : null)}
                </div>
                {<div className="cast-shadow-right" />}
            </div>
        }
    </div>
  )
})

export default TopBilledCast