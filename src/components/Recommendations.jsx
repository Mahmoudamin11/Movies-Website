import React, { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { fetchRecommendations } from './../slices/RecommendationsSlice';
import OneRecommendation from './OneRecommendation';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import arrowRight from '../assets/arrow-right.svg'

const Recommendations = memo(() => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {recommendations, status , error} = useSelector((state) => state.recommendations);
    const [recCount, setRecCount] = useState(5)
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    useEffect(() => {
        if (inView && id) {
            dispatch(fetchRecommendations(id));
        }
    }, [dispatch, id, inView]);
    
    const handleLoadMoreRecs = () => { 
        setRecCount(prev => prev + 5);
    }
    return (
        
        <div ref={ref} className='pb-10 max-[870px]:pb-0 ' >
            {
                status === 'failed' && inView && <Error error={error.message} />
            }
            {
                status === 'loading' && inView && <LoadingSpinnerSections />
            }
            {status === 'succeeded' &&  inView &&
            <div className='flex flex-col gap-5'>
                <h1 className='font-bold text-2xl'>Recommendations</h1>
                <div className="flex gap-5 max-sm:gap-3 overflow-x-scroll h-fit overflow-y-hidden py-2 ">
                    {recommendations?.length > 0 && recommendations.slice(0, recCount).map((movie) => movie.poster_path && movie.backdrop_path ?  (
                        <OneRecommendation key={movie.id} movie={movie} />
                    ) : null)}
                    {
                        recommendations?.length == 0 &&
                        <div className='w-full border-[1px] py-10 text-xl text-third-color font-bold border-solid rounded-md flex items-center justify-center'>
                            No Recommendations
                        </div>
                        
                    }
                {recommendations?.length > 0 && recCount < recommendations.length && <button onClick={handleLoadMoreRecs} className='flex gap-1 min-w-[25%] max-sm:min-w-[50%] bg-gray-50 pl-2 rounded-md outline-none items-center trans group  cursor-pointer'>
                    <button className='trans outline-none opacity-100 group-hover:opacity-70 text-lg max-sm:text-[15px]'>Load More</button>
                    <img src={arrowRight} alt="" className='w-5 mt-1' />
                </button>}
                </div>
            </div>
            }
        </div>
    );
});

export default Recommendations;