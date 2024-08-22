import React, { memo, useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { debounce } from 'transitions-kit';

const ScrollTopBtn = memo(() => {
    const [height, setHeight] = useState(window.scrollY);

    useEffect(() => {
        const handleScroll = debounce(() => {
            setHeight(window.scrollY);
        }, 100);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const scrollToTop = useCallback(() => { 
        window.scroll({
            top:0,
            behavior:'smooth'
        });
    }, [height])
    return (
        <button onClick={scrollToTop} className={`group px-5 py-4 hover:scale-105 text-white 3
        bg-sec-color font-bold rounded-md bottom-10 fixed right-5 
        hover:bg-third-color outline-none trans ${height > 2000 ? "translate-x-0" : "translate-x-[200%]"} `}>
            <FontAwesomeIcon icon={faAngleDown} className={`w-fit  text-lg rotate-[180deg] trans group-hover:scale-105`} />
        </button>
    )
})

export default ScrollTopBtn