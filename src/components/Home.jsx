import React, { useEffect } from 'react'
import HeroSection from './HeroSection'
import Movies from './Movies'
import { useLocation } from 'react-router-dom'

const Home = () => {
  const loc = useLocation() ; 
  useEffect(() => { 
    window.scroll(0,0)
  }, [loc])
  return (
    <>
      <HeroSection />
      <Movies />
    </>
  )
}

export default Home