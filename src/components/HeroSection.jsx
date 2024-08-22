import React from 'react';
import Input from '../components/Input'
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const user = useSelector((state) => state.user.user);
  return (
    
    <div className=' w-full flex flex-col gap-2 overflow-hidden px-20 max-sm:px-5 text-sec-color mt-20'>
      <div className='flex w-full justify-between items-center'>
        
        <span className='font-bold  -ml-2 text-6xl max-sm:text-4xl max-[700px]:ml-0 max-[700px]:text-center'>Welcome,{user?.displayName ? <span className='text-5xl max-sm:text-3xl text-third-color'> {user.displayName}</span> : ""}</span>
        <div className='max-[1150px]:hidden'>
          <Input />
        </div>
      </div>
      <span className='ml-10 text-xl  text-third-color max-[810px]:ml-0 max-[810px]:text-center'>Millions of movies, TV shows and people to discover. Explore now.</span>
      <div className='min-[1150px]:hidden max-[700px]:ml-0 ml-auto max-sm:mt-2 mt-5'>
        <Input />
      </div>

    </div>
  
  )
}

export default HeroSection;