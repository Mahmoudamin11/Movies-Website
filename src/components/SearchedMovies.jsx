import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Movie from './Movie';
import LoadingSpinner from './LoadingSpinner';
import Error from './Error';
import HeroSection from './HeroSection';
import { useNavigate } from 'react-router-dom';

const SearchedMovies = () => {
    const nav = useNavigate();
    const {result, status , error} = useSelector((state) => state.search);
    useEffect(() => { 
      if (result.length == 0 && status == 'idle')
        nav('/')
    }, [])
  return (
    <div className='w-full overflow-x-hidden pb-20 flex flex-col gap-20'>
        <HeroSection />
        {
          status === 'loading' && <LoadingSpinner />
        }

        {
          status === 'failed' && <Error error={error} />
        }

        {result.length === 0 && status === 'succeeded' && <Error error={'No matching movies'} />}
        
        { 
            result.length > 0 && status === "succeeded" &&
            <div className='grid  grid-cols-1 min-[540px]:grid-cols-2 min-[1000px]:grid-cols-3 xl:grid-cols-4 gap-10 px-20 max-md:px-10 max-sm:px-5'>
              {result.map((mov) => mov.poster_path && mov.backdrop_path && !mov.adult && mov.vote_average * 10 > 63 ?  (
                  <div className='max-sm:mx-auto max-[540px]:w-[325px]  max-sm:w-[250px] '>
                    <Movie key={mov.id} movie={mov} />
                  </div>
              ) : null)}
            </div>
        }
    </div>
  )
}

export default SearchedMovies