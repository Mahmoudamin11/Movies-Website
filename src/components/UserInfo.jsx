import { AsyncImage } from 'loadable-image';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Blur } from 'transitions-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import UserList from './UserList';

const UserInfo = memo(() => {
    const user = useSelector((state) => state.user.user);
    const [userList, setuserList] = useState(false);
    const userInfo = useRef(null);
    const toggleUserList = () => { 
        setuserList(!userList);
    }
    const closeList = useCallback(() => { 
        setuserList(false);
    }, [userList])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userInfo.current && !userInfo.current.contains(e.target)) {
                closeList();
            }
        };

        document.body.addEventListener('click', handleClickOutside);

        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <button ref={userInfo}  className='relative outline-none text-white cursor-pointer trans'>
            
            { 
                !user.photoURL ? <div onClick={toggleUserList} className='outline-none flex gap-3 w-fit items-center py-1 trans cursor-pointer bg-[#282856] hover:bg-[#3e3e7d] rounded-md px-5'>
                    <div className='flex items-center justify-center w-10 h-10  trans rounded-full bg-white'>
                        <FontAwesomeIcon icon={faUser} className='text-[20px] text-sec-color' />
                    </div>
                    <FontAwesomeIcon icon={faAngleDown} className={`w-fit text-lg ${userList ? "rotate-[180deg]" : "rotate-0"} trans`} />
                </div>
                : <div onClick={toggleUserList}  className='outline-none flex gap-3 w-fit items-center py-1 trans cursor-pointer bg-[#282856] hover:bg-[#3e3e7d] rounded-md px-5'>
                    <div className='flex items-center justify-center w-10 h-10  trans rounded-full bg-white'>
                        <AsyncImage
                            src={user?.photoURL}
                            Transition={Blur}
                            style={{ width: '100%', height: '100%', borderRadius: "100%", objectFit: 'cover' }}
                            loader={<div className=' animate-pulse' style={{ background: 'var(--third-color)' }} />}
                        />
                    </div>
                    <FontAwesomeIcon icon={faAngleDown} className={`w-fit text-lg ${userList ? "rotate-[180deg]" : "rotate-0"} trans`} />
                </div>    
            }
            {userList && <UserList closeList={toggleUserList} />}
        </button>
    )
})

export default UserInfo