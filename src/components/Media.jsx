import React, { memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieMedia } from '../slices/MediaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import arrowRight from '../assets/arrow-right.svg'
import BackdropVideo from '../utils/BackdropVideo';
import { useInView } from 'react-intersection-observer';
import { ref } from 'firebase/storage';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import DisplayedImage from '../utils/DisplayedImage';
import DisplayedPoster from '../utils/DisplayedPoster';

const Media = memo(() => {
    const { id } = useParams(); // useParams to get the movie ID from the URL
    const dispatch = useDispatch();

    const [shown, setShown] = useState('images');
    const scrollContainerRef = useRef(null);
    
    const toggleShown = (media) => {
        setShown(media);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: 0,
            });
        }
    };
    
    const { images, videos, status, error } = useSelector((state) => state.media);
    useEffect(() => {
        if (id) {
            dispatch(fetchMovieMedia(id));
        }
    }, [dispatch, id]);

    const [visibleVideos, setvisibleVideos] = useState(5); 
    const [visibleImages, setvisibleImages] = useState(5); 
    const [visiblePosters, setvisiblePosters] = useState(5); 
    
    const handleLoadMoreVideos = () => {
        setvisibleVideos((prev) => prev + 5); 
    };
    const handleLoadMoreImages = () => {
        setvisibleImages((prev) => prev + 5); 
    };
    const handleLoadMorePosters = () => {
        setvisiblePosters((prev) => prev + 5); 
    };

    const [shownImage, setShownImage] = useState('');

    const changeShownImage = (link) => { 
        document.body.style.overflowY = 'hidden';
        setShownImage(link);
    }
    const handleCloseShownImage = () => { 
        document.body.style.overflowY = 'scroll';
        setShownImage('');
    }
    const [shownPoster, setShownPoster] = useState('');

    const changeShownPoster = (link) => { 
        document.body.style.overflowY = 'hidden';
        setShownPoster(link);
    }
    const handleCloseShownPoster = () => { 
        document.body.style.overflowY = 'scroll';
        setShownPoster('');
    }

    return (
        (images?.posters?.length != 0 || images?.backdrops?.length != 0 || videos?.results?.length != 0) &&
        <div className=' flex flex-col gap-5'>
            <div className='flex gap-10 items-center'>
                <h1 className='font-bold text-2xl'>Media</h1>
                <div className='flex gap-5 font-bold items-center mt-2  h-full'>
                    {images?.backdrops?.length != 0 && <button onClick={() => toggleShown('images')} className={` py-1 cursor-pointer trans hover:opacity-70 outline-none max-sm:text-sm ${shown == 'images' ? "active" : "notActive"}`}>Backdrops <span className='text-gray-400 '>{images?.backdrops?.length}</span></button>}
                    {videos?.results?.length != 0 && <button onClick={() => toggleShown('videos')} className={` py-1 cursor-pointer trans hover:opacity-70 outline-none max-sm:text-sm ${shown == 'videos' ? "active" : "notActive"}`}>Videos <span className='text-gray-400 '>{videos?.results?.length}</span></button>}
                    {images?.posters?.length != 0 && <button onClick={() => toggleShown('posters')} className={` py-1 cursor-pointer trans hover:opacity-70 outline-none max-sm:text-sm ${shown == 'posters' ? "active" : "notActive"}`}>Posters <span className='text-gray-400 '>{images?.posters?.length}</span></button>}
                </div>
            </div> 
            {<div className='flex  w-full'>
                {status === 'loading' && <LoadingSpinnerSections />}
                {status === 'failed' && (images?.backdrops?.length > 0 || videos?.results?.length > 0 ||images?.posters?.length > 0 ) && <p className='w-full h-[300px] text-2xl flex items-center justify-center text-third-color font-bold'>{error}</p>}
                {status === 'succeeded' && (
                    <div ref={scrollContainerRef} className={`flex w-full overflow-x-scroll rounded-t-md pb-2 h-[300px] max-sm:h-[200px]`}>
                        
                        {shown === 'images' && images.backdrops && images.backdrops.length != 0  && 
                            images.backdrops.slice(0, visibleImages).map((image) => (
                                <AsyncImage
                                    key={image.file_path}
                                    src={`https://image.tmdb.org/t/p/w500${image?.file_path}`}
                                    alt="Movie backdrop"
                                    onClick={() => changeShownImage(`https://image.tmdb.org/t/p/w500${image?.file_path}`)}
                                    Transition={Blur}
                                    style={{ minWidth: '50%', height: '100%', cursor: 'pointer'}}
                                    loader={<div className=' animate-pulse border-r-[1px] border-slate-50 border-solid' style={{ background: 'var(--third-color)' }} />}
                                    loading='lazy'
                                />
                            ))
                        }

                        {shown === 'posters' && images.posters && images.posters.length != 0  && images.posters.slice(0, visiblePosters).map((image) => (
                            <AsyncImage
                                key={image.file_path}
                                src={`https://image.tmdb.org/t/p/w342${image.file_path}`}
                                alt="Movie backdrop"
                                Transition={Blur}
                                onClick={() => changeShownPoster(`https://image.tmdb.org/t/p/w342${image.file_path}`)}
                                style={{ minWidth: '25%', height: '100%', cursor: 'pointer'}}
                                loader={<div className=' animate-pulse border-r-[1px] border-slate-50 border-solid' style={{ background: 'var(--third-color)' }} />}
                                loading='lazy'
                            />
                        ))}
                        
                        {
                            shown == 'videos' && videos.results && videos.results != 0 &&
                                    videos.results.slice(0, visibleVideos).map((video) => (
                                    
                                            <BackdropVideo
                                                key={video.key}
                                                imgURL = {`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                                                videoURL = {`https://www.youtube.com/watch?v=${video.key}`}
                                            />
                                            
                                    ))
                        }

                        {videos.results && visibleVideos < videos.results.length && shown === 'videos' && <div  className="bg-slate-50 min-w-[50%] font-bold flex  items-center px-2  h-full">
                                <div onClick={handleLoadMoreVideos} className='flex gap-1 items-center cursor-pointer'>
                                    <button className='trans outline-none opacity-100 hover:opacity-70 text-lg'>Load More</button>
                                    <img src={arrowRight} alt="" className='w-5 mt-1' />
                                </div>
                        </div>}

                        {images.backdrops && visibleImages < images.backdrops.length && shown === 'images' && <div  className="bg-slate-50 min-w-[50%] font-bold flex  items-center px-2  h-full">
                                <div onClick={handleLoadMoreImages} className='flex gap-1 items-center cursor-pointer'>
                                    <button className='trans outline-none opacity-100 hover:opacity-70 text-lg'>Load More</button>
                                    <img src={arrowRight} alt="" className='w-5 mt-1' />
                                </div>
                        </div>}

                        {images.posters && visiblePosters < images.posters.length && shown === 'posters' && <div  className="bg-slate-50 min-w-[25%] font-bold flex  items-center px-2  h-full">
                                <div onClick={handleLoadMorePosters} className='flex gap-1 items-center cursor-pointer'>
                                    <button className='trans outline-none opacity-100 hover:opacity-70 text-lg max-sm:text-[15px]'>Load More</button>
                                    <img src={arrowRight} alt="" className='w-5 mt-1' />
                                </div>
                        </div>}
                        
                    </div>
                )}
            </div>}
            {shownImage && <DisplayedImage image={shownImage} onClose={handleCloseShownImage} />}
            {shownPoster && <DisplayedPoster image={shownPoster} onClose={handleCloseShownPoster} />}
        </div>
    );
});

export default Media;
