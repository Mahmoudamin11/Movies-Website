import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { Blur } from 'transitions-kit';
import { AsyncImage } from 'loadable-image';
import { useLocation, useNavigate } from 'react-router-dom';
import Error from '../components/Error';

const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const favorites = useSelector((state) => state.favorites.items);
    
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
    const loc = useLocation();


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
                    window.location.reload();
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

    const shownMovies = 6

    return (
        <div className='min-h-screen flex flex-col items-start gap-16 px-20 max-sm:px-5 py-20 w-full'>
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
                                        src={user?.photoURL}
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
                {favorites.length > 0 &&<div 
                className="relative trans pt-2 pb-4 px-4 bg-waves bg-cover bg-top outline-none   rounded-md w-full h-fit flex overflow-x-scroll overflow-y-hidden gap-10 ">
                        {
                            favorites?.length > 0 && 
                            favorites.slice(0, shownMovies).map((movie) => (
                                <div key={movie.id} onClick={() => handleOpenMovie(movie.id)} className='relative z-50 flex group flex-col w-[150px]  gap-2 pt-4 px-2  cursor-pointer trans hover:scale-105'>
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
                        favorites.length == 0 && <h1 className='w-full text-center text-3xl border-[1px] border-solid p-20 rounded-md text-third-color font-bold'>No Favorite Movies Chosen</h1>
                    }
            </div>}
        </div>
    );
};

export default Profile;
