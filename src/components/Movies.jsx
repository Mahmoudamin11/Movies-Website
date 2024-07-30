import { useSelector } from 'react-redux';
import DiscoveredMovies from './DiscoveredMovies';
import SearchedMovies from "./SearchedMovies";

const Movies = () => {
    const {result , status, error} = useSelector((state) => state.search)
    return (
        <div className='grid grid-cols-4 gap-10 px-20 my-20'>
            {result.length== 0 && <DiscoveredMovies />}
            <SearchedMovies />
        </div>
    )
}

export default Movies