import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { formatAge, formatDate } from '../utils/Formats';
import { getPersonCredits } from '../slices/personCredits';
import arrowRight from '../assets/arrow-right.svg'

const PersonPage = () => {
    const {id} = useParams();
    const [person, setPerson] = useState(null);
    const [knownFor, setKnownFor] = useState([]);
    const [shownMovies, setshownMovies] = useState(5);
    const nav = useNavigate();
    const goToMovie = (id) => { 
        nav(`/movie/${id}`)
    }
    const loc = useLocation();
    useEffect(() => { 
        window.scroll(0,0);
    }, [loc])
    useEffect(() => {
        const pId = id?.split('-')[0];
        const fetchPerson = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/person/${pId}?api_key=${import.meta.env.VITE_API_KEY}`);
            setPerson(response.data);
            console.log(response.data);
            
        };
        const fetchKnownFor = async () => {
            try {
                const credits = await getPersonCredits(pId);
                const movies = credits.cast.filter(credit => credit.media_type === 'movie' && credit.poster_path);
                // Sort movies by popularity or any other criteria if needed
                const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);
                console.log(sortedMovies);
                setKnownFor(sortedMovies);
            } catch (error) {
                console.error('Failed to fetch known for movies:', error);
            }
        };

        
        fetchPerson();
        fetchKnownFor();
    }, [id]);
    
    if (!person) return <LoadingSpinner />;

    

    const loadMoreMovies = () => { 
        setshownMovies((prev) => prev  + 5);
    }

    return (
        <div className="px-20 py-10 grid grid-cols-[300px_1fr] gap-10 overflow-x-hidden">
            {/* SideBar */}
            <div className='flex flex-col gap-5'>
                <AsyncImage
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    Transition={Blur}
                    style={{ width: '300px', height: '450px', borderRadius: "6px" }}
                    loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                />
                <div className='flex flex-col gap-3'>
                    <h1 className='font-bold text-xl'>Personal Info</h1>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Known for</span>
                            <span className='text-sm'>{person.known_for_department}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Known credits</span>
                            <span className='text-sm'>{knownFor.length}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Gender</span>
                            <span className='text-sm'>{person.gender == 1 ? "Female" : "Male"}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Birthday</span>
                            <span className='text-sm'>{formatAge(person.birthday)}</span>
                        </div>
                        {person.deathday && <div className='flex flex-col'>
                            <span className='font-semibold'>Deathday</span>
                            <span className='text-sm'>{formatDate(person.deathday)}</span>
                        </div>}
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Place of birth</span>
                            <span className='text-sm'>{person.place_of_birth}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Also known as</span>
                            <div className='flex flex-col gap-1'>
                                {
                                    person?.also_known_as?.map((name) => (
                                        <span className='text-sm'>{name}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <div id='content' className='w-full flex flex-col gap-8 text-left'>
                <h1 className='text-3xl font-bold'>{person.name}</h1>
                <div className=' flex flex-col gap-1'>
                    <h2 className='font-semibold text-lg '>Biography</h2>
                    <p>{person.biography ? person.biography : `Nice and hardworking ${person.gender ? 'actress' : 'actor'} that has a lot of credits and achivements.`}</p>
                </div>
                <div className='flex flex-col gap-1 w-full h-fit flex-grow'>
                    <h2 className='font-semibold text-lg '>Known for</h2>
                    <div id='scroll' className='w-[1000px] h-fit overflow-x-scroll overflow-y-hidden flex gap-2 py-2'>
                        {
                            knownFor.length > 0 && knownFor.slice(0, shownMovies).map((movie) => (
                                <div onClick={() => goToMovie(movie.id)} key={movie.id} className='cursor-pointer group trans hover:scale-105 relative w-[150px] h-full flex flex-col gap-1'>
                                    <AsyncImage
                                        // className='group'
                                        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                        Transition={Blur}
                                        style={{ width: '150px', height: '220px', borderRadius: "6px" }}
                                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <p className='p-2 trans rounded-b-[6px] absolute bg-white w-full bottom-[-200%]  group-hover:bottom-0 text-xs'>{movie.title}</p>
                                </div>
                            ))
                        }
                        {knownFor.length > 0 && shownMovies < knownFor.length && 
                        <div className="bg-slate-50 rounded-md min-w-[150px] font-semibold flex  items-center px-2  h-[220px]">
                                <div onClick={loadMoreMovies} className='flex gap-1 items-center cursor-pointer'>
                                    <button className='trans outline-none opacity-100 hover:opacity-80 '>Load More</button>
                                    <img src={arrowRight} alt="" className='w-4 mt-1' />
                                </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonPage