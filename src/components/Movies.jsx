import DiscoveredMovies from './DiscoveredMovies';
import { memo} from 'react';
import TrendingMovies from './TrendingMovies';
import PopularMovies from './PopularMovies';
import FreeToWatch from './FreeToWatch';

const Movies = memo(() => {

    return (
        <div className=' max-sm:px-5 px-20 mt-10 pb-10'>
            <TrendingMovies  />
            <DiscoveredMovies />
            <PopularMovies />
            <FreeToWatch />
        </div>
    )
})

export default Movies