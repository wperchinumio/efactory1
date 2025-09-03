import React, { useEffect, useState, useRef } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Link from 'next/link';
import {
    profile_av,
} from '/public/images';
import {
    IconDots,
    IconGitMerge,
    IconHeart,
    IconTrash,
    IconUsersGroup,
    IconX,
} from '@tabler/icons-react';
import MyContact from './MyContact';
import MyGroup from './MyGroup';
import Favourite from './Favourite';
import MergeFix from './MergeFix';
import Trash from './Trash';
import Image from 'next/image';

export default function Contact() {

    const [addContactModal, setAddContactModal] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [adminMenu, setAdminMenu] = useState(false)

    const openAddContactModal = () => {
        setAddContactModal(!addContactModal)
    }
    useEffect(() => {
        document.body.classList[addContactModal ? "add" : "remove"]("overflow-hidden")
    }, [addContactModal])

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "My Contact",
        },
    ]


    const toggleAdminMenu = () => {
        setAdminMenu(!adminMenu)
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setAdminMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <Tabs>
                    <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                        <div className='md:p-6 p-4 flex items-center gap-2 sm:justify-between justify-center border-b border-border-color'>
                            <div className='flex items-center gap-6 sm:flex-row flex-col'>
                                <Image src={profile_av} alt='user profile' width="90" height="90" className='w-[90px] h-[90px] min-w-[90px] object-cover rounded-xl' />
                                <div className='sm:text-start text-center'>
                                    <p className='text-[20px]/[26px] font-medium text-primary'>
                                        Allie Grater
                                    </p>
                                    <p className='mb-1 text-font-color-100'>
                                        alliegrater@luno.com
                                    </p>
                                    <span className="text-danger text-[14px]/[20px]">Last update: 22 Dec 2022</span>
                                </div>
                            </div>
                            <div className='items-center gap-6 sm:flex hidden'>
                                <button onClick={openAddContactModal} className='btn btn-primary md:!inline-flex !hidden'>
                                    Add Contact
                                </button>
                                <div className="relative">
                                    <button ref={buttonRef} onClick={toggleAdminMenu} className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                        <IconDots className='w-[20px] h-[20px]' />
                                    </button>
                                    <ul ref={menuRef} className={`bg-card-color text-font-color z-[1] rounded-xl w-[180px] shadow-shadow-lg absolute end-0 top-full origin-top-right transition-all duration-300 ${adminMenu ? ' opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                File Info
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                Copy to
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                Move to
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                Rename
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                Block
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                                Delete
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <TabList className="flex flex-wrap sm:px-6 px-2 pt-2 relative sm:justify-start justify-center">
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 sm:px-4 px-3 sm:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                My Contact
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 sm:px-4 px-3 sm:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconUsersGroup className='w-[18px] h-[18px]' />
                                <span className='sm:block hidden'>
                                    My Group
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 sm:px-4 px-3 sm:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconHeart className='w-[18px] h-[18px]' />
                                <span className='md:block hidden'>
                                    Favorite
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 sm:px-4 px-3 sm:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconGitMerge className='w-[18px] h-[18px]' />
                                <span className='md:block hidden'>
                                    Merge & Fix
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 sm:px-4 px-3 sm:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconTrash className='w-[18px] h-[18px]' />
                                <span className='sm:block hidden'>
                                    Trash
                                </span>
                            </Tab>
                        </TabList>
                    </div>
                    <div className='mt-6'>
                        <TabPanel>
                            <MyContact />
                        </TabPanel>
                        <TabPanel>
                            <MyGroup />
                        </TabPanel>
                        <TabPanel>
                            <Favourite />
                        </TabPanel>
                        <TabPanel>
                            <MergeFix />
                        </TabPanel>
                        <TabPanel>
                            <Trash />
                        </TabPanel>
                    </div>
                </Tabs>
                {addContactModal &&
                    <>
                        <div className={`fixed p-15 w-full max-w-[650px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='p-4 flex gap-5 justify-between border-b border-border-color'>
                                    <p className='text-[20px]/[26px] font-medium'>
                                        Add new Conatct
                                    </p>
                                    <button onClick={openAddContactModal} className=''>
                                        <IconX />
                                    </button>
                                </div>
                                <div className='py-10 md:px-10 px-[7px] '>
                                    <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                        <div className='form grid grid-cols-12 md:gap-6 gap-4'>
                                            <div className="form-control sm:col-span-6 col-span-12">
                                                <label htmlFor="firstName" className="form-label">
                                                    First Name
                                                </label>
                                                <input type="text" id="firstName" placeholder='First Name' className="form-input" />
                                            </div>
                                            <div className="form-control sm:col-span-6 col-span-12">
                                                <label htmlFor="lastName" className="form-label">
                                                    Last Name
                                                </label>
                                                <input type="text" id="lastName" placeholder='Last Name' className="form-input" />
                                            </div>
                                            <div className="form-control col-span-12">
                                                <label htmlFor="emailAddress" className="form-label">
                                                    Email Address
                                                </label>
                                                <input type="text" id="emailAddress" placeholder='Email Address' className="form-input" />
                                            </div>
                                            <div className="form-control col-span-12">
                                                <label htmlFor="mobile" className="form-label">
                                                    Mobile
                                                </label>
                                                <div className="flex items-stretch">
                                                    <input type="number" id="mobile" placeholder='Mobile' className="form-input !rounded-e-none" />
                                                    <select className="form-select cursor-pointer rounded-e-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                        <option defaultValue="">Mobile</option>
                                                        <option value="1">Work</option>
                                                        <option value="2">Home</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 flex items-stretch justify-end gap-5 border-t border-border-color'>
                                    <button onClick={openAddContactModal} className='btn btn-secondary'>
                                        Close
                                    </button>
                                    <button className='btn btn-primary'>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div onClick={openAddContactModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
            </div>
        </div>
    );
}
