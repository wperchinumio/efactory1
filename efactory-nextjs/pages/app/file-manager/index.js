import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconBox,
    IconBrandGoogleDrive,
    IconBrandGoogleFilled,
    IconChartPie3,
    IconClockHour4,
    IconDots,
    IconFolder,
    IconServer,
    IconServer2,
    IconTag,
    IconTrash,
    IconUsers,
    IconX,
} from '@tabler/icons-react'
import MyDrive from './MyDrive'
import SharedWithMe from './SharedWithMe'
import Trash from './Trash'
import Recent from './Recent'
import Link from 'next/link'

export default function FileManager() {

    const [fileManagerSide, setFileManagerSide] = useState(false)
    const socialSideToggle = () => {
        setFileManagerSide(!fileManagerSide)
    }

    const [analyticsSidebar, setAnalyticsSidebar] = useState(false)
    const toggleAnalytics = () => {
        setAnalyticsSidebar(!analyticsSidebar)
    }

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "File Manager",
        },
    ]

    return (
        <>
            <Tabs className='flex'>
                <div className={`bg-card-color min-w-[230px] w-[230px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${fileManagerSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
                    <button className='btn bg-secondary large w-full text-white mb-4'>
                        Create New
                    </button>
                    <TabList>
                        <Tab className="flex items-center gap-4 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconServer2 className='w-[20px] h-[20px]' />
                            <span className='flex-1 inline-block'>
                                My Drive
                            </span>
                            <span className='inline-block bg-body-color rounded-md py-1 px-2 text-[12px]/[1] text-font-color font-semibold'>
                                28
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-4 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconUsers className='w-[20px] h-[20px]' />
                            Shared with Me
                        </Tab>
                        <Tab className="flex items-center gap-4 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconClockHour4 className='w-[20px] h-[20px]' />
                            <span className='flex-1 inline-block'>
                                Recent
                            </span>
                            <span className='inline-block bg-body-color rounded-md py-1 px-2 text-[12px]/[1] text-font-color font-semibold'>
                                2
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-4 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconTrash className='w-[20px] h-[20px]' />
                            Trash
                        </Tab>
                    </TabList>
                    <button onClick={toggleAnalytics} className="flex items-center gap-4 font-semibold py-2 cursor-pointer transition-all duration-300 hover:text-primary">
                        <IconChartPie3 className='w-[20px] h-[20px]' />
                        Analytics
                    </button>
                    <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 text-[14px]/[20px]'>
                        FILE LABELS
                    </p>
                    <ul className='flex flex-col gap-4'>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Documents
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Work Project
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Templates
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 text-[14px]/[20px]'>
                        FOLDERS
                    </p>
                    <ul className='flex flex-col gap-4'>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconFolder className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Documents
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconFolder className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Work Project
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconFolder className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Templates
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                    <div className='container-fluid'>
                        <div className='flex items-center justify-between gap-4'>
                            <Breadcrumb breadcrumbItem={breadcrumbItem} />
                            <button onClick={socialSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${fileManagerSide ? 'opened' : ''}`}>
                                <svg width="20" height="20" viewBox="0 0 100 100">
                                    <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                    <path className="line line2" d="M 20,50 H 80" />
                                    <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                                </svg>
                            </button>
                        </div>
                        <TabPanel>
                            <MyDrive />
                        </TabPanel>
                        <TabPanel>
                            <SharedWithMe />
                        </TabPanel>
                        <TabPanel>
                            <Recent />
                        </TabPanel>
                        <TabPanel>
                            <Trash />
                        </TabPanel>
                    </div>
                </div>
            </Tabs>
            <div className={`fixed top-0 bg-card-color z-[5] h-svh w-full max-w-[400px] transition-all duration-200 ${analyticsSidebar ? 'ltr:right-0 rtl:left-0' : 'ltr:-right-full rtl:-left-full'}`}>
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center justify-between gap-15 border-b border-border-color'>
                    <div className='text-[20px]/[30px] font-medium'>
                        Drive Analytics
                    </div>
                    <button onClick={toggleAnalytics}>
                        <IconX />
                    </button>
                </div>
                <div className='md:p-6 p-4 md:h-[calc(100svh-63px)] h-[calc(100svh-55px)] overflow-auto custom-scrollbar'>
                    <div className='flex flex-col gap-4'>
                        <div className='md:p-6 p-4 rounded-xl card border border-dashed border-border-color'>
                            <div className="flex justify-between items-center mb-6">
                                <IconBrandGoogleFilled className='w-[30px] h-[30px]' />
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <h6>Google Drive</h6>
                            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                <div className='progress-bar w-[50%] bg-primary h-full'></div>
                            </div>
                            <div className="flex justify-between text-font-color-100 mt-2 text-[14px]/[20px]">7.23GB<span>15GB</span></div>
                        </div>
                        <div className='md:p-6 p-4 rounded-xl card border border-dashed border-border-color'>
                            <div className="flex justify-between items-center mb-6">
                                <IconBox className='w-[30px] h-[30px]' />
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <h6>Dropbox Drive</h6>
                            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                <div className='progress-bar w-[85%] bg-danger h-full'></div>
                            </div>
                            <div className="flex justify-between text-font-color-100 mt-2 text-[14px]/[20px]">1.8GB<span>2GB</span></div>
                        </div>
                        <div className='md:p-6 p-4 rounded-xl card border border-dashed border-border-color'>
                            <div className="flex justify-between items-center mb-6">
                                <IconBrandGoogleDrive className='w-[30px] h-[30px]' />
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <h6>One Drive</h6>
                            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                <div className='progress-bar w-[20%] bg-success h-full'></div>
                            </div>
                            <div className="flex justify-between text-font-color-100 mt-2 text-[14px]/[20px]">2GB<span>10GB</span></div>
                        </div>
                        <div className='md:p-6 p-4 rounded-xl card border border-dashed border-border-color'>
                            <div className="flex justify-between items-center mb-6">
                                <IconServer className='w-[30px] h-[30px]' />
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <h6>Server</h6>
                            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                <div className='progress-bar w-[20%] bg-success h-full'></div>
                            </div>
                            <div className="flex justify-between text-font-color-100 mt-2 text-[14px]/[20px]">2GB<span>10GB</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={toggleAnalytics} className={`fixed z-[4] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px] transition-all duration-500 ease-in-out ${analyticsSidebar ? 'opacity-1 visible overflow-auto' : 'opacity-0 invisible overflow-hidden'}`}></div>
        </>
    )
}
