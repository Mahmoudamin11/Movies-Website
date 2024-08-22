import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import ScrollTopBtn from '../utils/ScrollTopBtn'

const RootLayout = () => {
  return (
    <div id='RootLayout' className="h-full flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content (Outlet) */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
      <ScrollTopBtn />
    </div>
  
  )
}

export default RootLayout