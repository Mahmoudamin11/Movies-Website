import React from 'react'
import { Outlet } from 'react-router-dom'

const MovieLayout = () => {
  return (
    <div className='h-fit'>
        <Outlet />
    </div>
  )
}

export default MovieLayout