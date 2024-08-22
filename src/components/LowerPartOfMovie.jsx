import React, { memo } from 'react'
import TopBilledCast from './TopBilledCast'
import Sidebar from './Sidebar'
import Social from './Social'
import Media from './Media'
import Recommendations from './Recommendations'

const LowerPartOfMovie = memo(() => {
  return (
    <div className='px-20'>
        <div className='w-full grid grid-cols-[70%_1fr] gap-10 '>
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