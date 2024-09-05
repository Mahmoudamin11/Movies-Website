import React, { memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Review from './Review';
import AddReview from '../utils/AddReview';
import {deleteReviewForMovie, fetchReviewForMovie} from '../utils/review';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import { formatDate } from '../utils/Formats';

const Social = memo(() => {
    const {reviews, status , error} = useSelector((state) => state.movieCredits);
    const {user} = useSelector((state) => state.user);
    
    const {id} = useParams();
    const [showAddReview, setShowAddReview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [prevReview, setPrevReview] = useState('');
    const [reviewDate, setReviewDate] = useState(null);
    const nav = useNavigate();
    const userReview = useRef(null);
    const seeAllReviews = () => { 
        nav(`/movie/${id}/reviews`,{ state: { reviews, prevReview} });
    }
    
    const toggleAddReview = () => { 
        setShowAddReview(!showAddReview)
    }

    const editReview = () => { 
        toggleAddReview();
    }

    
    const loc = useLocation();
    useEffect(() => {
        const getReview = async () => {
            try {
                const userReview = await fetchReviewForMovie(user?.uid, id);
                setPrevReview(userReview?.review);
                setReviewDate(formatDate(userReview?.timestamp));
            } catch (err) {
                setReviewError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getReview();
        if (status == 'succeeded' && loc.state&&  loc.state.comingFrom === 'profileReview') {
            if (userReview.current)
                userReview.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [user?.uid, id, prevReview, reviews]);

    const handleDeleteReview = async () => {
        try {
            setLoading(true);
            await deleteReviewForMovie(user?.uid, id);
            setPrevReview('')
        } catch (err) {
            console.error("Error deleting review:", err);
        } finally { 
            setLoading(false);
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);

    return (
        <div className=''>
            {status === 'error' && <Error error={error} />}
            
            { 
                <div className='flex flex-col gap-5'>
                    <h1 className='text-2xl font-bold'>Social</h1> 
                    {
                        loading && <LoadingSpinnerSections />
                    }
                    {status === 'succeeded' && reviews?.length > 0 && !prevReview && !loading &&  !showAddReview  && 
                    <Review />}
                    {
                        !loading && reviews?.length== 0 && !prevReview &&  <div className='w-full p-4 mb-4 border border-gray-300 rounded-md bg-gray-50'>
                            No Reviews to show
                        </div>
                    }
                
                    
                    {!loading && !showAddReview && <button onClick={toggleAddReview} className={`w-fit text-third-color ${loading ? "animate-pulse pointer-events-none" : prevReview ? "hidden" : ""} font-bold hover:text-fourth-color  py-1 trans hover:underline`}>Add Review</button>}
                    {showAddReview && !loading &&  <AddReview id={id} close={toggleAddReview} prevReview={prevReview} />}
                    {
                        !loading && prevReview && !showAddReview && 
                        <div className='flex flex-col w-full gap-2 '>
                            <div className='flex w-full justify-between items-center'>
                                <h1 className='text-xl font-semibold'>Your review</h1>
                                <div className='flex gap-5 items-center'>
                                    <button onClick={editReview} className='bg-third-color trans  hover:bg-fourth-color rounded-sm outline-none py-1 px-3 text-white'>
                                        <FontAwesomeIcon icon={faPen} className=' w-fit text-xs' />
                                    </button>
                                    <button onClick={handleDeleteReview} className='bg-red-500 trans  hover:bg-red-400 rounded-sm outline-none py-1 px-3 text-white'>
                                        <FontAwesomeIcon icon={faTrash} className=' w-fit text-xs' />
                                    </button>
                                </div>
                            </div>
                            <div ref={userReview} className='w-full relative p-5 bg-gray-50 border-[1px] border-solid border-gray-300 rounded-md '>
                                {!reviewError && <div className='w-full flex justify-between items-center'>
                                    <div className='flex gap-2 items-center'>
                                        {user && user.photoURL &&
                                            <AsyncImage
                                                src={`${user.photoURL}`}
                                                Transition={Blur}
                                                style={{ width: '40px', height: '40px', borderRadius: "100%" }}
                                                loader={<div style={{ background: 'var(--third-color)' }} />}
                                            />
                                        }
                                        {user && !user.photoURL &&
                                            <div className='flex items-center justify-center w-10 h-10  trans rounded-full bg-sec-color'>
                                                <FontAwesomeIcon icon={faUser} className='text-[15px] text-white' />
                                            </div>
                                        }
                                        <div className='flex flex-col'>
                                            <p className='font-bold text-lg'>{user?.displayName}</p>
                                            <p className='text-xs font-semibold text-sec-color'>{reviewDate}</p>
                                            
                                        </div>
                                    </div>
                                </div>}
                                {!reviewError && <p className='mt-3 h-full ml-3  pr-5'>
                                    <span className='flex-wrap break-words'>{isExpanded  ? prevReview :  (prevReview.slice(0, 300) + (prevReview?.length > 300 ? '...' : ""))}</span>
                                    {prevReview?.length > 300 && <button
                                        onClick={toggleReadMore}
                                        className="ml-[2px] trans text-third-color font-bold hover:underline h-fit"
                                    >
                                        {isExpanded ? 'Read Less' : 'Read More'}
                                    </button>}
                                </p>}
                                {
                                    reviewError && <p className='mt-3 ml-3'>{reviewError}</p>
                                }
                            </div>
                        </div>
                    }

                    {!loading && reviews?.length > 1  &&<button onClick={seeAllReviews} className='text-left -mb-3 w-fit text-sec-color opacity-90 hover:underline font-bold hover:text-third-color hover:opacity-100 '>
                        Read others' Reviews
                    </button>}
                </div>
            }
        </div>
    )
})

export default Social