import React from 'react'
import loader from "../assets/loader-third-color.svg"
const LoadingSpinnerSections = () => {
    return (
        <div className={`h-full w-full flex items-center justify-center`}>
            <img src={loader} className='w-28' alt="" />
        </div>
    )
}

export default LoadingSpinnerSections;