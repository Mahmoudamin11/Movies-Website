import React from 'react'
import { useEffect, useState } from 'react';
import { api } from './fetchData';
import Movie from './Movie';
import LoadingSpinner from './LoadingSpinner';

const DiscoveredMovies = () => {
    const [data, setdata] = useState([]);
    const [loading, setLoading] = useState([]);
    const fetchMovies = async () => {
        try {
        const response = await api.get('/discover/movie');
        return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    };
    
    useEffect(() => {
        const getMovies = async () => {
        try {
            setLoading(true);
            const data = await fetchMovies();
            setdata(data.results);
            console.log(data.results);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
        };

        getMovies();
        
    }, []);
  return (
    <>
        {
            loading && <LoadingSpinner />
        }
        
        {
            data.length > 0 && !loading&&
            data.map((mov) => (
                <Movie key={mov.id} movie={mov} />
            ))
        }
    </>
  )
}

export default DiscoveredMovies