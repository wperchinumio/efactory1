import { SlideshowLightbox } from 'lightbox.js-react'
import React from 'react'
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    gallery1,
    gallery10,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    profile_av,
} from '/public/images'
import {
    IconBrandLinkedin,
    IconCamera,
    IconCheck,
    IconDots,
    IconMessageCircle2Filled,
    IconMoodSmile,
    IconPaperclip,
    IconPencil,
    IconShare3,
    IconThumbUpFilled,
    IconWorld,
    IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Activity() {

    const latestPhotos = [
        {
            image: gallery1,
        },
        {
            image: gallery2,
        },
        {
            image: gallery3,
        },
        {
            image: gallery4,
        },
        {
            image: gallery5,
        },
        {
            image: gallery6,
        },
        {
            image: gallery7,
        },
        {
            image: gallery8,
        },
        {
            image: gallery9,
        },
    ]

    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                My Activity
            </div>
            <div className='mb-4 md:p-6 p-4 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-start flex-wrap xxl:gap-12 md:gap-6 gap-4 border border-dashed border-border-color'>
                <div className='relative inline-block'>
                    <Image src={profile_av} alt='user profile' width="120" height="120" className='sm:w-[120px] sm:h-[120px] sm:min-w-[120px] w-[80px] h-[80px] min-w-[80px] object-cover sm:rounded-xl rounded-md' />
                    <button className='absolute sm:right-10 sm:bottom-10 right-5 bottom-5 p-5 text-font-color-100 bg-card-color rounded-full'>
                        <input type='file' id='socialProfile' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                        <label htmlFor='socialProfile' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                        <IconPencil className='w-[16px] h-[16px]' />
                    </button>
                </div>
                <div>
                    <p className='text-[20px]/[26px] font-medium mb-1 text-white'>
                        Allie Grater
                    </p>
                    <p className='text-[14px]/[20px] mb-2 text-white'>
                        UI/UX Designer
                    </p>
                    <div className='flex items-stretch flex-wrap gap-2'>
                        <div className='md:py-2 md:px-4 py-1 px-2 card bg-card-color md:rounded-xl rounded-md flex flex-col border border-dashed border-border-color'>
                            <span className='text-[14px]/[20px] text-font-color-100'>
                                Follower
                            </span>
                            <span className='md:text-[20px]/[26px] font-medium'>
                                1705
                            </span>
                        </div>
                        <div className='md:py-2 md:px-4 py-1 px-2 card bg-card-color md:rounded-xl rounded-md flex flex-col border border-dashed border-border-color'>
                            <span className='text-[14px]/[20px] text-font-color-100'>
                                Following
                            </span>
                            <span className='md:text-[20px]/[26px] font-medium'>
                                245
                            </span>
                        </div>
                        <div className='md:py-2 md:px-4 py-1 px-2 card bg-card-color md:rounded-xl rounded-md flex flex-col border border-dashed border-border-color'>
                            <span className='text-[14px]/[20px] text-font-color-100'>
                                Likes
                            </span>
                            <span className='md:text-[20px]/[26px] font-medium'>
                                850
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid lg:grid-cols-[8fr_4fr] md:grid-cols-[7fr_5fr] grid-cols-1 gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className="form-control mb-15 flex flex-col">
                            <textarea className="form-textarea" placeholder="Please type what you want..." rows="3"></textarea>
                        </div>
                        <div className='flex items-center gap-4'>
                            <button className='btn btn-primary'>
                                Post
                            </button>
                            <button className='relative text-blue p-1 transition-all hover:text-primary'>
                                <input type='file' id='socialPostAttach' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                                <label htmlFor='socialPostAttach' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                                <IconPaperclip className='w-[20px] h-[20px]' />
                            </button>
                            <button className='text-font-color-100 p-1'>
                                <IconCamera className='w-[20px] h-[20px]' />
                            </button>
                            <button className='text-font-color-100 p-1'>
                                <IconMoodSmile className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <div className='flex gap-4 items-start'>
                                <Image src={profile_av} alt='profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] object-cover rounded-full' />
                                <div>
                                    <div className='flex gap-x-5 items-center flex-wrap'>
                                        Allie Grater
                                        <span className='text-font-color-100 text-[14px]/[20px]'>
                                            posted a status
                                        </span>
                                    </div>
                                    <div className='text-font-color-100 text-[14px]/[20px]'>
                                        1 hours ago
                                    </div>
                                </div>
                            </div>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <p className='md:mb-4 mb-2 md:text-[20px]/[30px] font-light'>
                            Hampden-Sydney College in Virginia, looked up one of the more obscure
                        </p>
                        <p className='md:mb-4 mb-2 md:text-[20px]/[30px] font-light'>
                            It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock.
                        </p>
                        <div className='mb-2 flex flex-wrap gap-2 text-primary'>
                            <span>
                                #Design
                            </span>
                            <span>
                                #HTML
                            </span>
                            <span>
                                #Luno
                            </span>
                        </div>
                        <div className='mb-4'>
                            <Image src={gallery10} alt='social post' width="822" height="514" className='sm:rounded-xl rounded-md w-full' />
                        </div>
                        <div className='mb-2 flex flex-wrap gap-x-6 gap-y-2 text-primary'>
                            <button className='flex items-center gap-5'>
                                <IconThumbUpFilled className='w-[20px] h-[20px]' />
                                Like (105)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconMessageCircle2Filled className='w-[20px] h-[20px]' />
                                Comment (2)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconShare3 className='w-[20px] h-[20px] fill-primary' />
                                Share (6)
                            </button>
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1'>
                            <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Rose Rivera
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        1 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100'>
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </p>
                            </div>
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Robert Hammer
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        1 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100'>
                                    If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing
                                </p>
                            </div>
                        </div>
                        <div className="form-control flex flex-col">
                            <textarea className="form-textarea !rounded-xl" placeholder="Reply" rows="2"></textarea>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <div className='flex gap-4 items-start'>
                                <Image src={profile_av} alt='profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] object-cover rounded-full' />
                                <div>
                                    <div className='flex gap-x-5 items-center flex-wrap'>
                                        Allie Grater
                                        <span className='text-font-color-100 text-[14px]/[20px]'>
                                            posted a status
                                        </span>
                                    </div>
                                    <div className='text-font-color-100 text-[14px]/[20px]'>
                                        4 hours ago
                                    </div>
                                </div>
                            </div>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <p className='md:mb-4 mb-2 md:text-[20px]/[30px] font-light'>
                            Need a website designer for an online virtual football league, lmk if interested
                        </p>
                        <div className='mb-2 flex flex-wrap gap-2 text-primary'>
                            <span>
                                #Figma
                            </span>
                            <span>
                                #HTML
                            </span>
                            <span>
                                #SCSS
                            </span>
                        </div>
                        <div className='mb-2 flex flex-wrap gap-x-6 gap-y-2 text-primary'>
                            <button className='flex items-center gap-5'>
                                <IconThumbUpFilled className='w-[20px] h-[20px]' />
                                Like (105)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconMessageCircle2Filled className='w-[20px] h-[20px]' />
                                Comment (2)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconShare3 className='w-[20px] h-[20px] fill-primary' />
                                Share (6)
                            </button>
                        </div>
                        <div className="form-control flex flex-col">
                            <textarea className="form-textarea !rounded-xl" placeholder="Reply" rows="2"></textarea>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <div className='flex gap-4 items-start'>
                                <Image src={profile_av} alt='profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] object-cover rounded-full' />
                                <div>
                                    <div className='flex gap-x-5 items-center flex-wrap'>
                                        Allie Grater
                                        <span className='text-font-color-100 text-[14px]/[20px]'>
                                            posted a status
                                        </span>
                                    </div>
                                    <div className='text-font-color-100 text-[14px]/[20px]'>
                                        5 hours ago
                                    </div>
                                </div>
                            </div>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <p className='md:mb-4 mb-2 md:text-[20px]/[30px] font-light'>
                            Let's exchange our gigs
                        </p>
                        <ul className='mb-4 list-[circle] font-light ps-6'>
                            <li>
                                Open My Gig
                            </li>
                            <li>
                                Swap Gig Images
                            </li>
                            <li>
                                Save My Gig
                            </li>
                            <li>
                                Then send me ss and I will do same promise
                            </li>
                        </ul>
                        <div className='mb-2 flex flex-wrap gap-2 text-primary'>
                            <span>
                                #Figma
                            </span>
                            <span>
                                #HTML
                            </span>
                            <span>
                                #SCSS
                            </span>
                        </div>
                        <div className='mb-2 flex flex-wrap gap-x-6 gap-y-2 text-primary'>
                            <button className='flex items-center gap-5'>
                                <IconThumbUpFilled className='w-[20px] h-[20px]' />
                                Like (105)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconMessageCircle2Filled className='w-[20px] h-[20px]' />
                                Comment (2)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconShare3 className='w-[20px] h-[20px] fill-primary' />
                                Share (6)
                            </button>
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1'>
                            <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Rose Rivera
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        3 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100 mb-4'>
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </p>
                                <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl'>
                                    <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 justify-between'>
                                            <p className='truncate'>
                                                Andew Jon
                                            </p>
                                            <span className='text-[14px]/[20px] text-font-color-100'>
                                                1 hour ago
                                            </span>
                                        </div>
                                        <p className='text-font-color-100'>
                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Robert Hammer
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        1 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100'>
                                    If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing
                                </p>
                            </div>
                        </div>
                        <div className="form-control flex flex-col">
                            <textarea className="form-textarea !rounded-xl" placeholder="Reply" rows="2"></textarea>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <div className='flex gap-4 items-start'>
                                <Image src={profile_av} alt='profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] object-cover rounded-full' />
                                <div>
                                    <div className='flex gap-x-5 items-center flex-wrap'>
                                        Allie Grater
                                        <span className='text-font-color-100 text-[14px]/[20px]'>
                                            posted a status
                                        </span>
                                    </div>
                                    <div className='text-font-color-100 text-[14px]/[20px]'>
                                        6 hours ago
                                    </div>
                                </div>
                            </div>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <p className='md:mb-4 mb-2 md:text-[20px]/[30px] font-light'>
                            I need a website developer designer and React, Angular, Laravel asap
                        </p>
                        <div className='mb-2 flex flex-wrap gap-2 text-primary'>
                            <span>
                                #ReactJS
                            </span>
                            <span>
                                #Laravel
                            </span>
                            <span>
                                #Angular
                            </span>
                        </div>
                        <div className='mb-2 flex flex-wrap gap-x-6 gap-y-2 text-primary'>
                            <button className='flex items-center gap-5'>
                                <IconThumbUpFilled className='w-[20px] h-[20px]' />
                                Like (105)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconMessageCircle2Filled className='w-[20px] h-[20px]' />
                                Comment (2)
                            </button>
                            <button className='flex items-center gap-5'>
                                <IconShare3 className='w-[20px] h-[20px] fill-primary' />
                                Share (6)
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-5 mb-4'>
                            <Image src={gallery1} width="110" height="69" alt='chat attachment' className='sm:rounded-xl rounded-md' />
                            <Image src={gallery2} width="110" height="69" alt='chat attachment' className='sm:rounded-xl rounded-md' />
                            <Image src={gallery3} width="110" height="69" alt='chat attachment' className='sm:rounded-xl rounded-md' />
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1'>
                            <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Rose Rivera
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        3 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100'>
                                    Yes available
                                </p>
                            </div>
                        </div>
                        <div className='border border-dashed border-border-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 justify-between'>
                                    <p className='truncate'>
                                        Robert Hammer
                                    </p>
                                    <span className='text-[14px]/[20px] text-font-color-100'>
                                        1 hour ago
                                    </span>
                                </div>
                                <p className='text-font-color-100'>
                                    Intrested
                                </p>
                            </div>
                        </div>
                        <div className="form-control flex flex-col">
                            <textarea className="form-textarea !rounded-xl" placeholder="Reply" rows="2"></textarea>
                        </div>
                    </div>
                    <div>
                        <button className='py-[6px] px-3 border border-border-color rounded-s-full bg-card-color transition-all hover:bg-primary hover:text-white'>
                            Previous
                        </button>
                        <button className='py-[6px] px-3 border-y border-e border-border-color bg-card-color transition-all hover:bg-primary hover:text-white'>
                            1
                        </button>
                        <button className='py-[6px] px-3 border-y border-e border-border-color bg-primary text-white transition-all hover:bg-primary hover:text-white'>
                            2
                        </button>
                        <button className='py-[6px] px-3 border-y border-border-color bg-card-color transition-all hover:bg-primary hover:text-white'>
                            3
                        </button>
                        <button className='py-[6px] px-3 border border-border-color rounded-e-full bg-card-color transition-all hover:bg-primary hover:text-white'>
                            Next
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 flex-wrap mb-6'>
                            <p className='font-semibold'>
                                Connection Request
                            </p>
                            <span className='inline-block py-1 px-2 rounded-md bg-primary text-white text-[12px]/[1] font-bold'>
                                20 min ago
                            </span>
                        </div>
                        <div className='flex gap-4 mb-6'>
                            <Image src={profile_av} alt='profile' width="56" height="56" className='w-[56px] h-[56px] min-w-[56px] object-cover rounded-md' />
                            <div>
                                <p className='text-[20px]/[24px] font-medium mb-1'>
                                    Hossein Shams
                                </p>
                                <p className='text-font-color-100'>
                                    21 mutual connections
                                </p>
                            </div>
                        </div>
                        <div className='flex gap-2 items-stretch'>
                            <button className='btn btn-success w-full'>
                                <IconCheck className='w-[18px] h-[18px] stroke-[3]' />
                                Accept
                            </button>
                            <button className='btn btn-danger w-full'>
                                <IconX className='w-[18px] h-[18px] stroke-[3]' />
                                Ignore
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <p className='font-semibold mb-4'>
                            Personal Information
                        </p>
                        <p className='text-font-color-100 mb-4'>
                            Hi I'm Allie Grater, Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.
                        </p>
                        <ul className='flex flex-col gap-4'>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    Full Name :
                                </span>
                                Allie Grater
                            </li>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    E-mail :
                                </span>
                                alliegrater@luno.com
                            </li>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    Phone :
                                </span>
                                +01 (741) 852 123
                            </li>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    Location :
                                </span>
                                California, USA
                            </li>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    Website :
                                </span>
                                http://website.com
                            </li>
                            <li className='flex items-start flex-wrap'>
                                <span className='w-100 inline-block text-font-color-100 me-2'>
                                    Social :
                                </span>
                                <div className='gap-2 inline-flex'>
                                    <Link href="#" className='bg-primary text-white rounded w-[24px] h-[24px] min-w-[24px] inline-flex items-center justify-center transition-all hover:bg-secondary'>
                                        <IconWorld className='w-[18px] h-[18px]' />
                                    </Link>
                                    <Link href="#" className='bg-primary text-white rounded w-[24px] h-[24px] min-w-[24px] inline-flex items-center justify-center transition-all hover:bg-secondary'>
                                        <IconBrandLinkedin className='w-[18px] h-[18px]' />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <p className='font-semibold'>
                                Friends
                            </p>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <div className="flex flex-wrap">
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar1} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar2} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar3} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar4} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar5} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar6} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar7} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar8} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar9} title="Avatar Name" alt="User Profile" width="36" height="36" />
                            <Image className="w-[36px] h-[36px] min-w-[36px] rounded-full m-1 transition-all hover:translate-y-[-3px]" src={avatar10} title="Avatar Name" alt="User Profile" width="36" height="36" />
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <p className='font-semibold'>
                                Followers
                            </p>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <ul className='flex flex-col gap-1'>
                            <li className='border border-dashed border-border-color p-4 flex gap-4 rounded-xl mb-1'>
                                <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                <div className='flex-1'>
                                    <p>
                                        Chris Fox
                                    </p>
                                    <p className='text-font-color-100 text-[14px]/[20px]'>
                                        21 mutual connections
                                    </p>
                                </div>
                            </li>
                            <li className='border border-dashed border-border-color p-4 flex gap-4 rounded-xl mb-1'>
                                <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                <div className='flex-1'>
                                    <p>
                                        Marshall Nichols
                                    </p>
                                    <p className='text-font-color-100 text-[14px]/[20px]'>
                                        5 mutual connections
                                    </p>
                                </div>
                            </li>
                            <li className='border border-dashed border-border-color p-4 flex gap-4 rounded-xl mb-1'>
                                <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                <div className='flex-1'>
                                    <p>
                                        Orlando Lentz
                                    </p>
                                    <p className='text-font-color-100 text-[14px]/[20px]'>
                                        9 mutual connections
                                    </p>
                                </div>
                            </li>
                            <li className='border border-dashed border-border-color p-4 flex gap-4 rounded-xl mb-1'>
                                <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                <div className='flex-1'>
                                    <p>
                                        Alexander
                                    </p>
                                    <p className='text-font-color-100 text-[14px]/[20px]'>
                                        18 mutual connections
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <p className='font-semibold'>
                                Labels
                            </p>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                Family
                            </button>
                            <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-primary transition-all hover:text-secondary hover:border-secondary'>
                                Home
                            </button>
                            <button className='rounded-md text-white py-1 px-4 text-[14px]/[20px] border border-primary bg-primary'>
                                UI/UX Designer
                            </button>
                            <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                ReactJS
                            </button>
                            <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                Angular
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <p className='font-semibold'>
                                Latest Photos
                            </p>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <SlideshowLightbox showThumbnails lightboxIdentifier="galleryPhotos" onOpen={() => { document.body.classList.add("overflow-hidden") }} onClose={() => { document.body.classList.remove("overflow-hidden") }} className="grid grid-cols-3 gap-1">
                            {latestPhotos.map((item, key) => (
                                <Image key={key} src={item.image.src} data-lightboxjs="galleryPhotos" alt='gallery' width={500} height={500} className="rounded-md w-full" />
                            ))}
                        </SlideshowLightbox>
                    </div>
                </div>
            </div>
        </>
    )
}
