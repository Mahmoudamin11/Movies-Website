import React from 'react'
import { useSelector } from 'react-redux';
import Movie from './Movie';
import LoadingSpinner from './LoadingSpinner';

const SearchedMovies = () => {

    const {result, status , error} = useSelector((state) => state.search);
    
  return (
    <>
        {
          status === 'loading' && <LoadingSpinner />
        }
        
        { 
            result.length > 0 && status === "succeeded" &&
            result.map((mov) => (
                <Movie key={mov.id} movie={mov} />
            ))
        }
    </>
  )
}

export default SearchedMovies