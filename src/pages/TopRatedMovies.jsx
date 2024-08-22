import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../slices/movieDetailSlice';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from './../components/LoadingSpinner';
import Error from '../components/Error';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const TopRatedMovies = () => {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showGenres, setShowGenres] = useState(false);
    const nav = useNavigate();
    const genres = [
        'Action','Adventure','Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 
        'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
    ];
    const [selectedGenres, setSelectedGenres] = useState({
        'Action': false,
        'Adventure': false,
        'Animation': false,
        'Comedy': false,
        'Crime': false,
        'Documentary': false,
        'Drama': false,
        'Family': false,
        'Fantasy': false,
        'History': false,
        'Horror': false,
        'Music': false,
        'Mystery': false,
        'Romance': false,
        "Science Fiction": false,
        'TV Movie': false,
        'Thriller': false,
        'War': false,
        'Western': false,
    });

    const loc = useLocation();

    useEffect(() => { 
        window.scroll(0,0);
        // Fetch initial movies only on component mount
        fetchTopRatedMovies(1, false);
    }, [loc]);

    const fetchTopRatedMovies = async (page = 1, append = true) => {
        const selectedGenresArray = Object.keys(selectedGenres).filter((genre) => selectedGenres[genre]);

        try {
            setLoading(true);
            const movies = await getTopRatedMovies(selectedGenresArray, page);
            if (append) {
                setTopRatedMovies((prevMovies) => [...prevMovies, ...movies]);
            } else {
                setTopRatedMovies(movies);
            }
            setError("");
        } catch (error) {
            console.error('Failed to fetch top rated movies:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreMovies = () => {
        setCurrentPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchTopRatedMovies(nextPage);
            return nextPage;
        });
    };

    const goToMovie = (id) => {
        nav(`/movie/${id}`);
    };

    const toggleGenre = (genre) => {
        setSelectedGenres((prevSelectedGenres) => ({
            ...prevSelectedGenres,
            [genre]: !prevSelectedGenres[genre],
        }));
    };

    const toggleShowGenres = () => setShowGenres(!showGenres);

    const searchMovies = () => {
        setTopRatedMovies([]); // Clear the current movies
        setCurrentPage(1); // Reset to the first page
        fetchTopRatedMovies(1, false); // Fetch movies with the updated genres
    };

    return (
        <div className="p-20 max-md:p-10 max-sm:p-5  min-h-screen w-full">
            {
                loading && <LoadingSpinner />
            }
            { 
                error && <Error error={error} />
            }
            { !loading &&
            <div className='flex flex-col gap-8'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className="text-3xl font-bold ">Top Rated Movies</h1>
                    <button onClick={toggleShowGenres} className='flex items-center gap-2  text-semibold trans py-1 px-3 rounded-md  hover:bg-third-color bg-sec-color'>
                        <span className='text-lg  text-white font-semibold'>Filter</span>
                        <FontAwesomeIcon icon={faFilter} className='w-fit text-xs mt-[2px] text-white' />
                    </button>
                </div>
                {showGenres && <div  className={`w-full border-[1px] border-solid p-3 rounded-md `}>
                    {/* Genres */}
                    <div className='w-[80%] max-sm:w-full flex flex-wrap gap-2'>
                        {
                            genres.map((genre) => (
                                <button key={genre} onClick={() => toggleGenre(genre)} className={`px-2 py-1 text-sm outline-none trans  ${selectedGenres[genre] ? "bg-third-color text-white hover:bg-fourth-color" : "bg-white text-black hover:bg-gray-100"} rounded-full border-[1px] border-solid`}>
                                    {genre}
                                </button>
                            ))
                        }
                    </div>
                    <div className='w-full text-right max-sm:mt-3'>
                        <button onClick={searchMovies} className='bg-sec-color px-3 py-1 font-semibold text-white trans hover:bg-third-color rounded-md'>Search</button>
                    </div>
                </div>}
                {!error && !loading && <div className='grid place-items-center grid-cols-1 min-[670px]:grid-cols-2 min-[1050px]:grid-cols-3 min-[1300px]:grid-cols-4 gap-10 '>
                    {topRatedMovies.length > 0 && topRatedMovies.map((movie) => (
                        <div key={movie.id} onClick={() => goToMovie(movie.id)} className='max-sm:mx-auto max-[540px]:w-[325px]  max-sm:w-[250px] max-sm:text-center flex flex-col items-center'>
                            <div   className='flex group flex-col gap-2 cursor-pointer trans hover:scale-105'>
                                <AsyncImage
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        Transition={Blur}
                                        style={{ width: '300px', height: '500px', borderRadius: "6px" }}
                                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                />
                                <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                                    <span className='text-sec-color  font-bold text-sm'>{movie.title}</span>
                                    <span>{movie.release_date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}
                {topRatedMovies.length > 0 &&<div className='w-full text-center mt-8'>
                    <button onClick={loadMoreMovies} className='bg-sec-color px-5 py-2 font-semibold text-white trans hover:bg-third-color rounded-md'>
                        Load More
                    </button>
                </div>}
            </div>}
        </div>
    );
}

export default TopRatedMovies;
