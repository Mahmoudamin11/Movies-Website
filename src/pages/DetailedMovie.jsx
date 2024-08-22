import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../slices/movieDetailSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import Error from '../components/Error';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import LazyLoadBackgroundImage from '../components/LazyLoadBackgroundImage ';
import { formatDate, formatGenres, formatRuntime } from '../utils/Formats';
import CircularProgressBar from '../utils/CircularProgressBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { fetchMovieCredits } from '../slices/movieCreditsSlice';
import LowerPartOfMovie from '../components/LowerPartOfMovie';
import { addFavorite, removeFavorite } from '../slices/favoriteSlice';
import { Palette } from 'color-thief-react';
import TrailerPlayer from '../components/TrailerPlayer';

const DetailedMovie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);
  
  const { details, status, error } = useSelector((state) => state.movieDetail);
  const { credits, status: creditsStatus, error: creditsError } = useSelector((state) => state.movieCredits);
  const genres = formatGenres(details.genres);
  const runtime = formatRuntime(details.runtime);
  const releaseDate = formatDate(details.release_date);
  const [backgroundColor, setBackgroundColor] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)
  // favorite or not
  const navigate = useNavigate();
  const isFavorite = useSelector((state) => state.favorites.items?.some((fav) => Number(fav.id) === Number(id)));
  
  const handleFavorite = () => {
    if (user) {
      if (isFavorite) {
        dispatch(removeFavorite(details));
      } else {
        dispatch(addFavorite({ uid: user.uid, details }));
      }
    } else {
      navigate('/login', {state :{comingFrom : `/movie/${id}`}});
    }
  };
    

  const fetchDetails = useCallback(() => {
    if (!details || details.id !== parseInt(id)) {
      dispatch(fetchMovieDetails(id));
    }
  }, [dispatch, id, details]);
  

  useEffect(() => {
    fetchDetails();
    dispatch(fetchMovieCredits(id));
  }, [fetchDetails, id, dispatch]);

  const directors = credits?.crew?.filter(member => member.job === 'Director') || [];
  const writers = credits?.crew?.filter(member => ['Screenplay', 'Writer'].includes(member.job)) || [];
  const playTrailer = () => { 
    setShowTrailer(true);
  }
  const closeTrailer = () => { 
    setShowTrailer(false);
  }
  
  const location = useLocation();
  useEffect(() => { 
    window.scroll(0,0)
  }, [location])
  const { images, videos} = useSelector((state) => state.media);
  const [shownWord, setShownWord] = useState('Play Trailer')
  const toggleShownWord = () =>  { 
    setShownWord("No Video To Show")
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {status === 'loading' && <LoadingSpinner />}
      {status === 'failed' && <Error error={error} />}
      {status === 'succeeded' && details && (
        <div className='flex flex-col gap-10'>
          <div className="relative w-full " style={{ height: '600px' }}>
            <LazyLoadBackgroundImage
            className='px-20 flex items-center justify-center'
              src={`https://image.tmdb.org/t/p/w780/${details.backdrop_path}`}
              style={{
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            >

              <Palette src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} crossOrigin="anonymous" format="hex" colorCount={4}>
                {({ data }) => {
                  if (data)
                    setBackgroundColor(data);
                }}
              </Palette>
              <div className='w-full mr-auto   z-40 relative my-auto grid grid-cols-[300px_1fr] gap-20'>
                <AsyncImage
                      src={`https://image.tmdb.org/t/p/w342/${details.poster_path}`}
                      Transition={Blur}
                      style={{maxWidth: '300px', height: '500px', borderRadius: "6px",boxShadow: "rgba(99, 99, 99, 0.1) 0px 2px 8px 0px" }}
                      loader={<div className=' animate-pulse' style={{ background: backgroundColor[1],  }} />}
                />
                <div className='flex flex-grow-[1] flex-col text-left gap-3 text-white items-start justify-center'>
                  <h1 className=' text-4xl font-bold'>
                    {details.title} <span className=' font-normal text-4xl opacity-60'>({details.release_date.slice(0,4)})</span>
                  </h1>
                  <div className='flex gap-2 items-center  h-fit'>
                    
                    <p>{releaseDate}</p>
                    <span className='w-[5px] h-[5px] mt-1 rounded-full bg-white'></span>
                    <p>{genres}</p>
                    <span className='w-[5px] h-[5px] mt-1 rounded-full bg-white'></span>
                    <p>{runtime}</p>
                  </div>
                  <div className='flex items-center justify-center -ml-2 '>
                    <CircularProgressBar percentage={Math.round(details.vote_average * 10)} />
                    <p className='flex flex-col gap-[1px] font-bold -ml-4 mt-1'>
                      <span>User</span>
                      <span>Score</span>
                    </p>
                    <div className='flex gap-5 pl-2 ml-5'>
                      <button onClick={handleFavorite} className={`  trans group hover:scale-105 outline-none cursor-pointer w-10 h-10 trans rounded-full flex items-center justify-center bg-main-color`}>
                        <FontAwesomeIcon icon={faHeart} className={`trans ${isFavorite ? 'text-red-500' : "text-white"}`} />
                      </button>
                      {<button onClick={playTrailer} className='outline-none flex trans group hover:scale-105 gap-2 items-center justify-center'>
                        <FontAwesomeIcon icon={faPlay} className='w-fit' />
                        <p className='group-hover:opacity-85 trans font-bold'>{shownWord}</p>
                      </button>}
                    </div>
                  </div>
                  
                  <p className='pl-1 italic font-bold opacity-80'>{details.tagline}</p>
                  <div className='flex flex-col gap-2 pl-1'>
                    <h2 className=' font-bold text-2xl w-fit h-fit'>Overview</h2>
                    <span className='text-sm pl-1'>{details.overview}</span>
                  </div>
                  <div className={`${creditsStatus !== 'failed' ? 'grid grid-cols-3 w-full gap-x-16 gap-y-5 place-items-start pl-1 place-content-center' : '' }`} >
                    {
                      creditsStatus !== 'failed'&&
                      directors.map((d) => <div key={d.id} className='flex flex-col gap-1'>
                        <span className='font-bold'>{d.name}</span>
                        <span>Director</span>
                      </div> )
                    }
                    {creditsStatus !== 'failed'&& writers.map((d) => <div key={d.id} className='flex flex-col gap-1'>
                      <span className='font-bold'>{d.name}</span>
                      <span>Writer</span>
                    </div> )}
                  </div>
                </div>
              </div>
            </LazyLoadBackgroundImage>
            
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: backgroundColor[0],
                opacity:'0.85'
              }}
            />
            
            { showTrailer && <TrailerPlayer movieId={details.id} onCloseTrailer={closeTrailer} videoError={toggleShownWord} /> }
          </div>
            <LowerPartOfMovie />
        </div>
      )}
    </div>
  );
};

export default DetailedMovie;
