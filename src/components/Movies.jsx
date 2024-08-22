import DiscoveredMovies from './DiscoveredMovies';
import { memo, useState} from 'react';
import TrendingMovies from './TrendingMovies';
import PopularMovies from './PopularMovies';
import FreeToWatch from './FreeToWatch';
import LoadingSpinner from './LoadingSpinner';

const Movies = memo(() => {
    const [loading, setLoading] = useState(false);
    const changeLoading = (bool) => { 
        setLoading(bool);
    }
    return (
        <div className=' max-sm:px-5 px-20 mt-10 pb-10'>
            {!loading && <>
                <TrendingMovies changeLoading={changeLoading} />
                { <DiscoveredMovies />}
                <PopularMovies />
                <FreeToWatch />
            </>}
            {
                loading && <LoadingSpinner />
            }
        </div>
    )
})

export default Movies