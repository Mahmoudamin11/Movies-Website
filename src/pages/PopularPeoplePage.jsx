import React, { useEffect, useState } from 'react'
import { getPopularPeople } from '../slices/MediaSlice';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { formatCurrency } from '../utils/Formats';
import { useLocation, useNavigate } from 'react-router-dom';
import Error from '../components/Error';
import LoadingSpinner from '../components/LoadingSpinner';

const PopularPeoplePage = () => {
    const [popularPeople, setPopularPeople] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [page, setPage] = useState(1);
    const loc = useLocation();
    useEffect(() => { 
        window.scroll(0,0);
    }, [loc]);
    const fetchPopularPeople = async () => {
        try {
            setLoading(true);
            const people = await getPopularPeople(page);
            setPopularPeople(people);
            setError("");
        } catch (error) {
            console.error('Failed to fetch popular people:', error);
            setError(error.message);
        } finally { 
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchPopularPeople();
    }, []);

    useEffect(() => { 
        fetchPopularPeople(page);
        window.scroll(0,0);
    }, [page])
    
    const goToPerson = (id, name) => {
        const hyphenatedName = name.replace(/\s+/g, '-');
        const encodedName = encodeURIComponent(hyphenatedName);
        const url = `${id}-${encodedName}`;
        nav(`/person/${url}`);
    };

    const changePage = (n) => { 
        // n may be +1 or -1
        // fetchPopularPeople(page + n)
        setPage(page + n);
    }

    const makePage = (n) => setPage(n);

    return (
        <>

            { 
                loading && <LoadingSpinner />
            }

            {
                error && <Error error={error} />
            }

            {
                !loading && !error && 
                <div className="p-20 max-md:p-10 max-sm:p-5 w-full min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Popular people</h1>
            <div className='grid place-items-center grid-cols-1 min-[670px]:grid-cols-2 min-[1050px]:grid-cols-3 min-[1300px]:grid-cols-4 gap-10'>
                {popularPeople.length > 0 && popularPeople.map((person, index)  => !person.adult && person.profile_path && person.name != "Christine Bermas" && person.name != "Min Do-yoon" && person.name != "Rika" && person.name != "Dyessa Garcia" && person.name != "Yoo Jung" && person.name != "Yoo Ji-hyun" && person.name != "Jin Si-ah" && person.name != "Han Seo-ah" && person.name != "Kim Do-hee" && person.name != "Hee-jeong" && person.name != "Tresi Gazal" && person.name != "AJ Raval" && person.name != "Asami Ogawa" && person.name != "Han Yi-seul" && person.name != "Baek Se-ri" && person.name != "Erika Balagtas"&& person.name != "Wang Churan"&& person.name != "Seung Ha" && person.name != "Yda Manzano" && person.name != "Li Xinai" && person.name != "Kiami Davael" && person.name != "Yoon Yool"&& person.name != "Angelica Hart" && person.name != "Fang Jin"&& person.name != "Park Kyoung-hee" && person.name != "Yeung Si-min" && person.name != "Yeung Si-min"     ?  (
                    <div key={person.id} onClick={() => goToPerson(person.id, person.name)} className="cursor-pointer trans hover:scale-105 flex flex-col items-center w-[250px]  shadow-md rounded-b-[8px]">
                        <div className="relative w-[250px]">
                            <span className="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                #{index + 1}
                            </span>
                            <AsyncImage
                                src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                                Transition={Blur}
                                style={{ width: '100%', height: '250px', borderRadius: "8px 8px 0px  0px " }}
                                loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                            />
                        </div>
                        <h2 className="py-3 text-lg font-semibold text-main-color">{person.name}</h2>
                    </div>
                ) : null)}
            </div>
        </div>
            }

            <div className='flex w-full justify-center items-center gap-5 max-sm:gap-1 pb-20 max-md:pb-10 max-sm:pt-5 max-sm:pb-5 '>
                <button onClick={() => changePage(-1)} className='px-3 rounded-md py-1 outline-none bg-sec-color trans hover:bg-third-color text-white font-semibold'>{'<'}</button>
                <span className='font-semibold flex items-center gap-1  min-w-fit text-center'>
                    <button onClick={() => makePage(1)} className={`py-1 px-2 rounded-sm ${page === 1 ? "bg-gray-300" : ""} outline-none`}>1</button>
                    <button onClick={() => makePage(2)} className={`py-1 px-2 rounded-sm ${page === 2 ? "bg-gray-300" : ""} outline-none`}>2</button>
                    <button onClick={() => makePage(3)} className={`py-1 px-2 rounded-sm ${page === 3 ? "bg-gray-300" : ""} outline-none`}>3</button>
                    <button onClick={() => makePage(4)} className={`py-1 px-2 rounded-sm ${page === 4 ? "bg-gray-300" : ""} outline-none`}>4</button>
                    {
                        page > 4 && page != 500 && <>
                            <p>...</p>
                            <button onClick={() => makePage(page)} className={`py-1 px-2 rounded-sm  bg-gray-300 outline-none`}>{page}</button>
                        </>
                    }
                    <p>...</p>
                    {!loading && !error && <button onClick={() => makePage(500)} className={`py-1 px-2 rounded-sm ${page === 500 ? "bg-gray-300" : ""} outline-none`}>500</button>}
                </span>
                <button onClick={() => changePage(+1)} className='px-3 rounded-md py-1 outline-none bg-sec-color trans hover:bg-third-color text-white font-semibold'>{'>'}</button>
            </div>
        </>
    );
}

export default PopularPeoplePage