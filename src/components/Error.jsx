import React from 'react'

const Error = (error) => {
  return (
    <div className='text-sec-color text-3xl w-full h-full flex items-center justify-center'>
        {
            error
        }
    </div>
  )
}

export default Error