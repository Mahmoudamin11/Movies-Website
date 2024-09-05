import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const RateMovie = ({deleteRate,prevRate, handleClose, submitRating}) => {
    const [rating, setRating] = useState(0);
    useEffect(() => { 
        setRating(prevRate)
    }, [prevRate])
    
    const handleSubmitRating = () => { 
        submitRating(rating);
        handleClose();
    }

    const handleRatingChange = (e) => {
        const newRating = e.target.value;
        setRating(newRating);
        console.log(newRating);
    };

    const changeRating = (val) => { 
        setRating(val)
    }

    return (
        <>
            <div className="bg-white text-right rounded-lg shadow-lg max-sm:py-8 max-sm:px-6 py-12 px-10 fixed flex flex-col gap-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[60] ">
                <FontAwesomeIcon onClick={
                        () => {
                            document.body.style.overflowY = 'scroll';
                            handleClose();
                        }
                    } icon={faCircleXmark} className=" text-gray-500 absolute -top-[50px] max-sm:left-[90%] left-[110%] text-3xl w-fit text-center  trans  hover:text-red-600 cursor-pointer  font-bold"/>
                
                <div className='flex w-full justify-between items-center'>
                    <label for="price-range" className="block text-gray-700 font-bold">Your Rate?</label>
                    <span className='text-lg font-bold text-black'>{rating}%</span>
                </div>
                <div className=" space-y-[2px]">
                    <input type="range" id="price-range" step={10} className="w-full outline-none cursor-pointer accent-third-color" min="10" max="100" value={rating} onChange={handleRatingChange} />
                    <div className="flex justify-between text-gray-500">
                        {
                            [...Array(10).keys()].map((val) => (
                                <button onClick={() => changeRating((val+ 1) *10 )} className=' outline-none trans hover:text-black'>{(val + 1) * 10}</button>
                            ))
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <button onClick={handleSubmitRating} className='px-5 py-[6px] rounded-md bg-sec-color text-white font-bold trans hover:bg-third-color  '>Submit</button>
                    <button onClick={deleteRate} className='px-5 rounded-md  text-red-500  trans  '>Delete Rate</button>
                </div>
            </div>
            <div onClick={handleClose} className='fixed w-full top-0 left-0 h-[100vh] bg-black opacity-70 z-50' />
        </>
    );
}

export default RateMovie