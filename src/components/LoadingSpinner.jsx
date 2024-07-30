import React from 'react'
import loader from "../assets/loader-third-color.svg"
const LoadingSpinner = () => {
    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
            <img src={loader} className='w-28' alt="" />
        </div>
    )
}

export default LoadingSpinner