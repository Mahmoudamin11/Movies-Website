import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import Review from './Review';

const Social = memo(() => {
    const {reviews, status , error} = useSelector((state) => state.movieCredits);
    const {id} = useParams();
    const [review, setReview] = useState({});
    useEffect(() => { 
        let rand = Math.floor(Math.random() * reviews.length);
        if (rand >= 0 && rand < reviews.length )
            setReview(reviews[rand]);
    }, [reviews]);

    // read all content
    
    const nav = useNavigate();
    const seeAllReviews = () => { 
        nav(`/movie/${id}/reviews`,{ state: { reviews } });
    }
    if (reviews.length == 0 )
        return null;
    return (
        <div className=''>
            {status === 'error' && <Error error={error} />}
            {status === 'succeeded' && 
                <div className='flex flex-col gap-5'>
                    <h1 className='text-2xl font-bold'>Social</h1> 
                    <Review />
                    <button onClick={seeAllReviews} className='text-left w-fit text-sec-color opacity-90 hover:underline font-bold hover:text-third-color hover:opacity-100 '>
                        Read All Reviews
                    </button>
                </div>
            }
        </div>
    )
})

export default Social