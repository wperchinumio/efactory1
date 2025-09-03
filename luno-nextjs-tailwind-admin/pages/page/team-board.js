import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import {
    IconArchiveFilled,
    IconFileFilled,
    IconLayout2Filled,
    IconSearch,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar8,
    avatar9,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function TeamBorad() {

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Teams Board",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 flex md:gap-4 gap-2 items-center border border-dashed border-border-color'>
                        <div className='sm:w-[56px] sm:h-[56px] sm:min-w-[56px] w-[40px] h-[40px] min-w-[40px] text-secondary bg-primary-10 rounded-full flex items-center justify-center'>
                            <IconArchiveFilled />
                        </div>
                        <div>
                            <p className='text-font-color-100'>
                                Total Projects
                            </p>
                            <h5 className='text-[20px]/[24px] font-medium'>
                                24
                            </h5>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 flex md:gap-4 gap-2 items-center border border-dashed border-border-color'>
                        <div className='sm:w-[56px] sm:h-[56px] sm:min-w-[56px] w-[40px] h-[40px] min-w-[40px] text-secondary bg-primary-10 rounded-full flex items-center justify-center'>
                            <IconLayout2Filled />
                        </div>
                        <div>
                            <p className='text-font-color-100'>
                                Completed Projects
                            </p>
                            <h5 className='text-[20px]/[24px] font-medium'>
                                22
                            </h5>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 flex md:gap-4 gap-2 items-center border border-dashed border-border-color'>
                        <div className='sm:w-[56px] sm:h-[56px] sm:min-w-[56px] w-[40px] h-[40px] min-w-[40px] text-secondary bg-primary-10 rounded-full flex items-center justify-center'>
                            <IconFileFilled />
                        </div>
                        <div>
                            <p className='text-font-color-100'>
                                Pending Projects
                            </p>
                            <h5 className='text-[20px]/[24px] font-medium'>
                                06
                            </h5>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <label className="form-label mb-5 inline-block">Search</label>
                        <div className='form-control flex w-full'>
                            <input
                                type="text"
                                id="team_board_search"
                                className="form-input !rounded-e-none !py-[6px]"
                                placeholder="Search..."
                            />
                            <button className="btn border border-border-color !rounded-s-none" type="button">
                                <IconSearch className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </div>
                <Tabs>
                    <TabList className="flex flex-wrap gap-y-4 md:px-6 px-2 pt-2 relative border-b border-border-color">
                        <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                            Active
                            <span className="py-1 px-2 rounded-md bg-success text-white text-[12px]/[1] font-bold">
                                5
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                            Paused
                            <span className="py-1 px-2 rounded-md bg-info text-white text-[12px]/[1] font-bold">
                                2
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                            Waiting
                            <span className="py-1 px-2 rounded-md bg-warning text-font-color text-[12px]/[1] font-bold">
                                4
                            </span>
                        </Tab>
                        <Tab className="flex items-center gap-2 cursor-pointer py-2 md:px-4 px-3 md:text-base text-[14px]/[16px] border-b-[7px] border-transparent text-center -mb-1 transition-all hover:text-primary hover:border-primary focus:outline-0" selectedClassName='!border-primary text-primary'>
                            Delete
                            <span className="py-1 px-2 rounded-md bg-danger text-white text-[12px]/[1] font-bold">
                                1
                            </span>
                        </Tab>
                    </TabList>
                    <div className='mt-6'>
                        <TabPanel>
                            <div className='grid xxl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            PSD to HTML onepage
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                124
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                452
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                85
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar1} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar3} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            78/85
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[95%] bg-success h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            Angular onepage webapp
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                23
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                105
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar5} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            23/37
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[63%] bg-warning h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            New iOS Food App Design
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                45
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                210
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar9} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            12/47
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[23%] bg-danger h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        GREEN INC.
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            New Admin Design
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                124
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                452
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                85
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar10} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            55/85
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[80%] bg-info h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        RED LLP.
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            OnePage Landing Page HTML
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                23
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                105
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            19/37
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[55%] bg-warning h-full'></div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className='grid xxl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            New iOS Food App Design
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                45
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                210
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar9} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            12/47
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[23%] bg-danger h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        RED LLP.
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            OnePage Landing Page HTML
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                23
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                105
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            19/37
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[55%] bg-warning h-full'></div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className='grid xxl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            PSD to HTML onepage
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                124
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                452
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                85
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar1} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar3} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            78/85
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[95%] bg-success h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            Angular onepage webapp
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                23
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                105
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar5} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            23/37
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[63%] bg-warning h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        ORANGE LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            New iOS Food App Design
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                45
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                210
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar9} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            12/47
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[23%] bg-danger h-full'></div>
                                    </div>
                                </div>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        BLACK LIMITED
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            React Native news app
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                45
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                210
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                47
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            9/47
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[12%] bg-danger h-full'></div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className='grid xxl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                                    <p className='text-font-color-100 mb-1 small uppercase'>
                                        RED LLP.
                                    </p>
                                    <h5 className='text-[20px]/[26px] font-medium mb-6'>
                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                            OnePage Landing Page HTML
                                        </Link>
                                    </h5>
                                    <div className='mb-4'>
                                        <p className='line-clamp-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                            Lorem Ipsum is simply dummy text of the printing and typesetting a galley of type and scrambled it...
                                        </p>
                                        <Link href="#" className='text-font-color-100'>
                                            View More
                                        </Link>
                                    </div>
                                    <ul className='flex gap-8 flex-wrap mb-6'>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                23
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Attachments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                105
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Comments
                                            </small>
                                        </li>
                                        <li>
                                            <h6 className='text-[20px]/[26px] font-medium'>
                                                37
                                            </h6>
                                            <small className='text-font-color-100'>
                                                Tasks
                                            </small>
                                        </li>
                                    </ul>
                                    <div className='flex items-center flex-wrap gap-1 mb-4'>
                                        <label className='me-1'>
                                            Team :
                                        </label>
                                        <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar6} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                        <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    </div>
                                    <div className='flex items-center justify-between gap-2 small'>
                                        Task completed :
                                        <span>
                                            19/37
                                        </span>
                                    </div>
                                    <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                        <div className='progress-bar w-[55%] bg-warning h-full'></div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
