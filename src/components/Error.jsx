import React from 'react'

const Error = (error) => {
  return (
    <div className='text-third-color font-bold text-4xl w-full min-h-screen flex items-center justify-center'>
        <div className='my-auto w-fit'>
          {
            error.error
          }
        </div>
    </div>
  )
}

export default Error