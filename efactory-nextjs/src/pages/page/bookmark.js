import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import {
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    profile_av,
} from '/public/images'
import {
    IconChevronRight,
    IconDots,
    IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Bookmark() {

    const [createBookmarkModal, setCreateBookmarkModal] = useState(false)
    const openCreateBookmarkModal = () => {
        setCreateBookmarkModal(!createBookmarkModal)
    }
    useEffect(() => {
        document.body.classList[createBookmarkModal ? "add" : "remove"]("overflow-hidden")
    }, [createBookmarkModal])

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Bookmarks",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <Tabs>
                    <div className='card bg-card-color rounded-xl grid xxl:grid-cols-[1fr_3fr] lg:grid-cols-[1.5fr_3fr] grid-cols-1 border border-dashed border-border-color'>
                        <TabList className="lg:border-r lg:border-b-0 border-b border-border-color">
                            <div className='md:p-6 p-4 border-b border-border-color'>
                                <Image src={profile_av} width="90" height="90" alt="user profile" className="w-[90px] h-[90px] min-w-[90px] p-1 border border-border-color rounded-full"></Image>
                                <h6 className="mt-4 font-semibold">Michelle Green</h6>
                                <p>jason-porter@info.com</p>
                                <button onClick={openCreateBookmarkModal} className='btn btn-secondary mt-4'>
                                    Create Bookmark
                                </button>
                            </div>
                            <div className='md:p-6 p-4 border-b border-border-color'>
                                <p className='mb-4'>
                                    Bookmark List
                                </p>
                                <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] text-primary rounded-md transition-all hover:bg-primary-10 focus:outline-0" selectedClassName='!bg-primary text-white'>
                                    <IconChevronRight className='w-[16px] h-[16px] rtl:rotate-180' />
                                    Created by me
                                </Tab>
                                <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] text-primary rounded-md transition-all hover:bg-primary-10 focus:outline-0" selectedClassName='!bg-primary text-white'>
                                    <IconChevronRight className='w-[16px] h-[16px] rtl:rotate-180' />
                                    Favourites
                                </Tab>
                                <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] text-primary rounded-md transition-all hover:bg-primary-10 focus:outline-0" selectedClassName='!bg-primary text-white'>
                                    <IconChevronRight className='w-[16px] h-[16px] rtl:rotate-180' />
                                    Admin Template
                                </Tab>
                                <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] text-primary rounded-md transition-all hover:bg-primary-10 focus:outline-0" selectedClassName='!bg-primary text-white'>
                                    <IconChevronRight className='w-[16px] h-[16px] rtl:rotate-180' />
                                    My bookmark
                                </Tab>
                            </div>
                            <div className='md:p-6 p-4'>
                                <p className='md:mb-4 mb-2'>
                                    Bookmark Tags
                                </p>
                                <ul className='flex flex-wrap gap-4'>
                                    <li>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>#bigdata</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>#design</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>#reactjs</Link>
                                    </li>
                                </ul>
                            </div>
                        </TabList>
                        <div className='md:p-6 p-4'>
                            <TabPanel>
                                <h5 className='text-[20px]/[24px] font-medium'>
                                    Created by me
                                </h5>
                                <ul className='mt-4 flex flex-col gap-1'>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery1} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                LUNO - Bootstrap 5 Responsive Admin Dashboard Theme
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery2} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                BigBucket - Bootstrap 4x Admin Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery3} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Lucid ASP .NET Core MVC - Responsive Admin Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery4} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Lucid - VueJS Admin Template & Webapp kit
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                I have been a Personal trainer for 2 years building a women's fitness company Bootcamp company in 2018.
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery5} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Amaze - Multipurpose Admin Template ui kit
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                </ul>
                            </TabPanel>
                            <TabPanel>
                                <h5 className='text-[20px]/[24px] font-medium'>
                                    Favourites
                                </h5>
                                <ul className='mt-4 flex flex-col gap-1'>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery2} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                BigBucket - Bootstrap 4x Admin Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery3} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Lucid ASP .NET Core MVC - Responsive Admin Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                </ul>
                            </TabPanel>
                            <TabPanel>
                                <h5 className='text-[20px]/[24px] font-medium'>
                                    Admin Template
                                </h5>
                                <ul className='mt-4 flex flex-col gap-1'>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery6} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                HexaBit - Responsive Bootstrap Admin Template & UI KIT
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, scrambled it to make a type specimen book
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery7} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Alpino - Bootstrap 4 Admin Dashboard Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                I have been a Personal trainer for 2 years building a women's fitness company Bootcamp company in 2018.
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                </ul>
                            </TabPanel>
                            <TabPanel>
                                <h5 className='text-[20px]/[24px] font-medium'>
                                    My bookmark
                                </h5>
                                <ul className='mt-4 flex flex-col gap-1'>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery3} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Lucid ASP .NET Core MVC - Responsive Admin Template
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery4} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Lucid - VueJS Admin Template & Webapp kit
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                I have been a Personal trainer for 2 years building a women's fitness company Bootcamp company in 2018.
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                    <li className='flex md:items-start md:flex-nowrap flex-wrap md:justify-normal justify-between md:gap-6 gap-4 rounded-xl p-4 border border-dashed border-border-color'>
                                        <Image src={gallery5} alt='bookmark thumbnail' width="120" height="75" className='w-[120px] h-[75px] object-cover rounded-md self-center' />
                                        <div className='md:order-2 order-3 flex-grow'>
                                            <h5 className='sm:text-[20px]/[24px] font-light mb-1'>
                                                Amaze - Multipurpose Admin Template ui kit
                                            </h5>
                                            <Link href="#" className='inline-block text-primary mb-1 transition-all hover:text-secondary'>
                                                https://themeforest.net
                                            </Link>
                                            <p className='text-font-color-100'>
                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature
                                            </p>
                                        </div>
                                        <button className='bg-primary-10 p-[2px] rounded-full text-primary self-start md:order-3 order-2 transition-all hover:bg-primary hover:text-white'>
                                            <IconDots className='w-[18px] h-[18px]' />
                                        </button>
                                    </li>
                                </ul>
                            </TabPanel>
                        </div>
                    </div>
                </Tabs>
                {createBookmarkModal &&
                    <>
                        <div className={`fixed p-15 w-full max-w-[500px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='p-4 flex gap-5 justify-between border-b border-border-color'>
                                    <p className='text-[20px]/[26px] font-medium'>
                                        Add new Bookmark
                                    </p>
                                    <button onClick={openCreateBookmarkModal} className=''>
                                        <IconX />
                                    </button>
                                </div>
                                <div className='py-10 md:px-10 px-[7px]'>
                                    <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                        <div className='form grid grid-cols-1 gap-2'>
                                            <div className='floating-form-control'>
                                                <input type='text' id='bookmarkUrl' className='form-input' placeholder="Bookmark Url" />
                                                <label htmlFor='bookmarkUrl' className='form-label'>Bookmark Url</label>
                                            </div>
                                            <div className='floating-form-control'>
                                                <input type='text' id='bookmarkTitle' className='form-input' placeholder="Bookmark Title" />
                                                <label htmlFor='bookmarkTitle' className='form-label'>Bookmark Title</label>
                                            </div>
                                            <div className='floating-form-control'>
                                                <input type='text' id='bookmarkDescription' className='form-input' placeholder="Description" />
                                                <label htmlFor='bookmarkDescription' className='form-label'>Description</label>
                                            </div>
                                            <div className="floating-form-control">
                                                <select className='form-select'>
                                                    <option defaultValue="">Open this select menu</option>
                                                    <option value="1">Created by me</option>
                                                    <option value="2">Favourites</option>
                                                    <option value="2">Admin Template</option>
                                                    <option value="2">My Bookmark</option>
                                                </select>
                                                <label className='form-label'>Bookmark List</label>
                                            </div>
                                            <div className="floating-form-control">
                                                <select className='form-select'>
                                                    <option defaultValue="">Open this select menu</option>
                                                    <option value="1">UI8</option>
                                                    <option value="2">Themeforest</option>
                                                </select>
                                                <label className='form-label'>Bookmark Tags</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 flex items-stretch justify-end gap-5 border-t border-border-color'>
                                    <button onClick={openCreateBookmarkModal} className='btn btn-secondary'>
                                        Close
                                    </button>
                                    <button className='btn btn-primary'>
                                        Save Bookmark
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div onClick={openCreateBookmarkModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
            </div>
        </div>
    )
}