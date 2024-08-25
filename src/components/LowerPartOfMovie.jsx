import React, { memo } from 'react'
import TopBilledCast from './TopBilledCast'
import Sidebar from './Sidebar'
import Social from './Social'
import Media from './Media'
import Recommendations from './Recommendations'

const LowerPartOfMovie = memo(() => {
  return (
    <div className='px-20 max-[870px]:px-10 max-sm:px-5'>
        <div className='w-full min-[870px]:grid min-[870px]:grid-cols-[70%_1fr] max-[870px]:flex flex-col gap-10 '>
          <div className='flex flex-col gap-10'>
            <TopBilledCast  />
            <Social />
            <Media  />
            <Recommendations />
          </div>
          <Sidebar  />
          
        </div>
    </div>
  )
})

export default LowerPartOfMovie