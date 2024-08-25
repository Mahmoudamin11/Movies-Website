import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
const RateMovie = ({deleteRate, color, prevRate, handleClose, submitRating}) => {
    const [rating, setRating] = useState(null);
    const [showSubmit, setShowSubmit] = useState(false);
    
    
    useEffect(() => { 
        setRating(prevRate)
    }, [prevRate])
    const handleRating = (rate) => {
        setRating(rate);
        setShowSubmit(true);
    };
    
    const handleSubmitRating = () => { 
        submitRating(rating);
        handleClose();
    }

    return (
        <div className="flex gap-2 mx-auto items-center px-1 rounded-md bg-white">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => handleRating(star)}
                    className={` h-fit ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    style={{ cursor: 'pointer', fontSize: '28px'}}
                >
                    ★
                </span>
            ))}
            {
                prevRate > 0 && 
                <FontAwesomeIcon onClick={deleteRate} icon={faSquareXmark} className='w-fit mt-1 cursor-pointer text-red-500 trans hover:opacity-80 text-3xl ml-3' />
            }
            {
                showSubmit  && rating != 0 &&  <FontAwesomeIcon onClick={handleSubmitRating} icon={faSquareCheck} className='w-fit mt-1 cursor-pointer text-green-500 trans hover:opacity-80 text-3xl ml-3' />
            }

        </div>
    );
}

export default RateMovie