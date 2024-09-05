import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from '../components/LoadingSpinner';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading ,error } = useSelector((state) => state.user);
    const nav = useNavigate();
    const inputRef = useRef(null)
    const loc = useLocation();
    useEffect(() => { 
        window.scroll(0,0);
    }, [loc])
    const goToLogin = () => { 
        nav('/login')
    }
    
    const handleSignUp = () => {
        dispatch(signupUser({ name, email, password}))
            .unwrap() // make the promise either fullfuilled or rejected
            .then((user) => {
                nav('/')
            })
            .catch((error) => {
                console.error('Error during signup:', error.message);
            }
        );
    };

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword);
        if (inputRef.current)
            inputRef.current.focus();
    }
    return (
        <>
        {loading  && <LoadingSpinner/>}
            {
                !loading && 
                <div className='min-h-screen flex flex-col gap-12 items-start mx-auto justify-center w-[350px] h-full '>
                    <h1 className='text-6xl font-bold text-sec-color mt-[1px]'>Sign Up</h1>
                    <input className='p-2 w-full border-[1px] border-solid border-sec-color trans focus:border-third-color rounded-md outline-none' type="email" value={name} maxLength={15} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input className='p-2 w-full border-[1px] border-solid border-sec-color trans focus:border-third-color rounded-md outline-none' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <div className='relative w-full'>
                        <input ref={inputRef} className='p-2 w-full border-[1px] border-solid border-sec-color trans focus:border-third-color rounded-md outline-none' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        {password && !showPassword && <FontAwesomeIcon onClick={toggleShowPassword} icon={faEye} className='w-fit absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer outline-none hover:opacity-80 trans' />}
                        {password && showPassword && <FontAwesomeIcon onClick={toggleShowPassword} icon={faEyeSlash} className='w-fit absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer outline-none hover:opacity-80 trans' />}
                    </div>
                    <div className='flex flex-col gap-5 items-start w-full'>
                        <button onClick={handleSignUp} className='outline-none bg-sec-color text-white rounded-md w-full trans hover:bg-third-color py-2'>Sign Up</button>
                        <button onClick={goToLogin} className='outline-none text-center mx-auto text-sec-color trans underline hover:no-underline hover:text-third-color rounded-md w-fit'>Already have an account?</button>
                    </div>
                    {<p className={ `min-h-6 text-lg w-fit text-center font-semibold text-red-500 mx-auto ${error ? " visible" : " invisible"} `}>{error?.slice(10, error.length)}</p>}
                </div>
            }
        </>
    );
};

export default SignUp;
