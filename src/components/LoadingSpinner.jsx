import React from 'react'
import loader from "../assets/loader-third-color.svg"
const LoadingSpinner = () => {
    return (
        <div className={`min-h-screen my-auto w-[95%] flex items-center justify-center`}>
            <img src={loader} className='w-28' alt="" />
        </div>
    )
}

export default LoadingSpinner