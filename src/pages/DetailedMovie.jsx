import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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

const DetailedMovie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { details, status, error } = useSelector((state) => state.movieDetail);
  const { credits, status: creditsStatus, error: creditsError } = useSelector((state) => state.movieCredits);
  const genres = formatGenres(details.genres);
  const runtime = formatRuntime(details.runtime);
  const releaseDate = formatDate(details.release_date);

  // favorite or not
  const [fav, setFav] = useState(false)

  const fetchDetails = useCallback(() => {
    if (!details || details.id !== parseInt(id)) {
      dispatch(fetchMovieDetails(id));
    }
  }, [dispatch, id, details]);
  

  useEffect(() => {
    fetchDetails();
    dispatch(fetchMovieCredits(id));
    console.log(details);
  }, [fetchDetails]);

  const directors = credits?.crew?.filter(member => member.job === 'Director') || [];
  const writers = credits?.crew?.filter(member => ['Screenplay', 'Writer'].includes(member.job)) || [];

  
  const markAsFavorite = () => { 
    setFav(!fav);
  }

  return (
    <div className="mb-10">
      {status === 'loading' && <LoadingSpinner />}
      {status === 'failed' && <Error error={error} />}
      {status === 'succeeded' && details && (
        <div className="relative w-full" style={{ height: '600px' }}>
          <LazyLoadBackgroundImage
          className='px-20 flex items-center justify-center'
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            style={{
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left  top',
            }}
          >

            <div className='w-full mr-auto   z-50 relative my-auto grid grid-cols-[300px_1fr] gap-20'>
              <AsyncImage
                    src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                    Transition={Blur}
                    style={{maxWidth: '300px', height: '500px', borderRadius: "6px" }}
                    loader={<div style={{ background: 'var(--third-color)' }} />}
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
                    <button onClick={markAsFavorite} className='group hover:scale-105 cursor-pointer w-10 h-10 trans rounded-full flex items-center justify-center bg-main-color'>
                      <FontAwesomeIcon icon={faHeart} className={`trans text-${fav ? 'red-500' : "white"}`} />
                    </button>
                    <button className='flex trans group hover:scale-105 gap-2 items-center justify-center'>
                      <FontAwesomeIcon icon={faPlay} className='w-fit' />
                      <p className='group-hover:opacity-85 trans font-bold'>Play Trailer</p>
                    </button>
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
              backgroundColor: 'var(--sec-color)',
              opacity:'0.9'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DetailedMovie;
