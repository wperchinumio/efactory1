import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { SlideshowLightbox } from 'lightbox.js-react'
import {
    IconBrandYoutube,
    IconCaretDownFilled,
    IconPhoto,
    IconPlayerPlayFilled,
    IconSearch,
    IconStarFilled,
    IconX,
} from '@tabler/icons-react';
import {
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    gallery10,
    gallery13,
} from '/public/images'
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {

    const [searchVideoModal, setSearchVideoModal] = useState(false)
    const openSearchVideoModal = () => {
        setSearchVideoModal(!searchVideoModal)
    }
    useEffect(() => {
        document.body.classList[searchVideoModal ? "add" : "remove"]("overflow-hidden")
    }, [searchVideoModal])

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Search Page",
        },
    ]

    const galleryPhotos = [
        {
            image: gallery1,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery2,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery3,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery4,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery5,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery6,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery7,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery8,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery9,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
        {
            image: gallery10,
            title: "Images card title",
            content: "Some quick example text to build on the card title of the card's content.",
        },
    ]

    const galleryVideos = [
        {
            image: gallery3,
        },
        {
            image: gallery5,
        },
        {
            image: gallery1,
        },
        {
            image: gallery13,
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <Tabs>
                    <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                        <div className='md:p-6 p-4'>
                            <div className="form-control flex">
                                <input type="text" className="form-input !rounded-e-none" placeholder="Search here..." />
                                <button className="btn btn-primary !rounded-s-none" type="button">
                                    Search
                                </button>
                            </div>
                            <small className='font-light mt-1 inline-block'>
                                About 6,000 results (0.60 seconds)
                            </small>
                        </div>
                        <TabList className="flex flex-wrap md:px-6 px-4 pt-2 gap-y-2 relative justify-start border-t border-border-color">
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconSearch className='w-[18px] h-[18px] sm:block hidden' />
                                All
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconPhoto className='w-[18px] h-[18px] sm:block hidden' />
                                <span>
                                    Image
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconBrandYoutube className='w-[18px] h-[18px] sm:block hidden' />
                                <span>
                                    Video
                                </span>
                            </Tab>
                            <div className='relative group'>
                                <div className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0">
                                    <span>
                                        More
                                    </span>
                                    <IconCaretDownFilled className='w-[18px] h-[18px]' />
                                </div>
                                <div className='bg-card-color text-font-color rounded-xl overflow-auto max-h-[50svh] custom-scrollbar w-[200px] shadow-shadow-lg absolute right-0 top-full origin-top-right z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100'>
                                    <ul>
                                        <li className='py-2 px-4 transition-all hover:bg-primary-10'>
                                            <Link href="#" className='flex items-center gap-2'>
                                                Action
                                            </Link>
                                        </li>
                                        <li className='py-2 px-4 transition-all hover:bg-primary-10'>
                                            <Link href="#" className='flex items-center gap-2'>
                                                Another Action
                                            </Link>
                                        </li>
                                        <li className='py-2 px-4 transition-all hover:bg-primary-10'>
                                            <Link href="#" className='flex items-center gap-2'>
                                                Something Else Here
                                            </Link>
                                        </li>
                                        <li className='py-2 px-4 border-t border-border-color transition-all hover:bg-primary-10'>
                                            <Link href="#" className='flex items-center gap-2'>
                                                Separated Link
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </TabList>
                    </div>
                    <div className='card my-6 md:p-6 p-4 bg-card-color rounded-xl border border-dashed border-border-color'>
                        <TabPanel>
                            <ul>
                                <li className='md:pb-6 pb-4 md:mb-6 mb-4 border-b border-border-color last:mb-0'>
                                    <p className='mb-1'>
                                        https://alui.luno-edu.com/index.html
                                    </p>
                                    <Link href="#" className='mb-2 inline-block md:text-[20px]/[24px] text-[18px]/[22px] font-light text-primary transition-all hover:text-secondary'>
                                        LUNO - Bootstrap 5 Responsive Admin Dashboard Theme
                                    </Link>
                                    <p className='text-font-color-100 mb-4'>
                                        Boost your project with powerful LUNO admin dashboard template that is tailored to fit every company's needs.
                                    </p>
                                    <div className='flex items-center flex-wrap md:gap-x-6 gap-x-4 text-font-color-100'>
                                        <div className='flex items-center gap-1'>
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            5 : stars
                                        </div>
                                        <div>
                                            25,292 votes
                                        </div>
                                        <div>
                                            React/Vue/Angular
                                        </div>
                                    </div>
                                </li>
                                <li className='md:pb-6 pb-4 md:mb-6 mb-4 border-b border-border-color last:mb-0'>
                                    <p className='mb-1'>
                                        https://luno-edu.info/
                                    </p>
                                    <Link href="#" className='mb-2 inline-block md:text-[20px]/[24px] text-[18px]/[22px] font-light text-primary transition-all hover:text-secondary'>
                                        Lucid ASP .NET Core MVC - Responsive Admin Template
                                    </Link>
                                    <p className='text-font-color-100 mb-4'>
                                        LUNO introduces a IELTS Coaching, TOEFL Coaching, GRE Coaching, GMAT Coaching, SAT Coaching in City.
                                    </p>
                                    <div className='flex items-center flex-wrap md:gap-x-6 gap-x-4 text-font-color-100'>
                                        <div className='flex items-center gap-1'>
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            4.9 : stars
                                        </div>
                                        <div>
                                            25,292 votes
                                        </div>
                                        <div>
                                            Free
                                        </div>
                                        <div>
                                            Business/Productivity
                                        </div>
                                    </div>
                                </li>
                                <li className='md:pb-6 pb-4 md:mb-6 mb-4 border-b border-border-color last:mb-0'>
                                    <p className='mb-1'>
                                        https://luno-edu.info/
                                    </p>
                                    <Link href="#" className='mb-2 inline-block md:text-[20px]/[24px] text-[18px]/[22px] font-light text-primary transition-all hover:text-secondary'>
                                        Lucid - Angular Admin Template
                                    </Link>
                                    <p className='text-font-color-100 mb-4'>
                                        LUNO introduces a IELTS Coaching, TOEFL Coaching, GRE Coaching, GMAT Coaching, SAT Coaching in City.
                                    </p>
                                    <div className='flex items-center flex-wrap md:gap-x-6 gap-x-4 text-font-color-100'>
                                        <div className='flex items-center gap-1'>
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            4.9 : stars
                                        </div>
                                        <div>
                                            25,292 votes
                                        </div>
                                        <div>
                                            Free
                                        </div>
                                        <div>
                                            Business/Productivity
                                        </div>
                                    </div>
                                </li>
                                <li className='md:pb-6 pb-4 md:mb-6 mb-4 border-b border-border-color last:mb-0'>
                                    <p className='mb-1'>
                                        https://luno-edu.info/
                                    </p>
                                    <Link href="#" className='mb-2 inline-block md:text-[20px]/[24px] text-[18px]/[22px] font-light text-primary transition-all hover:text-secondary'>
                                        Lucid - HR and Project Management Admin Dashboard Template Bootstrap 5 & 4
                                    </Link>
                                    <p className='text-font-color-100 mb-4'>
                                        LUNO introduces a IELTS Coaching, TOEFL Coaching, GRE Coaching, GMAT Coaching, SAT Coaching in City.
                                    </p>
                                    <div className='flex items-center flex-wrap md:gap-x-6 gap-x-4 text-font-color-100'>
                                        <div className='flex items-center gap-1'>
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            <IconStarFilled className='w-[16px] h-[16px] fill-warning' />
                                            4.9 : stars
                                        </div>
                                        <div>
                                            25,292 votes
                                        </div>
                                        <div>
                                            Free
                                        </div>
                                        <div>
                                            Business/Productivity
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </TabPanel>
                        <TabPanel>
                            {/* <SlideshowLightbox showThumbnails lightboxIdentifier="searchImage" images={galleryPhotos} onOpen={() => { document.body.classList.add("overflow-hidden") }} onClose={() => { document.body.classList.remove("overflow-hidden") }} className="grid xxl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4"> */}
                            <div showThumbnails lightboxIdentifier="searchImage" images={galleryPhotos} onOpen={() => { document.body.classList.add("overflow-hidden") }} onClose={() => { document.body.classList.remove("overflow-hidden") }} className="grid xxl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                                {galleryPhotos.map((item, key) => (
                                    <div key={key} className='border border-dashed border-border-color rounded-xl'>
                                        <Image src={item.image} data-lightboxjs="searchImage" alt="gallery" className="rounded-t-xl w-full" />
                                        <div className='sm:p-4 p-3'>
                                            <h6 className='mb-2 font-semibold leading-none'>
                                                {item.title}
                                            </h6>
                                            <p className='small text-font-color-100'>
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* </SlideshowLightbox> */}
                        </TabPanel>
                        <TabPanel>
                            <div className="grid sm:grid-cols-3 ssm:grid-cols-2 gap-4">
                                {galleryVideos.map((item, key) => (
                                    <div key={key} className='rounded-xl overflow-hidden relative group after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-black-50 after:hidden hover:after:block'>
                                        <Link href="#" onClick={openSearchVideoModal} className='w-[48px] h-[48px] min-w-[48px] rounded-full bg-primary items-center justify-center text-white z-[1] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] transition-all hover:bg-secondary hidden group-hover:inline-flex'>
                                            <IconPlayerPlayFilled />
                                        </Link>
                                        <Image src={item.image} alt="gallery" className="w-full" />
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                    </div>
                </Tabs>
                <div>
                    <button className='py-[6px] px-3 border border-border-color rounded-s-full bg-primary text-white transition-all hover:bg-primary hover:text-white'>
                        1
                    </button>
                    <button className='py-[6px] px-3 border-y border-e border-border-color bg-card-color transition-all hover:bg-primary hover:text-white'>
                        2
                    </button>
                    <button className='py-[6px] px-3 border-y border-border-color bg-card-color transition-all hover:bg-primary hover:text-white'>
                        3
                    </button>
                    <button className='py-[6px] px-3 border border-border-color rounded-e-full bg-card-color transition-all hover:bg-primary hover:text-white'>
                        Next
                    </button>
                </div>
                {searchVideoModal &&
                    <>
                        <div className={`fixed p-15 w-full max-w-[800px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='p-4 flex gap-5 justify-between border-b border-border-color'>
                                    <p className='text-[20px]/[26px] font-medium'>
                                        Video Preview
                                    </p>
                                    <button onClick={openSearchVideoModal} className=''>
                                        <IconX />
                                    </button>
                                </div>
                                <div className='py-10 md:px-10 px-[7px] '>
                                    <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                        <iframe title='Search Video' className="rounded-xl w-full aspect-video" src="https://www.youtube.com/embed/9_PV-f87xPw" frameborder="0" allowfullscreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={openSearchVideoModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
            </div>
        </div>
    )
}
