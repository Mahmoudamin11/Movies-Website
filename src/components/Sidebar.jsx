import React from 'react'
import { useSelector } from 'react-redux'
import { formatCurrency, formatLanguage } from '../utils/Formats';

const Sidebar = () => {
    const {details , status , error} = useSelector((state) => state.movieDetail);
    const {keywords} = useSelector((state) => state.movieCredits);

    return (
        <div className='w-full flex flex-col gap-5  max-[870px]:pb-10 '>
            <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>Status</h2>
                <p className='text-sm'>{details.status}</p>
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>Original Language</h2>
                <p className='text-sm'>{formatLanguage(details.original_language)}</p>
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>Budget</h2>
                <p className='text-sm'>{details.budget != 0 ? formatCurrency(details.budget) : "Unknown" }</p>
            </div>
        { <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>Revenue</h2>
                <p className='text-sm'>{details.revenue  != 0 ? formatCurrency(details.revenue) : "Unknown"}</p>
            </div>}

            <div className='flex flex-col gap-3'>
                <h2 className='font-bold'>Keywords</h2>
                <div className='flex flex-wrap gap-1 w-full'>
                    {
                        keywords.length > 0 ? keywords.map((word) => <p key={word.id} className='keyword'>{word.name}</p>)
                        : <p>No Keywords</p>
                    }
                </div>
            </div>
            
        </div>
    )
}

export default Sidebar