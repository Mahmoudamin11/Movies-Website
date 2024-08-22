import { useDispatch, useSelector } from 'react-redux';
import { loadFavorites, removeFavorite } from '../slices/favoriteSlice';
import { useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Movie from '../components/Movie';
import Error from '../components/Error';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { useLocation, useNavigate } from 'react-router-dom';

const  Favorite = () => {
    const favorites = useSelector((state) => state.favorites.items);
    const loading = useSelector((state) => state.favorites.loading);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => { 
        window.scroll(0,0)
    },[loc])

    useEffect(() => {
        if (user && user.uid) {
            dispatch(loadFavorites(user.uid));
        }
    }, [user, dispatch]);
    const handleOpenMovie = (id) => { 
        nav(`/movie/${id}`);
    }

    return (
        <div className='flex flex-col min-h-[100vh] w-full px-20 py-20 gap-8'>
            <h1 className='text-3xl font-bold'>Favorite Movies</h1>
            {!loading && 
                (favorites.length > 0 ? (
                    <div className='w-full grid grid-cols-4 gap-20'>
                    {    favorites.map((movie) => (
                                <div key={movie.id} className='w-[300px] relative'>
                                        <div onClick={() => handleOpenMovie(movie.id)} className='flex group flex-col gap-2 cursor-pointer trans hover:scale-105'>
                                            <AsyncImage
                                                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                                    Transition={Blur}
                                                    style={{ maxWidth: '300px', height: '500px', borderRadius: "6px" }}
                                                    loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                            />
                                            <div className='flex group-hover:opacity-80 trans flex-col pl-1 text-third-color'>
                                                <span className='text-sec-color  font-bold text-lg'>{movie.title}</span>
                                                <span>{movie.release_date}</span>
                                            </div>
                                        </div>
                                    <button onClick={() => dispatch(removeFavorite(movie))} className=' outline-none trans hover:scale-105 bg-main-color rounded-full w-10 h-10 flex items-center justify-center  cursor-pointer trans hover:opacity-90 absolute top-5 left-[80%]'>
                                        <FontAwesomeIcon icon={faHeart} className={`trans text-red-500`} />
                                    </button>
                                </div>
                        ))}
                    </div>
                ) : favorites.length == 0 ? (
                    <Error error={'No favorites yet...'} />
                ) : null)
            }
            {
                loading && <LoadingSpinner />
            }
        </div>
    );
}

export default Favorite;
