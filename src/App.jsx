import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import RootLayout from './components/RootLayout';
import DetailedMovie from './pages/DetailedMovie';
import RouteError from './components/RouteError';
import AllReviews from './pages/AllReviews';
import MovieLayout from './layouts/MovieLayout';
import SearchedMovies from './components/SearchedMovies';
import Authenticate from './utils/authentication';
import PersonPage from './pages/PersonPage';
import PopularPeoplePage from './pages/PopularPeoplePage';
import PopularMovies from './pages/PopularMovies';
import NowPlayingMovies from './pages/NowPlayingMovies';
import UpcomingMovies from './pages/UpcomingMovies';
import TopRatedMovies from './pages/TopRatedMovies';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { checkAuthStatus } from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Favorite from './pages/Favorite';
import { loadFavorites } from './slices/favoriteSlice';
import ProfileProtectedRoute from './utils/ProtectedRoute';


const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path='/' element={<Home />} />
      <Route path='/favorite' element={<Favorite />} />
      <Route path='/searchedMovies' element={<SearchedMovies />} />
      <Route path="/approved" element={<Authenticate />} />
      {/* <Route path="/login" element={<LoginWithTMDB />} /> */}
      <Route path="/person/:id" element={<PersonPage />} />
      <Route path="/popularPeople" element={<PopularPeoplePage />} />
      <Route path="/popularMovies" element={<PopularMovies />} />
      <Route path="/nowPlayingMovies" element={<NowPlayingMovies />} />
      <Route path="/upcoming" element={<UpcomingMovies />} />
      <Route path="/topRated" element={<TopRatedMovies />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfileProtectedRoute />} />
      <Route path='*' element={<RouteError />} />

      
      <Route path='movie/:id' element={<MovieLayout />} >
        <Route index element={<DetailedMovie movie />} />
        <Route path='reviews' element={<AllReviews />} />
      </Route>
      
    </Route>
  )
)



function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Adjust state path as needed

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.uid) {
      dispatch(loadFavorites(user.uid));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={Router} />
    </>
  )
}

export default App
