import Input from "./Input"
import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate()
  const goToHome = () => { 
    nav("/")
  }
  return (
    <div className='w-full flex items-center justify-between bg-main-color   py-5 px-10'>
        <button onClick={goToHome} className="cursor-pointer text-3xl text-background-color" >
            Movies Camp
        </button>
        <Input />
        <Link to="/" className="text-background-color">
            Heart
        </Link>
    </div>
  )
}

export default Navbar;