import React, { useState } from 'react'
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
} from '/public/images'
import NewProject from '../../app/project/NewProject'
import Link from 'next/link'
import Image from 'next/image'

export default function Project() {

    const [newProjectSidebar, setNewProjectSidebar] = useState(false)
    const toggleNewProject = () => {
        setNewProjectSidebar(!newProjectSidebar)
    }

    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[24px] font-medium'>
                    My Projects
                </h5>
                <div className='flex items-stretch gap-1 flex-wrap'>
                    <select className="form-select cursor-pointer rounded-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                        <option defaultValue="">Choose...</option>
                        <option value="1">Designer</option>
                        <option value="2">Developer</option>
                        <option value="3">Office</option>
                        <option value="4">Friends</option>
                        <option value="5">Management</option>
                    </select>
                    <button onClick={toggleNewProject} className={`border border-current text-grey rounded-md text-[14px]/[20px] py-2 px-3 flex items-center gap-4 font-semibold cursor-pointer transition-all duration-300 after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${newProjectSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                        <span>
                            Create Project
                        </span>
                    </button>
                    <NewProject newProjectSidebar={newProjectSidebar} toggleNewProject={toggleNewProject} />
                </div>
            </div>
            <div className='flex flex-wrap gap-4'>
                <div className='card bg-card-color rounded-xl xxl:flex-[1_0_calc(33.33%-32px)] sm:flex-[1_0_calc(50%-16px)] flex-grow border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                        <h5 className='text-[20px]/[26px] font-medium mb-1'>
                            <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                School / University
                            </Link>
                        </h5>
                        <p className='text-font-color-100 mb-6'>
                            CRM App application to University Admin..
                        </p>
                        <ul className='flex gap-2 flex-wrap mb-6'>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    7
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Issues
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    4
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Resolved
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    3
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Comments
                                </small>
                            </li>
                        </ul>
                        <div className='flex items-center flex-wrap gap-1 mb-4'>
                            <label className='me-1'>
                                Team :
                            </label>
                            <Image src={avatar1} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar3} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                        </div>
                        <div className='flex items-center justify-between gap-2 small'>
                            95%
                            <span>
                                Done
                            </span>
                        </div>
                        <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                            <div className='progress-bar w-[95%] bg-success h-full'></div>
                        </div>
                    </div>
                    <div className='md:px-6 p-4 flex gap-x-3 gap-y-1 flex-wrap'>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Due date :
                            </span>
                            <strong className='min-w-fit'>
                                21 Aug, 2022
                            </strong>
                        </div>
                        <span className='inline-block'>|</span>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Budget :
                            </span>
                            <strong className='min-w-fit'>
                                $12,050
                            </strong>
                        </div>
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl xxl:flex-[1_0_calc(33.33%-32px)] sm:flex-[1_0_calc(50%-16px)] flex-grow border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                        <h5 className='text-[20px]/[26px] font-medium mb-1'>
                            <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                LUNO job Portal
                            </Link>
                        </h5>
                        <p className='text-font-color-100 mb-6'>
                            CRM App application to University Admin..
                        </p>
                        <ul className='flex gap-2 flex-wrap mb-6'>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    10
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Issues
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    5
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Resolved
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    4
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Comments
                                </small>
                            </li>
                        </ul>
                        <div className='flex items-center flex-wrap gap-1 mb-4'>
                            <label className='me-1'>
                                Team :
                            </label>
                            <Image src={avatar5} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar7} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                        </div>
                        <div className='flex items-center justify-between gap-2 small'>
                            75%
                            <span>
                                Done
                            </span>
                        </div>
                        <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                            <div className='progress-bar w-[75%] bg-info h-full'></div>
                        </div>
                    </div>
                    <div className='md:px-6 p-4 flex gap-x-3 gap-y-1 flex-wrap'>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Due date :
                            </span>
                            <strong className='min-w-fit'>
                                21 May, 2022
                            </strong>
                        </div>
                        <span className='inline-block'>|</span>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Budget :
                            </span>
                            <strong className='min-w-fit'>
                                $22,050
                            </strong>
                        </div>
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl xxl:flex-[1_0_calc(33.33%-32px)] sm:flex-[1_0_calc(50%-16px)] flex-grow border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                        <h5 className='text-[20px]/[26px] font-medium mb-1'>
                            <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                Shift CRM
                            </Link>
                        </h5>
                        <p className='text-font-color-100 mb-6'>
                            CRM App application to University Admin..
                        </p>
                        <ul className='flex gap-2 flex-wrap mb-6'>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    13
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Issues
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    5
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Resolved
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    8
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Comments
                                </small>
                            </li>
                        </ul>
                        <div className='flex items-center flex-wrap gap-1 mb-4'>
                            <label className='me-1'>
                                Team :
                            </label>
                            <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar9} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar10} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                        </div>
                        <div className='flex items-center justify-between gap-2 small'>
                            61%
                            <span>
                                Done
                            </span>
                        </div>
                        <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                            <div className='progress-bar w-[61%] bg-info h-full'></div>
                        </div>
                    </div>
                    <div className='md:px-6 p-4 flex gap-x-3 gap-y-1 flex-wrap'>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Due date :
                            </span>
                            <strong className='min-w-fit'>
                                21 Jun, 2022
                            </strong>
                        </div>
                        <span className='inline-block'>|</span>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Budget :
                            </span>
                            <strong className='min-w-fit'>
                                $1,12,050
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
