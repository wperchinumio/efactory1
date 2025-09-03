import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import {
    IconFileTypeDoc,
    IconFileTypePdf,
    IconFileTypeXls,
    IconFileTypeZip,
    IconUserFilled,
    IconUsersGroup,
    IconX,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    project_team,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function NewProject({ newProjectSidebar, toggleNewProject }) {

    return (
        <>
            <div className={`fixed top-0 bg-card-color z-[5] h-svh w-full max-w-[500px] transition-all duration-200 ${newProjectSidebar ? 'ltr:left-0 rtl:right-0' : 'ltr:-left-full rtl:-right-full'}`}>
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center justify-between gap-15 border-b border-border-color'>
                    <div className='text-[20px]/[30px] font-medium'>
                        Setup New Project
                    </div>
                    <button onClick={toggleNewProject}>
                        <IconX />
                    </button>
                </div>
                <div className='md:h-[calc(100svh-63px)] h-[calc(100svh-55px)] overflow-auto custom-scrollbar'>
                    <Tabs>
                        <TabList className="flex flex-wrap items-center md:px-6 px-4 pt-4">
                            <Tab className="flex-1 py-2 px-4 min-w-fit text-center cursor-pointer border-b-4 border-transparent -mb-1 focus:outline-0" selectedClassName="!border-primary text-primary">1. Project</Tab>
                            <Tab className="flex-1 py-2 px-4 min-w-fit text-center cursor-pointer border-b-4 border-transparent -mb-1 focus:outline-0" selectedClassName="!border-primary text-primary">2. Team</Tab>
                            <Tab className="flex-1 py-2 px-4 min-w-fit text-center cursor-pointer border-b-4 border-transparent -mb-1 focus:outline-0" selectedClassName="!border-primary text-primary">3. File</Tab>
                            <Tab className="flex-1 py-2 px-4 min-w-fit text-center cursor-pointer border-b-4 border-transparent -mb-1 focus:outline-0" selectedClassName="!border-primary text-primary">4. Completed</Tab>
                        </TabList>
                        <div className='md:p-6 p-4'>
                            <TabPanel>
                                <h6 className='font-semibold mb-1'>
                                    Project Type
                                </h6>
                                <p className='small text-font-color-100 mb-4'>
                                    If you need more info, please check out <Link href="#" className='text-primary transition-all hover:text-secondary'>FAQ Page</Link>
                                </p>
                                <div className='flex flex-col gap-4 mb-6'>
                                    <button className='flex items-start gap-4 p-4 border border-dashed border-primary bg-primary-10 rounded-xl w-full transition-all'>
                                        <IconUserFilled className='text-font-color-100 w-[36px] h-[36px] min-w-[36px]' />
                                        <span className='flex flex-col text-left gap-1'>
                                            <span className="font-medium">
                                                Personal Project
                                            </span>
                                            <span className="text-font-color-100">
                                                For smaller business, with simple salaries and pay schedules.
                                            </span>
                                        </span>
                                    </button>
                                    <button className='flex items-start gap-4 p-4 rounded-xl w-full transition-all hover:bg-primary-10'>
                                        <IconUsersGroup className='text-font-color-100 w-[36px] h-[36px] min-w-[36px]' />
                                        <span className='flex flex-col text-left gap-1'>
                                            <span className="font-medium">
                                                Team Project
                                            </span>
                                            <span className="text-font-color-100">
                                                For growing business who wants to create a rewarding place to work.
                                            </span>
                                        </span>
                                    </button>
                                </div>
                                <h6 className='font-semibold mb-1'>
                                    Project Details
                                </h6>
                                <p className='small text-font-color-100 mb-4'>
                                    It is a long established fact that a reader will be distracted by luno.
                                </p>
                                <div className="floating-form-control mb-10">
                                    <select className='form-select'>
                                        <option defaultValue="">Open this select menu</option>
                                        <option value="1">Business</option>
                                        <option value="2">Social</option>
                                    </select>
                                    <label className='form-label'>Choose a Customer *</label>
                                </div>
                                <div className='floating-form-control mb-10'>
                                    <input type='text' id='projectName' className='form-input' placeholder="Project name" />
                                    <label htmlFor='projectName' className='form-label'>Project name *</label>
                                </div>
                                <div className="floating-form-control mb-10">
                                    <textarea className="form-textarea" placeholder="Add project details" rows="3"></textarea>
                                    <label className='form-label'>Add project details</label>
                                </div>
                                <div className="floating-form-control mb-10">
                                    <input type="date" id='projectReleaseDate' className="form-input" placeholder="Enter release Date" />
                                    <label htmlFor='projectReleaseDate' className='form-label'>Enter release Date *</label>
                                </div>
                                <div className='flex gap-4 justify-between mb-6'>
                                    <p className='text-font-color-100'>
                                        Allow Notifications *
                                    </p>
                                    <div className='flex gap-4'>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="phoneNoti"
                                                className="form-check-input"
                                            />
                                            <label className="form-check-label !text-[16px]/[24px]" htmlFor="phoneNoti">Phone</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="emailNoti"
                                                className="form-check-input"
                                            />
                                            <label className="form-check-label !text-[16px]/[24px]" htmlFor="emailNoti">Email</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <button className='btn bg-secondary text-white large uppercase'>
                                        Add People
                                    </button>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h6 className='font-semibold mb-1'>
                                    Build a Team
                                </h6>
                                <p className='small text-font-color-100 mb-4'>
                                    If you need more info, please check out <Link href="#" className='text-primary transition-all hover:text-secondary'>Project Guidelines</Link>
                                </p>
                                <div className='floating-form-control mb-4'>
                                    <input type='text' id='inviteTeam' className='form-input' placeholder="Invite Teammates" />
                                    <label htmlFor='inviteTeam' className='form-label'>Invite Teammates</label>
                                </div>
                                <h6 className='font-semibold mb-1'>
                                    Team Members
                                </h6>
                                <div className="form-check form-switch mb-6">
                                    <input
                                        type="checkbox"
                                        id="addUserByTeam"
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label !text-[16px]/[24px] text-font-color-100" htmlFor="addUserByTeam">Adding Users by Team Members</label>
                                </div>
                                <ul className='md:-mx-6 -mx-4 mb-6'>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Chris Fox
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Angular Developer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Joge Lucky
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    ReactJs Developer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Chris Fox
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    NodeJs Developer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Joge Lucky
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Sr. Designer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar5} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Chris Fox
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Designer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar6} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Joge Lucky
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Front-End Developer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Chris Fox
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    QA
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <Image src={avatar8} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                        <div className='flex items-center gap-2 justify-between w-full truncate'>
                                            <div className='truncate'>
                                                <p className='truncate'>
                                                    Joge Lucky
                                                </p>
                                                <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                    Laravel Developer
                                                </p>
                                            </div>
                                            <select className="form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                                <option defaultValue="">Owner</option>
                                                <option value="1">Can Edit</option>
                                                <option value="2">Guest</option>
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                                <div className='text-center'>
                                    <button className='btn bg-secondary text-white large uppercase'>
                                        Select Files
                                    </button>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h6 className='font-semibold mb-1'>
                                    Upload Files
                                </h6>
                                <div className='mb-6 form-control'>
                                    <label className="form-label small text-font-color-100">Upload up to 10 files</label>
                                    <input className="form-input !p-0 cursor-pointer" type="file" />
                                </div>
                                <p className='mb-2'>
                                    Already Uploaded File
                                </p>
                                <ul className='md:-mx-6 -mx-4 mb-6'>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <IconFileTypePdf className='text-danger' />
                                        <div className='truncate'>
                                            <p className='truncate'>
                                                Annual Sales Report 2018-19
                                            </p>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                .pdf, 5.3 MB
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <IconFileTypeXls className='text-success' />
                                        <div className='truncate'>
                                            <p className='truncate'>
                                                Complete Product Sheet
                                            </p>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                .xls, 2.1 MB
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <IconFileTypeDoc className='text-info' />
                                        <div className='truncate'>
                                            <p className='truncate'>
                                                Marketing Guidelines
                                            </p>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                .doc, 2.3 MB
                                            </p>
                                        </div>
                                    </li>
                                    <li className='border-b border-dashed border-border-color md:px-6 p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-primary-10 last:border-b-0'>
                                        <IconFileTypeZip className='text-secondary' />
                                        <div className='truncate'>
                                            <p className='truncate'>
                                                Brand Photography
                                            </p>
                                            <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                                .zip, 30.5 MB
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <div className='text-center'>
                                    <button className='btn bg-secondary text-white large uppercase'>
                                        Advanced Options
                                    </button>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h4 className='font-semibold my-2 text-center text-[24px]/[30px]'>
                                    Project Created!
                                </h4>
                                <p className='text-font-color-100 text-center'>
                                    If you need more info, please check how to create project
                                </p>
                                <div className='my-12 flex flex-wrap items-stretch gap-2 justify-center'>
                                    <button className='btn bg-body-color uppercase large'>
                                        Create New Project
                                    </button>
                                    <button className='btn bg-secondary text-white uppercase large'>
                                        View Project
                                    </button>
                                </div>
                                <Image src={project_team} alt='Project Team' width="787" height="428" />
                            </TabPanel>
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
