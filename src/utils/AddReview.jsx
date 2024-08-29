import React, { useEffect, useRef, useState } from 'react';
import { saveReviewToFirebase } from './review';
import { useSelector } from 'react-redux';

const AddReview = ({id, close, prevReview}) => {
    const {details} = useSelector((state) => state.movieDetail)
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);

    const {user} = useSelector((state) => state.user);
    const textRef = useRef(null);
    useEffect(() => { 
        if (prevReview) { 
            setReview(prevReview);
            textRef.current.value = prevReview;
        }
    }, [prevReview])
    const handleInputChange = (e) => {
        setReview(e.target.value);
    };
    const handleSubmit = async () => {
        if (review.trim()) {
            try {
                setLoading(true);
                await saveReviewToFirebase(user.uid, details, review);
                console.log('Review Submitted:', review);
                setReview(''); 
                close();
                window.location.reload();
            } catch (error) {
                console.error('Error submitting review:', error);
            } finally { 
                setLoading(false);
            }
        } else {
            console.error('Review is empty');
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <textarea
                ref={textRef}
                autoFocus
                maxLength={1000}
                className={`border-[1px] ${loading ? "animate-pulse" : ""} outline-none p-2 min-h-[200px] max-h-[300px] border-solid border-gray-300 bg-gray-50`}
                name="reviewInput"
                id="reviewEnter"
                value={review}
                onChange={handleInputChange}
            ></textarea>
            <button
                onClick={handleSubmit}
                className={`px-5 ${loading ? "animate-pulse" : ""} py-2 rounded-md bg-sec-color trans hover:bg-third-color text-white w-fit ml-auto`}
            >
                {!loading ? "Send" : "Loading"}
            </button>
        </div>
    );
};

export default AddReview;
