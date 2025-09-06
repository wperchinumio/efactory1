import React, { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import {
    avatar,
    profile_av,
} from '/public/images';
import {
    IconActivity,
    IconChartHistogram,
    IconEdit,
    IconListDetails,
    IconPencil,
    IconUsersGroup,
    IconX,
} from '@tabler/icons-react';
import Overview from './Overview';
import Group from './Group';
import Project from './Project';
import Campaign from './Campaign';
import Activity from './Activity';
import Image from 'next/image';

export default function MyProfile() {

    const [editProfileSidebar, setEditProfileSidebar] = useState(false)
    const toggleEditProfile = () => {
        setEditProfileSidebar(!editProfileSidebar)
    }

    const [editUser, setEditUser] = useState(avatar);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditUser(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "My Contact",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <Tabs>
                    <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                        <div className='md:p-6 p-4 border-b border-border-color'>
                            <div className='flex md:items-start items-center md:gap-12 gap-4 md:flex-row flex-col'>
                                <Image src={profile_av} alt='user profile' width="160" height="160" className='sm:w-[160px] sm:h-[160px] sm:min-w-[160px] w-[100px] h-[100px] min-w-[100px] object-cover rounded-xl' />
                                <div className='md:text-start text-center'>
                                    <p className='mb-1 text-[24px]/[30px] font-light flex gap-2 items-center md:justify-start justify-center'>
                                        Allie Grater
                                        <button onClick={toggleEditProfile} className={`text-primary transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${editProfileSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                                            <IconEdit className='w-[20px] h-[20px]' />
                                        </button>
                                    </p>
                                    <p className='mb-3'>
                                        alliegrater@luno.com
                                    </p>
                                    <p className="md:mb-3 mb-4 text-font-color-100 max-w-[550px]">
                                        It is a long established fact that a reader will be distracted by the readable
                                        content of a page when looking at its layout.
                                    </p>
                                    <div className='flex gap-3 flex-wrap md:justify-start justify-center'>
                                        <div className='px-4 py-1 border border-dashed border-border-color rounded-xl'>
                                            <small className='text-font-color-100'>
                                                Total Earnings
                                            </small>
                                            <div className="md:text-[20px]/[30px] text-[16px]/[22px]">
                                                $10,705
                                            </div>
                                        </div>
                                        <div className='px-4 py-1 border border-dashed border-border-color rounded-xl'>
                                            <small className='text-font-color-100'>
                                                Awards
                                            </small>
                                            <div className="md:text-[20px]/[30px] text-[16px]/[22px]">
                                                45
                                            </div>
                                        </div>
                                        <div className='px-4 py-1 border border-dashed border-border-color rounded-xl'>
                                            <small className='text-font-color-100'>
                                                Experience
                                            </small>
                                            <div className="md:text-[20px]/[30px] text-[16px]/[22px]">
                                                8+
                                            </div>
                                        </div>
                                        <div className='px-4 py-1 border border-dashed border-border-color rounded-xl'>
                                            <small className='text-font-color-100'>
                                                City
                                            </small>
                                            <div className="md:text-[20px]/[30px] text-[16px]/[22px]">
                                                New york
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TabList className="flex flex-wrap md:px-6 px-2 pt-2 relative md:justify-start justify-center">
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                Overview
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconUsersGroup className='w-[18px] h-[18px]' />
                                <span className='sm:block hidden'>
                                    Groups
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconListDetails className='w-[18px] h-[18px]' />
                                <span className='sm:block hidden'>
                                    Projects
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconChartHistogram className='w-[18px] h-[18px]' />
                                <span className='md:block hidden'>
                                    Campaigns
                                </span>
                            </Tab>
                            <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                                <IconActivity className='w-[18px] h-[18px]' />
                                <span className='md:block hidden'>
                                    Activity
                                </span>
                            </Tab>
                        </TabList>
                    </div>
                    <div className='mt-8'>
                        <TabPanel>
                            <Overview />
                        </TabPanel>
                        <TabPanel>
                            <Group />
                        </TabPanel>
                        <TabPanel>
                            <Project />
                        </TabPanel>
                        <TabPanel>
                            <Campaign />
                        </TabPanel>
                        <TabPanel>
                            <Activity />
                        </TabPanel>
                    </div>
                </Tabs>
                <div className={`fixed top-0 bg-card-color z-[5] h-svh w-full max-w-[400px] transition-all duration-200 ${editProfileSidebar ? 'ltr:right-0 rtl:left-0' : 'ltr:-right-full rtl:-left-full'}`}>
                    <div className='md:px-6 px-4 md:py-4 py-3 flex items-center justify-between gap-15 border-b border-border-color'>
                        <div className='text-[20px]/[30px] font-medium'>
                            Edit Profile
                        </div>
                        <button onClick={toggleEditProfile}>
                            <IconX />
                        </button>
                    </div>
                    <div className='md:p-6 p-4 md:h-[calc(100svh-63px)] h-[calc(100svh-55px)] overflow-auto custom-scrollbar'>
                        <div className='form grid grid-cols-12 md:gap-6 gap-4'>
                            <div className="form-control col-span-12">
                                <div className='sm:w-[120px] sm:h-[120px] sm:min-w-[120px] w-[100px] h-[100px] min-w-[100px] relative'>
                                    <Image src={editUser} alt='avatar' width="120" height="120" className='w-full h-full object-cover rounded-xl' />
                                    <button className='absolute sm:right-10 sm:bottom-10 right-5 bottom-5 p-5 shadow-lg bg-primary text-white rounded-full'>
                                        <input
                                            type='file'
                                            id='editProfile'
                                            onChange={handleFileChange}
                                            className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer'
                                        />
                                        <label htmlFor='editProfile' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                                        <IconPencil className='w-[16px] h-[16px]' />
                                    </button>
                                </div>
                            </div>
                            <div className="form-control col-span-12">
                                <label htmlFor="editProfileName" className="form-label">
                                    Name
                                </label>
                                <input type="text" id="editProfileName" className="form-input" placeholder="Allie Grater" />
                            </div>
                            <div className="form-control sm:col-span-6 col-span-12">
                                <label htmlFor="editProfileEmail" className="form-label">
                                    Email
                                </label>
                                <input type="text" id="editProfileEmail" className="form-input" placeholder="alliegrater@luno.com" />
                            </div>
                            <div className="form-control sm:col-span-6 col-span-12">
                                <label htmlFor="editProfilePassword" className="form-label">
                                    Password
                                </label>
                                <input type="password" id="editProfilePassword" className="form-input" placeholder="Chris@123" />
                            </div>
                            <div className="form-control col-span-12">
                                <label htmlFor="editProfileAddress" className="form-label">
                                    Address
                                </label>
                                <input type="text" id="editProfileAddress" className="form-input" placeholder="1234 Main St" />
                            </div>
                            <div className="form-control col-span-12">
                                <label htmlFor="editProfileAddress2" className="form-label">
                                    Address 2
                                </label>
                                <input type="text" id="editProfileAddress2" className="form-input" placeholder="Apartment, studio, or floor" />
                            </div>
                            <div className="form-control sm:col-span-6 col-span-12">
                                <label htmlFor="editProfileCity" className="form-label">
                                    City
                                </label>
                                <input type="text" id="editProfileCity" className="form-input" placeholder="Chris@123" />
                            </div>
                            <div className="form-control sm:col-span-6 col-span-12">
                                <label htmlFor="editProfileState" className="form-label">
                                    State
                                </label>
                                <select className="form-select w-full cursor-pointer rounded-md bg-card-color py-[10px] ps-[12px] pe-30 appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                    <option defaultValue="">Choose...</option>
                                    <option value="1">...</option>
                                </select>
                            </div>
                            <div className="form-control col-span-12">
                                <div className="flex items-center gap-10">
                                    <button className="btn btn-primary w-full large">
                                        Save Changes
                                    </button>
                                    <button className="btn btn-white !border-border-color w-full large">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
