import React, { useEffect, useState } from 'react';
import { getPopularPeople } from '../slices/MediaSlice';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import { formatCurrency } from '../utils/Formats';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Error from '../components/Error';
import LoadingSpinner from '../components/LoadingSpinner';

const PopularPeoplePage = () => {
    const [popularPeople, setPopularPeople] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const loc = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        window.scroll(0, 0);
    }, [loc]);

    const fetchPopularPeople = async () => {
        try {
            setLoading(true);
            const people = await getPopularPeople(page);
            setPopularPeople(people);
            setError('');
        } catch (error) {
            console.error('Failed to fetch popular people:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularPeople();
    }, [page]);

    const goToPerson = (id, name) => {
        const hyphenatedName = name.replace(/\s+/g, '-');
        const encodedName = encodeURIComponent(hyphenatedName);
        const url = `${id}-${encodedName}`;
        nav(`/person/${url}`);
    };

    const changePage = (n) => {
        setSearchParams({ page: page + n });
    };

    const makePage = (n) => {
        setSearchParams({ page: n });
    };

    return (
        <>
            {loading && <LoadingSpinner />}

            {error && <Error error={error} />}

            {!loading && !error && (
                <div className="p-20 max-md:p-10 max-sm:p-5 w-full min-h-screen">
                    <h1 className="text-3xl font-bold mb-8">Popular people</h1>
                    <div className="grid place-items-center grid-cols-1 min-[670px]:grid-cols-2 min-[1050px]:grid-cols-3 min-[1300px]:grid-cols-4 gap-10">
                        {popularPeople.length > 0 &&
                            popularPeople.map((person, index) =>
                                !person.adult &&
                                person.profile_path &&
                                !['Christine Bermas', 'Min Do-yoon', 'Rika', 'Dyessa Garcia'].includes(
                                    person.name
                                ) ? (
                                    <div
                                        key={person.id}
                                        onClick={() => goToPerson(person.id, person.name)}
                                        className="cursor-pointer trans hover:scale-105 flex flex-col items-center w-[250px]  shadow-md rounded-b-[8px]"
                                    >
                                        <div className="relative w-[250px]">
                                            <span className="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                #{index + 1}
                                            </span>
                                            <AsyncImage
                                                src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                                                Transition={Blur}
                                                style={{
                                                    width: '100%',
                                                    height: '250px',
                                                    borderRadius: '8px 8px 0px  0px ',
                                                }}
                                                loader={
                                                    <div
                                                        className=" animate-pulse"
                                                        style={{ background: 'var(--third-color)' }}
                                                    />
                                                }
                                            />
                                        </div>
                                        <h2 className="py-3 text-lg font-semibold text-main-color">{person.name}</h2>
                                    </div>
                                ) : null
                            )}
                    </div>
                </div>
            )}

            <div className="flex w-full justify-center items-center gap-5 max-sm:gap-1 pb-20 max-md:pb-10 max-sm:pt-5 max-sm:pb-5">
                <button
                    onClick={() => changePage(-1)}
                    disabled={page === 1}
                    className="px-3 rounded-md py-1 outline-none bg-sec-color trans hover:bg-third-color text-white font-semibold"
                >
                    {'<'}
                </button>
                <span className="font-semibold flex items-center gap-1 min-w-fit text-center">
                    {[...Array(4).keys()].map((n) => (
                        <button
                            key={n}
                            onClick={() => makePage(n + 1)}
                            className={`py-1 px-2 rounded-sm ${
                                page === n + 1 ? 'bg-gray-300' : ''
                            } outline-none`}
                        >
                            {n + 1}
                        </button>
                    ))}
                    {page > 4 && page !== 500 && (
                        <>
                            <p>...</p>
                            <button className="py-1 px-2 rounded-sm bg-gray-300 outline-none">{page}</button>
                        </>
                    )}
                    <p>...</p>
                    <button
                        onClick={() => makePage(500)}
                        className={`py-1 px-2 rounded-sm ${page === 500 ? 'bg-gray-300' : ''} outline-none`}
                    >
                        500
                    </button>
                </span>
                <button
                    onClick={() => changePage(+1)}
                    disabled={page === 500}
                    className="px-3 rounded-md py-1 outline-none bg-sec-color trans hover:bg-third-color text-white font-semibold"
                >
                    {'>'}
                </button>
            </div>
        </>
    );
};

export default PopularPeoplePage;
