import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import RootLayout from './components/RootLayout';
import DetailedMovie from './pages/DetailedMovie';


const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path='/' element={<Home />} />
      <Route path='movie/:id' element={<DetailedMovie movie />} />
    </Route>
  )
)



function App() {
  
  return (
    <>
      <RouterProvider router={Router} />
    </>
  )
}

export default App
