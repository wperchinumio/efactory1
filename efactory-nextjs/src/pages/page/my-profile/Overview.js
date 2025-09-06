import { React, useState, useEffect, useRef } from 'react'
import { SlideshowLightbox } from 'lightbox.js-react'
import {
    IconBrandLinkedin,
    IconCamera,
    IconDots,
    IconMessageCircle2Filled,
    IconMusic,
    IconShare3,
    IconStar,
    IconStarFilled,
    IconThumbUpFilled,
    IconVideo,
    IconWorld,
} from '@tabler/icons-react'
import {
    gallery1,
    avatar2,
    avatar3,
    gallery4,
    gallery5,
    gallery6,
    avatar7,
    gallery8,
    gallery9,
    gallery11,
    gallery2,
    gallery3,
    gallery7,
    profile_av,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function Overview() {

    const [adminMenu, setAdminMenu] = useState(false)
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

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
        <>
            <h5 className='text-[20px]/[24px] font-medium mb-4'>
                Profile Overview
            </h5>
            <div className='grid grid-cols-12 gap-4'>
                <div className='flex flex-col gap-4 xxl:col-span-3 lg:col-span-4 col-span-12'>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <h6 className='font-semibold mb-4'>
                            Personal Information
                        </h6>
                        <p className='text-font-color-100 mb-4'>
                            Hi I'm Allie Grater, Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.
                        </p>
                        <ul className='flex flex-col gap-2'>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    Full Name :
                                </span>
                                Allie Grater
                            </li>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    E-mail :
                                </span>
                                alliegrater@luno.com
                            </li>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    Phone :
                                </span>
                                +01 (741) 852 123
                            </li>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    Location :
                                </span>
                                California, USA
                            </li>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    Website :
                                </span>
                                http://website.com
                            </li>
                            <li className='flex gap-x-2 flex-wrap'>
                                <span className='w-[90px] text-font-color-100'>
                                    Social :
                                </span>
                                <div className='flex gap-2'>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        <IconWorld className='w-[20px] h-[20px]' />
                                    </Link>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        <IconBrandLinkedin className='w-[20px] h-[20px]' />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <h6 className='font-semibold mb-4'>
                            Skills Information
                        </h6>
                        <p className='text-font-color-100 mb-4'>
                            Augue mauris dignissim arcu, ut venenatis metus ante eu orci. Donec non maximus neque, ut finibus ex. <Link href="#" className='text-primary transition-all hover:text-secondary'>Read more</Link>
                        </p>
                        <ul className='flex flex-col gap-4'>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        HTML5
                                    </small>
                                    <small>
                                        77
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[77%] bg-chart-color2 h-full"></div>
                                </div>
                            </li>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        CSS3
                                    </small>
                                    <small>
                                        85
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[85%] bg-chart-color5 h-full"></div>
                                </div>
                            </li>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        BOOTSTRAP
                                    </small>
                                    <small>
                                        95
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[95%] bg-chart-color1 h-full"></div>
                                </div>
                            </li>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        Tailwind
                                    </small>
                                    <small>
                                        90
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[90%] bg-success h-full"></div>
                                </div>
                            </li>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        RESPONSIVE
                                    </small>
                                    <small>
                                        80
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[80%] bg-chart-color4 h-full"></div>
                                </div>
                            </li>
                            <li>
                                <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                    <small>
                                        Javascript
                                    </small>
                                    <small>
                                        66
                                    </small>
                                </div>
                                <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                    <div className="progress-bar w-[66%] bg-chart-color3 h-full"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col gap-4 xxl:col-span-6 lg:col-span-8 col-span-12'>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <div className="form-control mb-15 flex flex-col">
                            <textarea className="form-textarea" placeholder="Please type what you want..." rows="3"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                <button className='p-1 text-primary'>
                                    <IconCamera className='w-[20px] h-[20px]' />
                                </button>
                                <button className='p-1 text-primary'>
                                    <IconVideo className='w-[20px] h-[20px]' />
                                </button>
                                <button className='p-1 text-primary'>
                                    <IconMusic className='w-[20px] h-[20px]' />
                                </button>
                            </div>
                            <button className='btn btn-primary'>
                                Post
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
                            <Image src={gallery11} alt='social post' width="822" height="514" className='sm:rounded-xl rounded-md w-full' />
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1 border border-dashed border-border-color'>
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4 border border-dashed border-border-color'>
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1 border border-dashed border-border-color'>
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
                                <div className='bg-card-color p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl border border-dashed border-border-color'>
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4 border border-dashed border-border-color'>
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-1 border border-dashed border-border-color'>
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
                        <div className='p-4 flex sm:flex-row flex-col gap-x-4 gap-y-1 rounded-xl mb-4 border border-dashed border-border-color'>
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
                </div>
                <div className='flex flex-col gap-4 xxl:col-span-3 col-span-12'>
                    <div className='card rounded-xl bg-card-color overflow-hidden border border-dashed border-border-color'>
                        <p className='font-semibold md:p-6 p-4'>
                            Latest Photos
                        </p>
                        <ul>
                            <li className='flex items-center justify-between py-10 px-6 text-primary border-y border-dashed border-border-color last:border-none transition-all hove:text-secondary hover:bg-primary-10'>
                                Web Design
                                <span>
                                    78
                                </span>
                            </li>
                            <li className='flex items-center justify-between py-10 px-6 text-primary border-b border-dashed border-border-color last:border-none transition-all hove:text-secondary hover:bg-primary-10'>
                                ReactJs
                                <span>
                                    23
                                </span>
                            </li>
                            <li className='flex items-center justify-between py-10 px-6 text-primary border-b border-dashed border-border-color last:border-none transition-all hove:text-secondary hover:bg-primary-10'>
                                Music
                                <span>
                                    12
                                </span>
                            </li>
                            <li className='flex items-center justify-between py-10 px-6 text-primary border-b border-dashed border-border-color last:border-none transition-all hove:text-secondary hover:bg-primary-10'>
                                Trending
                                <span>
                                    41
                                </span>
                            </li>
                            <li className='flex items-center justify-between py-10 px-6 text-primary border-b border-dashed border-border-color last:border-none transition-all hove:text-secondary hover:bg-primary-10'>
                                Newest Blog
                                <span>
                                    8
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <p className='font-semibold md:mb-6 mb-4'>
                            Average Agent Rating
                        </p>
                        <div className='text-[28px]/[34px] font-medium mb-2'>
                            4/<small>5</small>
                        </div>
                        <ul className='flex items-center gap-1 flex-wrap'>
                            <li>
                                <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                    <IconStarFilled className='w-full h-full' />
                                </button>
                            </li>
                            <li>
                                <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                    <IconStarFilled className='w-full h-full' />
                                </button>
                            </li>
                            <li>
                                <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                    <IconStarFilled className='w-full h-full' />
                                </button>
                            </li>
                            <li>
                                <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                    <IconStarFilled className='w-full h-full' />
                                </button>
                            </li>
                            <li>
                                <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center group transition-all hover:bg-warning'>
                                    <IconStar className='w-full h-full transition-all group-hover:fill-font-color' />
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <p className='font-semibold'>
                                Latest Photos
                            </p>
                            <div className="relative">
                                <button ref={buttonRef} onClick={toggleAdminMenu} className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[20px] h-[20px]' />
                                </button>
                                <ul ref={menuRef} className={`bg-card-color text-font-color z-[1] rounded-xl w-[180px] shadow-shadow-lg absolute end-0 top-full origin-top-right transition-all duration-300 ${adminMenu ? ' opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}>
                                    <li>
                                        <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                            Landing page
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                            Inventary
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                            eCommerce
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                            HRMS
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <SlideshowLightbox lightboxIdentifier="galleryPhotos" showThumbnails onOpen={() => { document.body.classList.add("overflow-hidden") }} onClose={() => { document.body.classList.remove("overflow-hidden") }} className="grid grid-cols-3 gap-1">
                            {latestPhotos.map((item, key) => (
                                <Image key={key} src={item?.image} data-lightboxjs="galleryPhotos" alt='gallery' className="rounded-md w-full" />
                            ))}
                        </SlideshowLightbox>
                    </div>
                </div>
            </div>
        </>
    )
}
