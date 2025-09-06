import React, { useEffect, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconCalendarClock,
    IconCalendarEvent,
    IconCalendarMonth,
    IconCalendarUser,
    IconServer2,
    IconTag,
    IconX,
} from '@tabler/icons-react'
import AllTask from './AllTask'
import PriorityTask from './PriorityTask'
import TodayTask from './TodayTask'
import WeekTask from './WeekTask'
import CreatedByMeTask from './CreatedByMeTask'
import Link from 'next/link'

export default function Task() {

    const [taskSide, setTaskSide] = useState(false)
    const taskSideToggle = () => {
        setTaskSide(!taskSide)
    }

    const [newTaskModal, setNewTaskModal] = useState(false)
    const openNewTaskModal = () => {
        setNewTaskModal(!newTaskModal)
    }
    useEffect(() => {
        document.body.classList[newTaskModal ? "add" : "remove"]("overflow-hidden")
    }, [newTaskModal])

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "Task",
        },
    ]

    return (
        <>
            <Tabs className='flex'>
                <div className={`bg-card-color min-w-[230px] w-[230px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${taskSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
                    <button onClick={openNewTaskModal} className='btn bg-secondary large w-full text-white mb-4'>
                        New Task
                    </button>
                    <TabList>
                        <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconServer2 className='w-[20px] h-[20px]' />
                            All Task
                            <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                                28
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconCalendarClock className='w-[20px] h-[20px]' />
                            Priority Task
                            <span className='py-1 px-2 rounded-md bg-danger text-white text-[12px]/[1] font-bold ms-auto'>
                                2
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconCalendarEvent className='w-[20px] h-[20px]' />
                            Today's Tasks
                            <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                                7
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconCalendarMonth className='w-[20px] h-[20px]' />
                            This week tasks
                            <span className='py-1 px-2 rounded-md bg-body-color text-font-color text-[12px]/[1] font-bold ms-auto'>
                                19
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0" selectedClassName='text-primary'>
                            <IconCalendarUser className='w-[20px] h-[20px]' />
                            Created by me
                            <span className='py-1 px-2 rounded-md bg-primary text-white text-[12px]/[1] font-bold ms-auto'>
                                2
                            </span>
                        </Tab>
                    </TabList>
                    <p className='py-4 mt-4 border-t border-border-color uppercase text-font-color-100 text-[14px]/[20px]'>
                        TAGS
                    </p>
                    <ul className='flex flex-col gap-4'>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Design
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    BugFix
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    Help
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                                <IconTag className='w-[18px] h-[18px]' />
                                <span className='flex-1 inline-block'>
                                    R&D
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                    <div className='container-fluid'>
                        <div className='flex items-center justify-between gap-4'>
                            <Breadcrumb breadcrumbItem={breadcrumbItem} />
                            <button onClick={taskSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${taskSide ? 'opened' : ''}`}>
                                <svg width="20" height="20" viewBox="0 0 100 100">
                                    <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                    <path className="line line2" d="M 20,50 H 80" />
                                    <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                                </svg>
                            </button>
                        </div>
                        <TabPanel>
                            <AllTask />
                        </TabPanel>
                        <TabPanel>
                            <PriorityTask />
                        </TabPanel>
                        <TabPanel>
                            <TodayTask />
                        </TabPanel>
                        <TabPanel>
                            <WeekTask />
                        </TabPanel>
                        <TabPanel>
                            <CreatedByMeTask />
                        </TabPanel>
                    </div>
                </div>
            </Tabs>
            {newTaskModal &&
                <>
                    <div className={`fixed p-15 w-full max-w-[650px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                        <div className='bg-card-color rounded-lg shadow-shadow-lg'>
                            <div className='p-4 flex gap-5 justify-between border-b border-border-color'>
                                <p className='text-[20px]/[26px] font-medium'>
                                    Add Task
                                </p>
                                <button onClick={openNewTaskModal} className=''>
                                    <IconX />
                                </button>
                            </div>
                            <div className='py-10 md:px-10 px-[7px] '>
                                <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                    <div className='form grid grid-cols-12 md:gap-6 gap-4'>
                                        <div className="form-control col-span-12">
                                            <label htmlFor="taskTitle" className="form-label">
                                                Task Title
                                            </label>
                                            <input type="text" id="taskTitle" className="form-input" />
                                        </div>
                                        <div className="form-control col-span-12 flex flex-col">
                                            <label className='form-label'>Campaigns Description</label>
                                            <textarea className="form-textarea" rows="3"></textarea>
                                        </div>
                                        <div className="form-control col-span-12">
                                            <label className='form-label'>Select Date/Time</label>
                                            <div className='flex'>
                                                <input type="date" className="form-input !rounded-e-none" placeholder="Select Date" />
                                                <input type="time" className="form-input !rounded-s-none" placeholder="Select Time" />
                                            </div>
                                        </div>
                                        <div className="form-check col-span-12">
                                            <input
                                                type="checkbox"
                                                id="taskRemindOn"
                                                className="form-check-input"
                                            />
                                            <label className="form-check-label" htmlFor="taskRemindOn">Remind on</label>
                                        </div>
                                        <div className="form-control col-span-12">
                                            <label htmlFor="mobile" className="form-label">
                                                Task tag
                                            </label>
                                            <select className="form-select cursor-pointer rounded-md bg-card-color py-3 ps-15 pe-30 text-[14px]/[20px] w-full appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Open this select menu</option>
                                                <option value="1">Design</option>
                                                <option value="2">BugFix</option>
                                                <option value="3">Help</option>
                                                <option value="4">Design</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 flex items-stretch justify-end gap-5 border-t border-border-color'>
                                <button onClick={openNewTaskModal} className='btn btn-secondary'>
                                    Close
                                </button>
                                <button className='btn btn-primary'>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div onClick={openNewTaskModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                </>
            }
        </>
    )
}
