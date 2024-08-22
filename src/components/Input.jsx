import React, { useState } from 'react';
import search from "../assets/search.svg"
import { useDispatch } from 'react-redux';
import { fetchSearchResults } from '../slices/searchSlice';
import { useNavigate } from 'react-router-dom';

const Input = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const nav = useNavigate();
    const handleSearch = () => {
        if (query != '' && query != 'porn' && query != 'xxx' && query != 'erotica' && query != 'sex' ) 
        { 
            nav('/searchedMovies')
            dispatch(fetchSearchResults(query));
        }
    }
    const handleQueryChange = (e) => { 
        setQuery(e.target.value)
    }
    return (
        <div className='flex  relative h-10 border-[1px] border-solid border-third-color  rounded-l-md'>
            <input value={query} onChange={handleQueryChange} type="text" className='outline-none text-sec-color rounded-md max-[500px]:w-80  w-96 pl-3' maxLength={40} placeholder='Search for a movie' />
            <div onClick={handleSearch} className='bg-sec-color h-full w-fit px-2 absolute cursor-pointer hover:bg-third-color trans top-0 -right-1 rounded-r-md  flex items-center justify-center'>
                <img src={search} alt="" className='w-6 h-6' />
            </div>
        </div>
    )
}

export default Input;