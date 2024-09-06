import { AsyncImage } from 'loadable-image'
import React from 'react'
import { Blur } from 'transitions-kit'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const DisplayedImage = ({image,onClose}) => {
    
    return (
        <div className=' fixed top-0 left-0 z-50 flex flex-col items-center justify-center  w-full h-full bg-black bg-opacity-50  rounded-md '>
            <div className='w-[500px] max-[500px]:w-[342px] text-right'>
                <FontAwesomeIcon onClick={
                    () => {
                        onClose();
                    }
                } icon={faCircleXmark} className=" text-white mb-5 text-2xl w-fit text-center  trans  hover:text-red-600 cursor-pointer  font-bold"/>
            </div>
            <div className='w-[342px] h-[300px] min-[500px]:w-[500px] min-[500px]:h-[250px] '>
                <AsyncImage
                    src={image}
                    alt="Movie backdrop"
                    Transition={Blur}
                    style={{ width: '100%', height: '100%'}}
                    loader={<div className=' animate-pulse border-r-[1px] border-slate-50 border-solid' style={{ background: 'var(--third-color)' }} />}
                    loading='lazy'
                />
            </div>
        </div>
    )
}

export default DisplayedImage