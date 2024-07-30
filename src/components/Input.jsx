import React, { useState } from 'react';
import search from "../assets/search.svg"
import { useDispatch } from 'react-redux';
import { fetchSearchResults } from '../slices/searchSlice';

const Input = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const handleSearch = () => { 
        if (query != '' && query.toLowerCase() != 'porn' && query.toLowerCase() != 'sex'
            && query.toLowerCase() != 'xnxx' && query.toLowerCase() != 'erotica'
        )
            dispatch(fetchSearchResults(query));
    }
    const handleQueryChange = (e) => { 
        setQuery(e.target.value)
    }
    return (
        <div className='flex relative h-10'>
            <input value={query} onChange={handleQueryChange} type="text" className='outline-none text-main-color rounded-md  w-96 pl-2' maxLength={40} placeholder='Search for a movie' />
            <div onClick={handleSearch} className='bg-sec-color h-full w-fit px-2 absolute cursor-pointer hover:bg-third-color trans top-0 -right-1 rounded-r-md  flex items-center justify-center'>
                <img src={search} alt="" className='w-6 h-6' />
            </div>
        </div>
    )
}

export default Input;