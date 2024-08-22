import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/Formats';
import { Blur } from 'transitions-kit';
import { AsyncImage } from 'loadable-image';

const Review = () => {
    const {reviews} = useSelector((state) => state.movieCredits);
    const [review, setReview] = useState({});
    useEffect(() => { 
        let rand = Math.floor(Math.random() * reviews.length);
        if (rand >= 0 && rand < reviews.length )
            setReview(reviews[rand]);
    }, [reviews]);

    // read all content
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
    const previewContent = review && review.content && review.content.length > 300 ? review.content.substring(0, 300) + '...' : review?.content;

    return (
        <div className="p-4 mb-4 border border-gray-300 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
                <div className='flex items-center gap-2'>
                    {review.author_details && 
                        <AsyncImage
                            src={`https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`}
                            Transition={Blur}
                            style={{ width: '40px', height: '40px', borderRadius: "100%" }}
                            loader={<div style={{ background: 'var(--third-color)' }} />}
                        />
                    }
                    <h3 className="font-bold text-lg"><span className='text-sm'>A review by</span> {review.author}</h3>
                </div>
                {review.author_details && review.author_details.rating && <p className="bg-yellow-300 px-2 py-1 rounded">{review.author_details.rating * 10 }%</p>}
            </div>
            <p className="text-sm text-gray-500 mb-2">Written by <span className='text-black'>{review.author}</span> on {formatDate(review.created_at)}</p>
            <p className="text-base leading-relaxed">
                {isExpanded ? review.content : previewContent}
                {review && review.content && review.content.length > 300 && (
                    <button
                        onClick={toggleReadMore}
                        className="ml-2 trans text-third-color font-bold hover:underline"
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </p>
        </div>
    )
}

export default Review