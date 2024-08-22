import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
const MobileMenu = ({isOpen, toggleIsOpen}) => {
    return (
        <div className={`trans sm:hidden p-5 ${isOpen ? "translate-x-0" : "translate-x-[120%]"} fixed w-1/2 h-full top-0 right-0 bg-sec-color`}>
            <FontAwesomeIcon onClick={toggleIsOpen} icon={faCircleXmark} className=" text-white text-2xl w-fit text-center  trans  hover:text-red-600 cursor-pointer  font-bold"/>
            
        </div>
    )
}

export default MobileMenu