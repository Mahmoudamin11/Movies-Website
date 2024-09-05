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
import RateMovie from '../components/RateMovie';
import loader from "../assets/loader-third-color.svg"
import { addOrUpdateRating, deleteRating, fetchRating } from '../slices/RatingSlice';

const DetailedMovie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);
  const {ratings} = useSelector((state) => state.ratings);
  const { details, status, error } = useSelector((state) => state.movieDetail);
  const { credits, status: creditsStatus, error: creditsError } = useSelector((state) => state.movieCredits);
  const genres = formatGenres(details.genres);
  const runtime = formatRuntime(details.runtime);
  const releaseDate = formatDate(details.release_date);
  const [backgroundColor, setBackgroundColor] = useState([])
  const [showTrailer, setShowTrailer] = useState(false);
  const [showRate, setShowRate] = useState(false)
  // favorite or not
  const navigate = useNavigate();
  const isFavorite = useSelector((state) => state.favorites.items?.some((fav) => Number(fav.id) === Number(id)));
  const [currentRate, setCurrentRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
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
  const [shownWord, setShownWord] = useState('Play Trailer')
  const toggleShownWord = () =>  { 
    setShownWord("No Video To Show")
  }
  
  const handleShowRate = () => { 
    if (!user || !user.uid){ 
      navigate('/login', {state :{comingFrom : `/movie/${id}`}});
      return ;
    }
    if (showRate)
      document.body.style.overflowY = 'scroll'
    if (!showRate)
      document.body.style.overflowY = 'hidden'
    setShowRate(prev => !prev);
  }

  const submitRating = async (rating) => {
      try {
          dispatch(addOrUpdateRating({ userId: user.uid, movie: details, rating}));
          setCurrentRate(rating);
      } catch (error) {
          console.error('Error submitting rating:', error);
      }
  };

  useEffect(() => {
    const fetchRatings = async () => {
        try {
            const fetchedRating = await dispatch(fetchRating({ userId: user?.uid, movieId: id })).unwrap();
            setCurrentRate(fetchedRating.rating);
        } catch (error) {
            setFetchError(error.message);
            console.error('Error fetching rating:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchRatings();
}, [user?.uid, id]);

  const handleDeleteRating = async () => {
      try {
          dispatch(deleteRating({ userId: user?.uid, movieId: id }));
          setShowRate(false);
          document.body.style.overflowY = 'scroll';
          setCurrentRate(null); 
      } catch (error) {
          setError('Failed to delete rating');
          console.error('Error deleting rating:', error);
      }
  };
  
  

  return (
    <div className="min-h-screen overflow-x-hidden">
      {status === 'loading' && <LoadingSpinner />}
      {status === 'failed' && <Error error={error} />}
      {status === 'succeeded' && details && (
        <div className='flex flex-col gap-10'>
          <Palette src={details?.poster_path ? `https://image.tmdb.org/t/p/w500/${details.poster_path}` : `https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} crossOrigin="anonymous" format="hex" colorCount={4}>
            {({ data }) => {
              if (data)
                setBackgroundColor(data);
            }}
          </Palette>
          <div className="relative w-full max-[870px]:hidden " style={{ height: '600px' }}>
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
                  <div className='flex items-center justify-center -ml-2'>
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
                  <div className='flex gap-5 ml-5 flex-wrap'>
                    <button onClick={handleShowRate} className='relative outline-none bg-main-color -ml-4 py-3 mx-auto trans hover:bg-sec-color rounded-full text-white text-sm font-semibold min-w-[156px]'>
                      {currentRate && !loading ? <span className='text-green-400'>{currentRate}%</span> : !currentRate && !loading ? 'Rate the movie?' : loading ? <img src={loader} className='w-5 mx-auto' alt="" /> : null}
                    </button>
                    {showRate && <RateMovie deleteRate={handleDeleteRating} color={backgroundColor[2]} prevRate={currentRate ? currentRate : 0} handleClose={handleShowRate} submitRating={submitRating} /> }
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

          <div className='relative w-full  min-[870px]:hidden'>
              <LazyLoadBackgroundImage
                className=' relative max-sm:px-5 px-10 flex items-center justify-start sm:min-h-[400px] max-sm:min-h-[300px] '
                  src={`https://image.tmdb.org/t/p/w780/${details.backdrop_path}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <AsyncImage
                        src={`https://image.tmdb.org/t/p/w342/${details.poster_path}`}
                        Transition={Blur}
                        style={{width: '120px', height: '200px', borderRadius: "6px",boxShadow: "rgba(99, 99, 99, 0.1) 0px 2px 8px 0px", zIndex: 40 }}
                        loader={<div className=' animate-pulse' style={{ background: backgroundColor[1],  }} />}
                  />

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
                
              </LazyLoadBackgroundImage>

              {/* update it  */}
              <div className='w-full h-fit relative mt-5 flex flex-col items-center justify-center'>
                  
                  <div className='flex flex-col text-left gap-3 px-10 max-sm:px-5 items-start justify-center'>
                    <h1 className=' text-2xl w-full text-center font-bold'>
                      {details.title} <span className=' font-normal text-2xl opacity-60'>({details.release_date.slice(0,4)})</span>
                    </h1>
                      <p className='w-full text-center sm:hidden'>{genres}</p>
                    <div className='flex gap-2 items-center justify-center w-full h-fit'>
                      <p>{releaseDate}</p>
                      <span className='w-[5px] h-[5px] mt-1 rounded-full bg-black'></span>
                      <p className='max-sm:hidden'>{genres}</p>
                      <span className='w-[5px] h-[5px] mt-1 rounded-full max-sm:hidden bg-black'></span>
                      <p>{runtime}</p>
                    </div>
                    <button onClick={handleShowRate} className=' outline-none bg-main-color py-3 mx-auto trans hover:bg-sec-color rounded-full text-white font-semibold min-w-[156px]'>
                      {currentRate && !loading ? <span className='text-green-400'>{currentRate}%</span> : !currentRate && !loading ? 'Rate the movie?' : loading ? <img src={loader} className='w-5 mx-auto' alt="" /> : null}
                    </button>
                    {showRate && <RateMovie deleteRate={handleDeleteRating} color={backgroundColor[2]} prevRate={currentRate ? currentRate : 0} handleClose={handleShowRate} submitRating={submitRating} /> }
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
                        directors.map((d) => <div key={d.id} className='flex max-sm:text-sm flex-col gap-1'>
                          <span className='font-bold'>{d.name}</span>
                          <span>Director</span>
                        </div> )
                      }
                      {creditsStatus !== 'failed'&& writers.map((d) => <div key={d.id} className='flex max-sm:text-sm flex-col gap-1'>
                        <span className='font-bold'>{d.name}</span>
                        <span>Writer</span>
                      </div> )}
                    </div>
                  </div>
                </div>
              
              { showTrailer && <TrailerPlayer movieId={details.id} onCloseTrailer={closeTrailer} videoError={toggleShownWord} /> }
          </div>
            
            
            <LowerPartOfMovie />
            
        </div>
      )}
    </div>
  );
};

export default DetailedMovie;
