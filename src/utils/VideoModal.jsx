import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const VideoModal = ({ videoURL, isOpen, onClose }) => {
    const {details} = useSelector((state) => state.movieDetail)
    
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflowY = 'scroll'
            
        } else { 
            document.body.style.overflowY = 'hidden'
        }
    }, [isOpen]);

    if (!isOpen)
        return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative flex flex-col bg-white rounded-lg  w-[60%] h-3/4">
                <div className='w-full text-white flex justify-between py-3 px-4 items-center bg-black'>
                    <h1 className='font-bold text-2xl'>{details.title}</h1>
                    <FontAwesomeIcon onClick={
                        () => {
                            document.body.style.overflowY = 'scroll';
                            onClose();
                        }
                    } icon={faCircleXmark} className=" text-white text-2xl w-fit text-center  trans  hover:text-red-600 cursor-pointer  font-bold"/>
                </div>
                <ReactPlayer
                    url={videoURL}
                    controls
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
};

export default VideoModal;
