import React, { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconCalendarMonth,
    IconCircleCheckFilled,
    IconClockHour3,
    IconCornerRightDown,
    IconCornerRightUp,
    IconProgress,
    IconServer2,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
} from '/public/images'
import AllProject from './AllProject'
import InProgress from './InProgress'
import UpComing from './UpComing'
import Overdue from './Overdue'
import Completed from './Completed'
import NewProject from '../NewProject'
import Image from 'next/image'

export default function ProjectList() {

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
            name: "Project List",
        },
    ]

    return (
        <Tabs className='flex'>
            <div className={`bg-card-color min-w-[230px] w-[230px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${projectSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
                <button onClick={toggleNewProject} className={`bg-secondary py-10 px-15 rounded-md text-[14px]/[20px] large w-full text-white mb-4 transition-all duration-300 after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${newProjectSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    New Project
                </button>
                <TabList>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        <IconServer2 className='w-[20px] h-[20px]' />
                        All Project
                        <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                            18
                        </span>
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        <IconProgress className='w-[20px] h-[20px]' />
                        In Progress
                        <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                            03
                        </span>
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        <IconClockHour3 className='w-[20px] h-[20px]' />
                        Up Coming
                        <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                            02
                        </span>
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        <IconCalendarMonth className='w-[20px] h-[20px]' />
                        Overdue
                    </Tab>
                    <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                        <IconCircleCheckFilled className='w-[20px] h-[20px]' />
                        Completed
                    </Tab>
                </TabList>
                <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 small'>
                    PROJECT REVENUE
                </p>
                <div>
                    <p className='text-[32px]/[38px] mb-4'>
                        $78,890
                    </p>
                    <div className='mb-3'>
                        <div className='flex gap-1 items-center'>
                            <span className='font-bold'>
                                $5,250
                            </span>
                            <IconCornerRightUp className='text-success w-[20px] h-[20px]' />
                        </div>
                        <p className='text-font-color-100 small'>
                            Project Profit
                        </p>
                    </div>
                    <div className='mb-3'>
                        <div className='flex gap-1 items-center'>
                            <span className='font-bold'>
                                $1,450
                            </span>
                            <IconCornerRightDown className='text-danger w-[20px] h-[20px]' />
                        </div>
                        <p className='text-font-color-100 small'>
                            Project Expense
                        </p>
                    </div>
                </div>
                <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 small'>
                    OUR CLIENTS
                </p>
                <ul className='flex flex-wrap gap-3'>
                    <li>
                        <Image src={avatar1} alt='user' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                    </li>
                    <li>
                        <Image src={avatar2} alt='user' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                    </li>
                    <li>
                        <Image src={avatar3} alt='user' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                    </li>
                    <li>
                        <Image src={avatar4} alt='user' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                    </li>
                    <li>
                        <Image src={avatar5} alt='user' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                    </li>
                </ul>
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
                        <AllProject />
                    </TabPanel>
                    <TabPanel>
                        <InProgress />
                    </TabPanel>
                    <TabPanel>
                        <UpComing />
                    </TabPanel>
                    <TabPanel>
                        <Overdue />
                    </TabPanel>
                    <TabPanel>
                        <Completed />
                    </TabPanel>
                </div>
            </div>
            <NewProject newProjectSidebar={newProjectSidebar} toggleNewProject={toggleNewProject} />
        </Tabs>
    )
}
