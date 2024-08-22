import React from 'react'

const DivError = ({error}) => {
    return (
        <div className='w-full rounded-md flex items-center justify-center py-10 border-[1px] border-solid text-3xl font-bold text-third-color'>
            {error}
        </div>
    )
}

export default DivError