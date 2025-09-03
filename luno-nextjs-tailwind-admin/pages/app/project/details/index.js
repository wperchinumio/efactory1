import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    avatar1,
} from '/public/images'
import NewProject from '../NewProject'
import Overview from './Overview'
import User from './User'
import File from './File'
import Activity from './Activity'
import Setting from './Setting'
import Image from 'next/image'

export default function ProjectDetail() {

    const [projectSide, setProjectSide] = useState(false)
    const projectSideToggle = () => {
        setProjectSide(!projectSide)
    }

    const [newProjectSidebar, setNewProjectSidebar] = useState(false)
    const toggleNewProject = () => {
        setNewProjectSidebar(!newProjectSidebar)
    }

    const breadcrumbItem = [
        {
            link: "App",
            url: "#",
        },
        {
            link: "Project",
            url: "/app-project",
        },
        {
            name: "View Project",
        },
    ]

    return (
        <Tabs className='flex'>
            <div className={`bg-card-color min-w-[230px] w-[230px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${projectSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
                <button onClick={toggleNewProject} className={`bg-secondary py-10 px-15 rounded-md text-[14px]/[20px] large w-full text-white mb-4 transition-all duration-300 after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${newProjectSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    New Project
                </button>
                <NewProject newProjectSidebar={newProjectSidebar} toggleNewProject={toggleNewProject} />
                <TabList>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        Overview
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        Users
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        Files
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        Activity
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        Settings
                    </Tab>
                </TabList>
                <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 small'>
                    PROJECT Cost
                </p>
                <div>
                    <p className='text-[32px]/[38px] mb-4'>
                        $8,890
                    </p>
                    <div className='mb-3'>
                        <span className='font-bold'>
                            22 Feb 2022
                        </span>
                        <p className='text-font-color-100 small'>
                            Due Date
                        </p>
                    </div>
                </div>
                <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 small'>
                    CLIENTS DETAIL
                </p>
                <Image src={avatar1} width="90" height="90" alt='user' className='p-1 border border-border-color rounded-full mb-4' />
                <p className='font-medium'>
                    Michelle Green
                </p>
                <p className='font-medium'>
                    jason-porter@info.com
                </p>
                <button className='btn btn-outline-secondary mt-4'>
                    Message
                </button>
            </div>
            <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                <div className='container-fluid'>
                    <div className='flex items-center justify-between gap-4'>
                        <Breadcrumb breadcrumbItem={breadcrumbItem} />
                        <button onClick={projectSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${projectSide ? 'opened' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 100 100">
                                <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                <path className="line line2" d="M 20,50 H 80" />
                                <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                            </svg>
                        </button>
                    </div>
                    <TabPanel>
                        <Overview />
                    </TabPanel>
                    <TabPanel>
                        <User />
                    </TabPanel>
                    <TabPanel>
                        <File />
                    </TabPanel>
                    <TabPanel>
                        <Activity />
                    </TabPanel>
                    <TabPanel>
                        <Setting />
                    </TabPanel>
                </div>
            </div>
        </Tabs>
    )
}
