import React from 'react';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import VideoModal from '../utils/VideoModal';
import { useSelector } from 'react-redux';
import Error from './Error';

const TrailerPlayer = ({ onCloseTrailer, videoError}) => {
    const { videos, status, error } = useSelector((state) => state.media);
    
    return (
        <>
            {
                (videos && videos?.results &&  !videos?.results[0]?.key) && videoError()
            }
            {status === "succeeded" && videos?.results[0]?.key && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
                {videos?.results[0]?.key && (
                    <VideoModal videoURL={`https://www.youtube.com/embed/${videos.results[0].key}`} isOpen={true} onClose={onCloseTrailer} />
                ) }
            </div>}

            {
                status === "loading" && 
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <LoadingSpinnerSections />
                    </div>
            }
            {
                status === "failed" && <Error error={error} />
            }
        </>
    );
};

export default TrailerPlayer;
