import React, { memo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Review from '../components/Review';
import { useSelector } from 'react-redux';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Palette } from 'color-thief-react';

const AllReviews = memo(() => {
    const loc = useLocation();
    const reviews = loc.state || [];
    const [backgroundColor, setBackgroundColor] = useState("");
    
    const id = useParams();
    const {details, status, error} = useSelector((state) => state.movieDetail);
    const nav = useNavigate();
    const handleBackToMain = () => { 
      nav(`/movie/${id.id}`)
    }
  return (
    <div className='flex flex-col gap-6 mt-8'>
      <div style={{background: backgroundColor[0], opacity: '0.9'}} className={`w-full  py-8  `}>
        <div className='w-3/4 mx-auto flex gap-5 items-center'>
          <Palette src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} crossOrigin="anonymous" format="hex" colorCount={4}>
            {({ data }) => {
              if (data)
                setBackgroundColor(data);
            }}
          </Palette>
          <AsyncImage
                  src={`https://image.tmdb.org/t/p/w154${details.poster_path}`}
                  Transition={Blur}
                  style={{ width: '100px', height: '150px', borderRadius: "6px" }}
                  loader={<div style={{ background: 'var(--third-color)' }} />}
          />
          <div className='flex flex-col gap-1'>
            <h1 className=' text-2xl font-bold text-white'>
              {details.title} <span className=' font-normal text-2xl opacity-60'>({details?.release_date?.slice(0,4)})</span>
            </h1>
            <button onClick={handleBackToMain} className='flex gap-2 text-white font-bold trans opacity-80 hover:opacity-100 w-fit justify-start items-center'>
              <FontAwesomeIcon icon={faArrowLeftLong} className='w-fit mt-1' />
              <p>Back to movie</p>
            </button>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-10 w-3/4 justify-center mx-auto mt-2'>
        {
          reviews.reviews.map((rev) => <Review key={rev.id} />)
        }
      </div>
    </div>
  )
})

export default AllReviews