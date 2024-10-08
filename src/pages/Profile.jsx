import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { Blur } from 'transitions-kit';
import { AsyncImage } from 'loadable-image';
import { useNavigate } from 'react-router-dom';
import { fetchAllRatings } from '../slices/RatingSlice';
import LoadingSpinnerSections from '../utils/LoadingSpinnerSections';
import { fetchAllUserReviews } from '../utils/review';
import { formatDate } from '../utils/Formats';

const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const favorites = useSelector((state) => state.favorites.items);
    const favError = useSelector((state) => state.favorites.error);
    const favLoading = useSelector((state) => state.favorites.loading);
    const ratings = useSelector((state) => state.ratings.allRatings); 
    const ratingError = useSelector((state) => state.ratings.error); 
    const ratingLoading = useSelector((state) => state.ratings.loading);
    const [userReviews, setUserReviews] = useState([])
    const [reviewLoading, setReviewLoading] = useState(false)
    const [reviewError, setReviewError] = useState('')
    const [currIMG, setCurrIMG] = useState('')
    
    const containerRef = useRef(null);
    const dispatch = useDispatch();

    const fetchRatings = useCallback(() => {
        dispatch(fetchAllRatings(user.uid));
    }, [dispatch]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchRatings();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [fetchRatings]);
    const [shownRatings, setShownRatings] = useState(6)
    
    const fileRef = useRef(null);
    const [uploadedIMG, setUploadedIMG] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleButtonClick = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedIMG(file);
            await uploadImageToFirebase(file);
        }
    };
    


    const uploadImageToFirebase = async (file) => {
        const auth = getAuth();
        const storage = getStorage();
        const user = auth.currentUser;

        if (user) {
            const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setLoading(true);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Progress function if you want to show upload progress
                }, 
                (error) => {
                    console.error("Upload error:", error);
                    setLoading(false);
                }, 
                async () => {
                    // Complete function
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateProfile(user, { photoURL: downloadURL });
                    setLoading(false);
                    // window.location.reload();
                    setCurrIMG(downloadURL)
                    nav('/profile')
                }
            );
        }
    };

    const goToFavorites = () => { 
        nav(`/favorite`);
    }
    const handleOpenMovie = (id) => { 
        nav(`/movie/${id}`); 
    }
    const handleOpenReview = (id) => { 
        nav(`/movie/${id}`, {state : {comingFrom : 'profileReview'}});
        
    }

    const shownMovies = 6;
    const [shownReviews, setShownReviews] = useState(6);

    const loadMoreReviews = () => { 
        if (shownReviews + 5 > userReviews.length)
            setShownReviews(prev => prev + userReviews.length - prev)
        else 
            setShownReviews(prev => prev + 5)
    }

    const loadMore = () => { 
        if (shownRatings + 5 > ratings.length)
            setShownRatings(prev => prev + ratings.length - prev)
        else 
            setShownRatings(prev => prev + 5)
    }

    useEffect(() => {
        const loadUserReviews = async () => {
            try {
                setReviewLoading(true)
                const reviews = await fetchAllUserReviews(user?.uid);
                setUserReviews(reviews);
                
            } catch (err) {
                setReviewError(err.message);
            } finally { 
                setReviewLoading(false)
            }
        };
        
        loadUserReviews();
        setCurrIMG(user?.photoURL);
    }, [user?.uid]);

    

    return (
        <div className='min-h-screen flex flex-col items-start gap-16 px-20 max-sm:px-5 py-20 w-full overflow-x-hidden'>
            <div className='flex items-center max-sm:flex-col max-sm:justify-center w-full gap-4  '>
                <div>
                    { (
                        <div className='flex flex-col gap-2 justify-center items-center'>
                            {!uploadedIMG && !user?.photoURL && (
                                <div className='flex items-center justify-center w-32 h-32 trans rounded-full bg-[#282856]'>
                                    <FontAwesomeIcon icon={faUser} className='text-[30px] text-white' />
                                </div>
                            )}
                            {uploadedIMG && !user?.photoURL &&
                                <div className='border-[2px] border-solid rounded-full'>
                                    {
                                        loading && <div className='w-[128px] h-[128px] rounded-full bg-third-color animate-pulse trans' />
                                    }
                                    {!loading && <AsyncImage
                                        src={URL.createObjectURL(uploadedIMG)}
                                        Transition={Blur}
                                        style={{ width: '128px', height: '128px', borderRadius: "100%" }}
                                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />}
                                </div>
                            }
                            {
                                user?.photoURL && <div className='border-[1px] w-32 border-solid rounded-full'>
                                    {
                                        loading && <div className='w-[128px] h-[128px] rounded-full bg-third-color animate-pulse trans' />
                                    }
                                    {!loading && <AsyncImage
                                        src={currIMG}
                                        Transition={Blur}
                                        style={{ width: '128px', height: '128px', borderRadius: "100%" }}
                                        loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />}
                                </div>
                            }
                            <button
                                onClick={handleButtonClick}
                                className='outline-none trans px-3 py-2 text-white bg-third-color hover:bg-fourth-color rounded-md'
                                disabled={loading}
                            >
                                {loading ? "Uploading..." : "Edit Image"}
                            </button>
                            <input
                                onChange={handleFileChange}
                                type="file"
                                ref={fileRef}
                                name="fileIn"
                                id="fileUploader"
                                className='hidden'
                                accept="image/*"
                            />
                        </div>
                    )}
                </div>
                <div className=' flex flex-col gap-1 max-sm:text-center'>
                    <p className='font-semibold text-2xl'>{user?.displayName}</p>
                    <p className='text-gray-400 text-sm'>{user?.uid}</p>
                </div>
            </div>
            { <div className='flex flex-col gap-3 w-full'>
                <h1 className='text-3xl font-bold'>Favorite Movies</h1>
                {favorites.length > 0 && !favLoading && !favError && <div 
                className="relative trans pt-2 pb-4 px-4 bg-waves bg-cover bg-top outline-none   rounded-md w-full h-fit flex overflow-x-scroll overflow-y-hidden gap-10 ">
                        {
                            favorites?.length > 0 && 
                            favorites.slice(0, shownMovies).map((movie) => (
                                <div key={movie.id} onClick={() => handleOpenMovie(movie.id)} className='relative z-40 flex group flex-col w-[150px]  gap-2 pt-4 px-2  cursor-pointer trans hover:scale-105'>
                                    <AsyncImage
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                            Transition={Blur}
                                            style={{ width: '150px', height: '250px', borderRadius: "6px" }}
                                            loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className=' group-hover:opacity-80 trans '>
                                        <span className=' font-bold text-sm '>{movie.title}</span>
                                    </div>
                                </div>
                            ))
                        }
                        {favorites.length > shownMovies  && 
                            <button onClick={goToFavorites} className="bg-slate-50 outline-none translate-x-0 hover:scale-105 group cursor-pointer trans rounded-md mt-4 min-w-[150px] font-semibold flex  items-center px-2 h-[250px] ">
                                    <div  className='flex gap-1 items-center cursor-pointer'>
                                        <button className='trans outline-none opacity-100 group-hover:opacity-70 '>See All</button>
                                        <FontAwesomeIcon icon={faArrowRight} className='w-fit trans group-hover:opacity-70' />
                                    </div>
                            </button>
                            }
                        
                    </div>}
                    {
                        favorites.length == 0 && !favLoading && !favError &&  <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>No Favorite Movies Chosen</h1>
                    }

                    {
                        favLoading && <LoadingSpinnerSections />
                    }
                    {
                        favError && <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>{favError}</h1>
                    }
            </div>}
            

            {/* Your Reviews */}
            { <div className='flex flex-col gap-3 w-full'>
                <h1 className='text-3xl font-bold'>Your Reviews</h1>
                {userReviews.length > 0 && !reviewLoading && !reviewError && <div 
                className="relative trans pt-2 pb-4 max-sm:px-2 px-4  grid  grid-cols-1 min-[1050px]:grid-cols-2 min-[1300px]:grid-cols-3 place-content-center  place-items-center gap-10 ">
                        {
                            userReviews?.length > 0 && 
                            userReviews.slice(0, shownReviews).map((obj) => (
                                <div 
                                    key={obj.movie?.id} 
                                    onClick={() => handleOpenReview(obj.movie?.id)} 
                                    className='relative z-40 bg-gray-50 max-[500px]:w-[350px] w-[420px] h-[170px] shadow-md rounded-md group flex cursor-pointer trans hover:scale-105'
                                >
                                    <AsyncImage
                                        src={`https://image.tmdb.org/t/p/w185${obj.movie?.poster_path}`}
                                        Transition={Blur}
                                        style={{ minWidth: '100px', height: '170px', borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
                                        loader={<div className='animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className=' w-full max-sm:px-1 px-2 py-2 '>
                                        <div className='group-hover:opacity-80 trans max-sm:max-w-[250px]  max-w-[280px] space-y-2 flex-wrap break-words  py-4 pl-2 pr-4'>
                                            <span className=' font-bold text-sm  w-full'>{obj.movie?.title}</span>
                                            <p className='text-sm max-sm:text-xs  text-gray-700 max-sm:h-[48px] h-[50px] flex-wrap break-words'>{obj?.review?.slice(0, 90)}{obj.review.length >= 90 && '...'}</p>
                                            <p className='text-sm text-gray-500 w-full text-right'>{formatDate(obj.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        
                    </div>}
                    {userReviews.length > shownReviews && !loading && !reviewError && 
                            <div onClick={loadMoreReviews} className='w-full cursor-pointer outline-none flex items-center justify-center'>
                                <button className='outline-none text-white px-10 mt-5 py-2 rounded-md  bg-sec-color trans hover:bg-third-color'>See All</button>
                            </div>
                        }

                    {
                        userReviews.length == 0 && !reviewLoading && !reviewError &&  <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>You din't review yet</h1>
                    }

                    {
                        reviewLoading && <LoadingSpinnerSections />
                    }
                    {
                        reviewError && <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>{reviewError}</h1>
                    }
            </div>}

            { !ratingLoading && !ratingError &&  <div ref={containerRef} className='flex flex-col gap-3 w-full'>
                <h1 className='text-3xl font-bold'>Movies You Rated</h1>
                {ratings.length > 0 &&<div 
                className="relative trans pt-2 pb-4 px-4 bg-waves bg-cover bg-top outline-none   rounded-md w-full h-fit flex overflow-x-scroll overflow-y-hidden gap-10 ">
                        {
                            ratings?.length > 0 && 
                            ratings.slice(0, shownRatings).map(({id, rating, movie}) => movie ?  (
                                <div key={id} onClick={() => handleOpenMovie(movie.id)} className='relative z-40 flex group flex-col w-[150px]  gap-2 pt-4 px-2  cursor-pointer trans hover:scale-105'>
                                    <AsyncImage
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                            Transition={Blur}
                                            style={{ width: '150px', height: '250px', borderRadius: "6px" }}
                                            loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                                    />
                                    <div className=' group-hover:opacity-80 trans '>
                                        <span className=' font-bold text-sm '>{movie.title}</span>
                                    </div>
                                    <div className=' absolute top-6 left-[75%] w-9 h-9 flex items-center text-xs font-semibold justify-center rounded-full bg-white text-third-color'>{rating}%</div>
                                </div>
                            ): null)
                        }
                        {ratings.length > shownRatings  && 
                            <button onClick={loadMore} className="bg-slate-50 outline-none translate-x-0 hover:scale-105 group cursor-pointer trans rounded-md mt-4 min-w-[150px] font-semibold flex  items-center px-2 h-[250px] ">
                                    <div  className='flex gap-1 items-center cursor-pointer'>
                                        <button className='trans outline-none opacity-100 group-hover:opacity-70 '>Load More</button>
                                        <FontAwesomeIcon icon={faArrowRight} className='w-fit trans group-hover:opacity-70' />
                                    </div>
                            </button>
                            }
                        
                    </div>}
                    {
                        ratings.length == 0 && !ratingLoading && !ratingError && <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>You didn't rate yet</h1>
                    }
                    {
                        ratingError && <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>{error}</h1>
                    }
                    {
                        ratingLoading && <LoadingSpinnerSections />
                    }
            </div>}


            

        </div>
    );
};

export default Profile;
