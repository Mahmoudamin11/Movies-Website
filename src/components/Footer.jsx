import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";


const Footer = () => {
    return (
        <div className='w-full h-fit py-5 max-sm:px-5 max-sm:flex-col max-sm:gap-3 max-[800px]:px-10 px-20 flex items-center justify-between bg-main-color  text-white'>
            <p className=' font-bold cursor-default'>
                Mahmoud Amin
            </p>
            <div className=''>&copy; All Rights <span className='font-bold'>Not Reserved</span> 2024</div>
            <div className='w-fit flex gap-5'>
                <a className='text-white trans hover:text-fourth-color' href="https://www.linkedin.com/in/mahmoud-amin-15023025a/" target='_blank'>
                    <FontAwesomeIcon icon={faLinkedin} className='text-2xl w-fit'  />
                </a>
                <a className='text-white trans hover:text-fourth-color' href="https://github.com/Mahmoudamin11" target='_blank' >
                    <FontAwesomeIcon icon={faGithub} className='text-2xl w-fit'  />
                </a>
            </div>
        </div>
    )
}

export default Footer