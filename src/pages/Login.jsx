import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const location = useLocation();
    const comingFrom = location.state?.comingFrom;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { user, loading , error } = useSelector((state) => state.user);
    const nav = useNavigate();
    const goToSignUp = () => { 
        nav('/signup')
    }
    const handleLogin = () => {
        dispatch(loginUser({ email, password }))
            .unwrap() // Unwrap the promise to handle the resolved or rejected value
            .then((user) => {
                nav(comingFrom);
            })
            .catch((error) => {
                console.error('Error during login:', error.message);
            }
        );
    };

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword);
    }

    return (
        <>
        {loading  && <LoadingSpinner/>}
        { 
        !loading && 
            <div className='min-h-screen flex flex-col gap-12 items-start mx-auto justify-center w-[350px] h-full '>
                <h1 className='text-6xl font-bold text-sec-color mt-[1px]'>Login</h1>
                <input className='p-2 w-full border-[1px] border-solid border-sec-color trans focus:border-third-color rounded-md outline-none' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <div className='relative w-full'>
                    <input className='p-2 w-full border-[1px] border-solid border-sec-color trans focus:border-third-color rounded-md outline-none' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    {password && !showPassword && <FontAwesomeIcon onClick={toggleShowPassword} icon={faEye} className=' absolute top-1/2 -right-5 -translate-y-1/2 cursor-pointer outline-none hover:opacity-80 trans' />}
                    {password && showPassword && <FontAwesomeIcon onClick={toggleShowPassword} icon={faEyeSlash} className=' absolute top-1/2 -right-5 -translate-y-1/2 cursor-pointer outline-none hover:opacity-80 trans' />}
                </div>
                <div className='flex flex-col gap-8 items-start w-full'>
                    <button onClick={handleLogin} className='outline-none bg-sec-color text-white rounded-md w-full trans hover:bg-third-color py-2'>Login</button>
                    <button onClick={goToSignUp} className='outline-none text-center mx-auto text-sec-color trans underline hover:no-underline hover:text-third-color rounded-md w-fit'>Don't have an account?</button>
                </div>
                {!user && <p className={ `min-h-6 text-red-500 text-lg font-semibold mx-auto ${error ? " visible" : " invisible"} `}>{error?.slice(10, error.length)}</p>}
            </div>
        }
        </>
    );
};

export default Login;
