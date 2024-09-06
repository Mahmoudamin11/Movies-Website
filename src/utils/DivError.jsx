import React from 'react'

const DivError = ({error}) => {
    const tryAgain = () => { 
        window.location.reload();
    }
    return (
        <div className='w-full rounded-md flex flex-col gap-3 items-center justify-center py-10 border-[1px] border-solid text-3xl font-bold text-third-color'>
            {error}
            {error == 'Network Error' && <button onClick={tryAgain} className='  font-bold  text-[16px] underline  text-sec-color trans hover:text-third-color outline-none'>Try Again</button>}
        </div>
    )
}

export default DivError