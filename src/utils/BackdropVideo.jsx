import { AsyncImage } from 'loadable-image'
import React, { memo, useState } from 'react'
import { Blur } from 'transitions-kit'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useInView } from 'react-intersection-observer';
import VideoModal from './VideoModal';

const BackdropVideo = memo(({imgURL , videoURL}) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false)
    };

    return (
        <div ref={ref} className="min-w-[50%] relative">
            {inView && (
                <>
                    <AsyncImage
                        src={imgURL}
                        alt="Movie video"
                        Transition={Blur}
                        style={{ minWidth: '100%', height: '100%' }}
                        className="backdropIMG"
                        loader={<div className=' animate-pulse border-r-[1px] border-slate-50 border-solid' style={{ background: 'var(--third-color)' }} />}
                        loading="lazy"
                    />
                    <button onClick={openModal} className="w-14 -translate-x-1/2 -translate-y-1/2 h-14 cursor-pointer flex items-center justify-center trans opacity-100 hover:opacity-90 rounded-full bg-zinc-600 absolute top-1/2 left-1/2 ">
                        <FontAwesomeIcon icon={faPlay} className="text-white text-lg" />
                    </button>
                    <VideoModal videoURL={videoURL} isOpen={isModalOpen} onClose={closeModal} />
                </>
            )}
        </div>
    )
})


// <ReactPlayer
//     url={`https://www.youtube.com/watch?v=${video.key}`}
//     minWidth="50%"
//     height="300px"
//     controls
// />

export default BackdropVideo