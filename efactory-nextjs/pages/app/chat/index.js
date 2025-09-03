import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { avatar1, avatar10, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, gallery3, gallery4, profile_av, video_call } from '/public/images';
import { IconArrowsDiagonal, IconDots, IconHeadphones, IconHeart, IconInfoCircle, IconMessages, IconMicrophone, IconMoodSmile, IconPaperclip, IconPencil, IconPhone, IconScreenShare, IconSearch, IconSettings, IconTrashFilled, IconUserPlus, IconVideo } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Chat() {

    const [chatSide, setChatSide] = useState(false)
    const chatSideToggle = () => {
        setChatSide(!chatSide)
    }

    const [chatVideoModal, setChatVideoModal] = useState(false)
    const openChatVideoModal = () => {
        setChatVideoModal(!chatVideoModal)
    }
    useEffect(() => {
        document.body.classList[chatVideoModal ? "add" : "remove"]("overflow-hidden")
    }, [chatVideoModal])

    return (
        <>
            <div className='flex'>
                <div className={`bg-card-color sm:min-w-[320px] ms-[2px] mt-[2px] sm:w-[320px] min-w-[280px] w-[280px] lg:static fixed z-[1] transition-all duration-300 ${chatSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
                    <div className='px-4 pt-4 form-control'>
                        <input
                            type="text"
                            id="chat_search"
                            className="form-input !py-5"
                            placeholder="Search..."
                        />
                    </div>
                    <div>
                        <Tabs>
                            <div className='p-4 border-b border-border-color'>
                                <TabList className="flex items-center p-[3px] border border-primary rounded-md">
                                    <Tab className="flex-1 py-5 px-4 text-center cursor-pointer text-primary rounded-md sm:text-[16px]/[24px] text-[14px]/[20px] focus:outline-0" selectedClassName="bg-primary text-white">Chat</Tab>
                                    <Tab className="flex-1 py-5 px-4 text-center cursor-pointer text-primary rounded-md sm:text-[16px]/[24px] text-[14px]/[20px] focus:outline-0" selectedClassName="bg-primary text-white">Groups</Tab>
                                    <Tab className="flex-1 py-5 px-4 text-center cursor-pointer text-primary rounded-md sm:text-[16px]/[24px] text-[14px]/[20px] focus:outline-0" selectedClassName="bg-primary text-white">Contact</Tab>
                                </TabList>
                            </div>
                            <div className='xl:h-[calc(100svh-77px-52px-75px)] md:h-[calc(100svh-73px-52px-75px)] h-[calc(100svh-60px-52px-75px)] overflow-auto custom-scrollbar'>
                                <TabPanel>
                                    <ul>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Chris Fox
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        12:37 PM
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    changed an issue from "In Progress" to
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <span className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                                                RH
                                            </span>
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Robert Hammer
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        10:45 AM
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    It is a long established fact that a reader will be distracted
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Orlando Lentz
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        10:11 AM
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    There are many variations of passages
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Barbara Kelly
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Sat
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Contrary to popular belief
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar5} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Robert Hammer
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Fri
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    making it over 2000 years old
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar6} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Orlando Lentz
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Fri
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    There are many variations of passages
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Rose Rivera
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Thu
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    The generated Lorem Ipsum
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Chris Fox
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Wed
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    changed an issue from "In Progress" to
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <span className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                                                RH
                                            </span>
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Robert Hammer
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        Wed
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    It is a long established fact that a reader will be distracted
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Orlando Lentz
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        13/04/2024
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    There are many variations of passages
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Barbara Kelly
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        13/04/2024
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Contrary to popular belief
                                                </p>
                                            </div>
                                        </li>
                                        <li className='p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <Image src={avatar5} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Robert Hammer
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        22/04/2024
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    making it over 2000 years old
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </TabPanel>
                                <TabPanel>
                                    <ul>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <span className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                                                DU
                                            </span>
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Design UI
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        10:45 AM
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    The point of using Lorem Ipsum
                                                </p>
                                            </div>
                                        </li>
                                        <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <span className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                                                AD
                                            </span>
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Angular Dev Team
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        24/04/2024
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    If you are going to use a passage
                                                </p>
                                            </div>
                                        </li>
                                        <li className='p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                            <span className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                                                AT
                                            </span>
                                            <div className='truncate w-full'>
                                                <div className='flex items-center gap-2 justify-between'>
                                                    <p className='truncate'>
                                                        Account Team
                                                    </p>
                                                    <span className='text-[11px]/[13px] text-font-color-100'>
                                                        20/01/2024
                                                    </span>
                                                </div>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    The point of using Lorem Ipsum
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </TabPanel>
                                <TabPanel>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Chris Fox
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px] fill-font-color-100' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                chris.fox@luno.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Barbara Kelly
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px]' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                barbara.kelly@luno.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar10} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Richard Foos
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px]' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                richard.foos@luno.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Richard Foos
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px] fill-font-color-100' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                richard.foos@luno.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Frank Camly
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px]' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                frank.camly@luno.com
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-body-color'>
                                        <Image src={avatar6} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                                        <div className='truncate w-full'>
                                            <div className='flex items-center gap-2 justify-between'>
                                                <p className='truncate'>
                                                    Brian Swader
                                                </p>
                                                <div className='text-font-color-100 flex gap-2'>
                                                    <button>
                                                        <IconHeart className='w-[20px] h-[20px]' />
                                                    </button>
                                                    <button>
                                                        <IconTrashFilled className='w-[20px] h-[20px]' />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                brianswader@luno.com
                                            </p>
                                        </div>
                                    </li>
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='border-b border-dashed border-border-color py-4 xxl:px-12 px-4 flex items-center gap-2 justify-between'>
                        <Link href="#" className='flex gap-4 group flex-1'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='truncate grid'>
                                <p className='truncate text-primary transition-all group-hover:text-secondary'>
                                    Orlando Lentz
                                </p>
                                <p className='truncate text-[14px]/[20px] text-font-color-100'>
                                    Last seen: 5 hours ago
                                </p>
                            </div>
                        </Link>
                        <div className='flex gap-2 items-center'>
                            <button className='p-5 text-font-color-100 transition-all hover:text-blue'>
                                <IconSearch className='w-[18px] h-[18px]' />
                            </button>
                            <button onClick={openChatVideoModal} className='lg:block hidden p-5 text-font-color-100 transition-all hover:text-blue'>
                                <IconVideo className='w-[18px] h-[18px]' />
                            </button>
                            <button className='lg:block hidden p-5 text-font-color-100 transition-all hover:text-blue'>
                                <IconSettings className='w-[18px] h-[18px]' />
                            </button>
                            <button className='lg:block hidden p-5 text-font-color-100 transition-all hover:text-blue'>
                                <IconInfoCircle className='w-[18px] h-[18px]' />
                            </button>
                            <button className='lg:hidden bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                            <button onClick={chatSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${chatSide ? 'opened' : ''}`}>
                                <svg width="20" height="20" viewBox="0 0 100 100">
                                    <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                    <path className="line line2" d="M 20,50 H 80" />
                                    <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <ul className='py-4 xxl:px-12 px-4 flex flex-col gap-4 xl:h-[calc(100svh-77px-77px-69px)] md:h-[calc(100svh-73px-77px-69px)] h-[calc(100svh-60px-77px-69px)] overflow-auto custom-scrollbar'>
                        <li className='flex flex-row items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex gap-1'>
                                    <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full' />
                                    <span className="text-[14px]/[1] text-font-color-100">10:10 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-card-color'>
                                    <div className="message">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex gap-1'>
                                    <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full' />
                                    <span className="text-[14px]/[1] text-font-color-100">10:10 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-card-color'>
                                    <div className="message">Contrary to popular belief, Lorem Ipsum is not simply random text.</div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex gap-1'>
                                    <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full' />
                                    <span className="text-[14px]/[1] text-font-color-100">10:10 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-card-color'>
                                    <div className="message"> Hi Aiden, how are you?</div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row-reverse items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex justify-end gap-1'>
                                    <span className="text-[14px]/[1] text-font-color-100">10:12 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-primary text-white'>
                                    <div className="message">Are we meeting today?</div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex gap-1'>
                                    <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full' />
                                    <span className="text-[14px]/[1] text-font-color-100">10:10 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-card-color'>
                                    <div className="message">Please find attached images</div>
                                    <div className='flex flex-wrap gap-5 mt-4'>
                                        <Image src={gallery3} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                                        <Image src={gallery4} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                                    </div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row-reverse items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex justify-end gap-1'>
                                    <span className="text-[14px]/[1] text-font-color-100">10:12 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-primary text-white'>
                                    <div className="message">Okay, will check and let you know.</div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                        <li className='flex flex-row-reverse items-end'>
                            <div className='max-w-[70%]'>
                                <div className='mb-2 flex justify-end gap-1'>
                                    <span className="text-[14px]/[1] text-font-color-100">10:12 AM, Today</span>
                                </div>
                                <div className='p-3 rounded-lg bg-primary text-white'>
                                    <div className="message">
                                        Yes, Orlando Allredy done <br />There are many variations of passages of Lorem Ipsum available
                                    </div>
                                </div>
                            </div>
                            <button className='p-3'>
                                <IconDots className='stroke-font-color-100 w-[18px] h-[18px] rotate-90' />
                            </button>
                        </li>
                    </ul>
                    <div className='py-4 xxl:px-12 px-4 flex items-center border-t border-dashed border-border-color'>
                        <button className='relative py-5 px-10 text-font-color-100 transition-all hover:text-blue'>
                            <input type='file' id='chatAttach' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                            <label htmlFor='chatAttach' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                            <IconPaperclip className='w-[18px] h-[18px]' />
                        </button>
                        <div className='relative flex-1 pr-4'>
                            <input type="text" placeholder="Enter text here..." className='w-full py-[6px] px-[12px] bg-transparent focus:outline-0 focus:text-primary' />
                        </div>
                        <button className='btn bg-secondary text-white font-medium uppercase !py-2'>
                            Send
                        </button>
                    </div>
                </div>
            </div>
            {chatVideoModal &&
                <>
                    <div className={`fixed p-15 w-full md:max-w-[800px] max-w-[500px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                        <div className='bg-card-color rounded-lg shadow-shadow-lg'>
                            <div className='sm:p-4 p-2 relative'>
                                <Image src={video_call} alt='video call' width="766" height="511" />
                                <div className='sm:p-2 p-1 shadow-shadow-normal sm:rounded-xl rounded-md inline-block sm:mt-6 sm:me-6 mt-4 me-4 absolute end-0 top-0 bg-card-color'>
                                    <Image src={profile_av} alt='video' width="160" height="160" className='md:w-auto sm:w-100 w-50' />
                                </div>
                            </div>
                            <div className='sm:p-4 p-2 border-t border-border-color flex items-stretch justify-between flex-wrap sm:gap-4 gap-2'>
                                <div className='border border-border-color rounded-md'>
                                    <button title='Info' className='py-2 md:px-3 px-2 border-r border-border-color text-grey rounded-l-md transition-all hover:bg-grey hover:text-white'>
                                        <IconInfoCircle className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Comments' className='py-2 md:px-3 px-2 border-r border-border-color text-grey transition-all hover:bg-grey hover:text-white'>
                                        <IconMessages className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Add User' className='py-2 md:px-3 px-2 text-grey rounded-r-md transition-all hover:bg-grey hover:text-white'>
                                        <IconUserPlus className='w-[16px] h-[16px]' />
                                    </button>
                                </div>
                                <div className='border border-border-color rounded-md'>
                                    <button title='Record Audio' className='py-2 md:px-3 px-2 border-r border-border-color text-grey rounded-l-md transition-all hover:bg-grey hover:text-white'>
                                        <IconMicrophone className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Record Video' className='py-2 md:px-3 px-2 border-r border-border-color text-grey transition-all hover:bg-grey hover:text-white'>
                                        <IconVideo className='w-[16px] h-[16px]' />
                                    </button>
                                    <button onClick={openChatVideoModal} title='Call End' className='py-2 md:px-3 px-2 border-r border-border-color bg-danger text-white transition-all hover:opacity-80'>
                                        <IconPhone className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Screen Share' className='py-2 md:px-3 px-2 border-r border-border-color text-grey transition-all hover:bg-grey hover:text-white'>
                                        <IconScreenShare className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Headphone' className='py-2 md:px-3 px-2 text-grey rounded-r-md transition-all hover:bg-grey hover:text-white'>
                                        <IconHeadphones className='w-[16px] h-[16px]' />
                                    </button>
                                </div>
                                <div className='border border-border-color rounded-md'>
                                    <button title='Smile' className='py-2 md:px-3 px-2 border-r border-border-color text-grey rounded-l-md transition-all hover:bg-grey hover:text-white'>
                                        <IconMoodSmile className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Edit' className='py-2 md:px-3 px-2 border-r border-border-color text-grey transition-all hover:bg-grey hover:text-white'>
                                        <IconPencil className='w-[16px] h-[16px]' />
                                    </button>
                                    <button title='Full Screen' className='py-2 md:px-3 px-2 text-grey rounded-r-md transition-all hover:bg-grey hover:text-white'>
                                        <IconArrowsDiagonal className='w-[16px] h-[16px]' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={openChatVideoModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                </>
            }
        </>
    )
}
