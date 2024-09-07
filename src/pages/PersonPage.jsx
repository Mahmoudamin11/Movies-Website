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
    const [showKnownAs, setShowKnownAs] = useState(3);
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
            
        };
        const fetchKnownFor = async () => {
            try {
                const credits = await getPersonCredits(pId);
                const movies = credits.cast.filter(credit => credit.media_type === 'movie' && credit.poster_path);
                const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);
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

    const showAllNames = () => { 
        setShowKnownAs(prev => prev + person?.also_known_as?.length - prev)
    }
    

    return (
        <div className="px-20 max-md:px-10 max-sm:px-5 max-sm:py-5 py-10 grid w-full grid-cols-[300px_1fr] max-[940px]:flex flex-col  gap-10 overflow-x-hidden">
            {/* SideBar */}
            <div className='flex flex-col   gap-5'>
                <div className='max-sm:hidden'>
                    <AsyncImage
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        Transition={Blur}
                        
                        style={{ width: '300px', height: '450px', borderRadius: "6px" }}
                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                    />
                </div>
                <div className='sm:hidden'>
                    <AsyncImage
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        Transition={Blur}
                        
                        style={{ width: '200px', height: '250px', borderRadius: "6px" }}
                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                    />
                </div>
                <h1 className='text-3xl font-bold sm:hidden'>{person.name}</h1>
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
                        {person?.place_of_birth &&<div className='flex flex-col'>
                            <span className='font-semibold'>Place of birth</span>
                            <span className='text-sm'>{person.place_of_birth}</span>
                        </div>}
                        <div className='flex flex-col max-[940px]:hidden'>
                            <span className='font-semibold'>Also known as</span>
                            <div className='flex flex-col gap-1'>
                                {
                                    person?.also_known_as?.slice(0, showKnownAs).map((name) => (
                                        <span className='text-sm'>{name}</span>
                                    ))
                                }
                                {showKnownAs === 3 && <button onClick={showAllNames} className='  w-fit outline-none text-sm mt-1 rounded-md text-third-color hover:underline hover:text-fourth-color  trans'>See All Names</button>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <div id='content' className=' flex flex-col gap-8 text-left'>
                <h1 className='text-3xl font-bold max-sm:-mb-5 max-sm:hidden'>{person.name}</h1>
                <div className=' flex flex-col gap-1'>
                    <h2 className='font-semibold text-lg '>Biography</h2>
                    <p className=''>{person.biography ? person.biography : `Nice and hardworking ${person.gender ? 'actress' : 'actor'} that has a lot of credits and achivements.`}</p>
                </div>
                <div className='flex flex-col gap-1 w-full h-fit flex-grow'>
                    <h2 className='font-semibold text-lg '>Known for</h2>
                    <div id='scroll' className='w-[1000px] max-[1300px]:w-[650px] max-[1100px]:w-[500px] max-sm:w-full h-fit overflow-x-scroll overflow-y-hidden flex gap-2 py-2'>
                        {
                            knownFor.length > 0 && knownFor.slice(0, shownMovies).map((movie) => movie.vote_average*10 > 20 && !person.adult &&  (
                                <div onClick={() => goToMovie(movie.id)} key={movie.id} className='cursor-pointer group trans hover:scale-105 relative w-[150px] h-full flex flex-col gap-1'>
                                    <AsyncImage
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
                {person?.also_known_as.length > 0 && <div className='flex flex-col min-[940px]:hidden'>
                    <span className='font-semibold text-xl'>Also known as</span>
                    <div className='flex flex-col gap-1 pl-1'>
                        {
                            person?.also_known_as?.slice(0, showKnownAs).map((name) => (
                                <span className='text-sm'>{name}</span>
                            ))
                        }
                        {showKnownAs === 3 && person?.also_known_as.length > 3 &&  <button onClick={showAllNames} className='  w-fit outline-none text-sm mt-1 rounded-md text-third-color hover:underline hover:text-fourth-color  trans'>See All Names</button>}
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default PersonPage;