import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar6,
    modal_connection,
    modal_event,
    modal_joblisting,
    modal_ordertracking,
} from '../../../public/images'
import {
    IconCheck,
    IconCircleCheckFilled,
    IconClockHour9,
    IconMapPin,
    IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Modals() {

    const breadcrumbItem = [
        {
            name: "Modals",
        },
    ]

    const [connectionRequestModal, setConnectionRequestModal] = useState(false)
    const ConnectionRequestModal = () => {
        setConnectionRequestModal(!connectionRequestModal)
    }
    useEffect(() => {
        document.body.classList[connectionRequestModal ? "add" : "remove"]("overflow-hidden")
    }, [connectionRequestModal])

    const [createEventModal, setCreateEventModal] = useState(false)
    const openCreateEventModal = () => {
        setCreateEventModal(!createEventModal)
    }
    useEffect(() => {
        document.body.classList[createEventModal ? "add" : "remove"]("overflow-hidden")
    }, [createEventModal])

    const [jobListingModal, setJobListingModal] = useState(false)
    const openJobListingModal = () => {
        setJobListingModal(!jobListingModal)
    }
    useEffect(() => {
        document.body.classList[jobListingModal ? "add" : "remove"]("overflow-hidden")
    }, [jobListingModal])

    const [orderTrackingModal, setOrderTrackingModal] = useState(false)
    const openOrderTrackingModal = () => {
        setOrderTrackingModal(!orderTrackingModal)
    }
    useEffect(() => {
        document.body.classList[orderTrackingModal ? "add" : "remove"]("overflow-hidden")
    }, [orderTrackingModal])

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='card bg-card-color md:p-6 p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color'>
                        <Image src={modal_connection} alt='modal popup' className='mb-6' />
                        <h5 className='text-[20px]/[24px] font-medium mb-2 text-center'>
                            Connection Request
                        </h5>
                        <p className="text-font-color-100 mb-4 text-center">
                            Click on the below buttons to launch a Connection Request example.
                        </p>
                        <button onClick={ConnectionRequestModal} className="btn btn-primary uppercase">
                            View in modals
                        </button>
                    </div>
                    <div className='card bg-card-color md:p-6 p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color'>
                        <Image src={modal_event} alt='modal popup' className='mb-6' />
                        <h5 className='text-[20px]/[24px] font-medium mb-2 text-center'>
                            Create Event
                        </h5>
                        <p className="text-font-color-100 mb-4 text-center">
                            Click on the below buttons to launch a Create Event example.
                        </p>
                        <button onClick={openCreateEventModal} className="btn btn-primary uppercase">
                            View in modals
                        </button>
                    </div>
                    <div className='card bg-card-color md:p-6 p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color'>
                        <Image src={modal_joblisting} alt='modal popup' className='mb-6' />
                        <h5 className='text-[20px]/[24px] font-medium mb-2 text-center'>
                            Job listing
                        </h5>
                        <p className="text-font-color-100 mb-4 text-center">
                            Click on the below buttons to launch a Job listing example.
                        </p>
                        <button onClick={openJobListingModal} className="btn btn-primary uppercase">
                            View in modals
                        </button>
                    </div>
                    <div className='card bg-card-color md:p-6 p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color'>
                        <Image src={modal_ordertracking} alt='modal popup' className='mb-6' />
                        <h5 className='text-[20px]/[24px] font-medium mb-2 text-center'>
                            Order Tracking
                        </h5>
                        <p className="text-font-color-100 mb-4 text-center">
                            Click on the below buttons to launch a Order Tracking example.
                        </p>
                        <button onClick={openOrderTrackingModal} className="btn btn-primary uppercase">
                            View in modals
                        </button>
                    </div>
                </div>
                {connectionRequestModal &&
                    <>
                        <div className={`fixed p-4 w-full max-w-[800px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='py-2.5 md:px-2.5 px-[7px] bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='my-2.5 lg:px-5 md:px-2.5 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                    <div className='flex justify-between items-start gap-4'>
                                        <div>
                                            <h5 className='text-[20px]/[30px] font-medium'>
                                                Connection Request
                                            </h5>
                                            <p className="text-font-color-100 small">If you are going to use a passage of Lorem Ipsum, you need</p>
                                        </div>
                                        <button onClick={ConnectionRequestModal} className=''>
                                            <IconX />
                                        </button>
                                    </div>
                                    <ul className="flex flex-col md:gap-8 gap-6 mt-6">
                                        <li className="flex sm:items-center sm:gap-4 gap-2 sm:flex-row flex-col">
                                            <Image src={avatar1} alt="user profile" className='rounded-full w-[36px] h-[36px] min-w-[36px]' />
                                            <div className='flex-grow'>
                                                <h6 className="font-medium">Chris Fox</h6>
                                                <p className="text-font-color-100 small">21 mutual connections Sr. ReatJs Developer at Facebook</p>
                                            </div>
                                            <div className="flex items-stretch gap-2">
                                                <button className="btn btn-light-primary">
                                                    <IconCheck className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Accept</span>
                                                </button>
                                                <button className="btn btn-light-danger">
                                                    <IconX className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Ignore</span>
                                                </button>
                                            </div>
                                        </li>
                                        <li className="flex sm:items-center sm:gap-4 gap-2 sm:flex-row flex-col">
                                            <Image src={avatar2} alt="user profile" className='rounded-full w-[36px] h-[36px] min-w-[36px]' />
                                            <div className='flex-grow'>
                                                <h6 className="font-medium">Marshall Nichols</h6>
                                                <p className="text-font-color-100 small">5 mutual connections Web Designer at Google</p>
                                            </div>
                                            <div className="flex items-stretch gap-2">
                                                <button className="btn btn-light-primary">
                                                    <IconCheck className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Accept</span>
                                                </button>
                                                <button className="btn btn-light-danger">
                                                    <IconX className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Ignore</span>
                                                </button>
                                            </div>
                                        </li>
                                        <li className="flex sm:items-center sm:gap-4 gap-2 sm:flex-row flex-col">
                                            <Image src={avatar3} alt="user profile" className='rounded-full w-[36px] h-[36px] min-w-[36px]' />
                                            <div className='flex-grow'>
                                                <h6 className="font-medium">Orlando Lentz</h6>
                                                <p className="text-font-color-100 small">9 mutual connections Laravel Developer at Linkedin</p>
                                            </div>
                                            <div className="flex items-stretch gap-2">
                                                <button className="btn btn-light-primary">
                                                    <IconCheck className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Accept</span>
                                                </button>
                                                <button className="btn btn-light-danger">
                                                    <IconX className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Ignore</span>
                                                </button>
                                            </div>
                                        </li>
                                        <li className="flex sm:items-center sm:gap-4 gap-2 sm:flex-row flex-col">
                                            <Image src={avatar4} alt="user profile" className='rounded-full w-[36px] h-[36px] min-w-[36px]' />
                                            <div className='flex-grow'>
                                                <h6 className="font-medium">Alexander</h6>
                                                <p className="text-font-color-100 small">18 mutual connections PHP Developer at Facebook</p>
                                            </div>
                                            <div className="flex items-stretch gap-2">
                                                <button className="btn btn-light-primary">
                                                    <IconCheck className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Accept</span>
                                                </button>
                                                <button className="btn btn-light-danger">
                                                    <IconX className='w-[18px] h-[18px] min-w-[18px]' />
                                                    <span className='md:block hidden'>Ignore</span>
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div onClick={ConnectionRequestModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
                {createEventModal &&
                    <>
                        <div className={`fixed p-4 w-full max-w-[800px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='py-2.5 md:px-2.5 px-[7px] bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='my-2.5 lg:px-5 md:px-2.5 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                    <div className='text-[24px]/[30px] font-medium mb-2'>
                                        Create Event
                                    </div>
                                    <div className='text-font-color-100 mb-6'>
                                        All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label htmlFor='campaignsTitle' className='form-label'>
                                            Campaigns Title
                                        </label>
                                        <input type='text' id='campaignsTitle' placeholder='Campaigns Title' className='form-input' />
                                    </div>
                                    <div className="form-control mb-4 flex flex-col">
                                        <label className='form-label'>Campaigns Description</label>
                                        <textarea className="form-textarea" placeholder="Leave a comment here" rows={3}></textarea>
                                    </div>
                                    <div className='grid sm:grid-cols-3 grid-cols-1 gap-2.5 mb-1'>
                                        <div className="form-control">
                                            <label htmlFor='campaignsDate' className='form-label'>Date</label>
                                            <input type="date" id='campaignsDate' className="form-input" placeholder="Select Date" />
                                        </div>
                                        <div className="form-control">
                                            <label htmlFor='campaignsTime' className='form-label'>Time</label>
                                            <input type="time" id='campaignsTime' className="form-input" placeholder="Select Time" />
                                        </div>
                                        <div className='form-control'>
                                            <label htmlFor='campaignsDuration' className='form-label'>
                                                Duration
                                            </label>
                                            <input type='text' id='campaignsDuration' placeholder='1h 45m' className='form-input' />
                                        </div>
                                    </div>
                                    <p className="text-[14px]/[20px] text-font-color-100 flex gap-1.5 mb-4">
                                        <IconCircleCheckFilled className='w-[16px] h-[16px] min-w-[16px] mt-[2px]' />
                                        This event will take place on the july 14, 2022 form 02:30 PM untill 05:15 PM
                                    </p>
                                    <div className='grid sm:grid-cols-2 grid-cols-1 gap-2.5 mb-4'>
                                        <div className='form-control'>
                                            <label htmlFor='campaignsLocation' className='form-label'>
                                                Location
                                            </label>
                                            <input type='text' id='campaignsLocation' placeholder='Location' className='form-input' />
                                        </div>
                                        <div className='form-control'>
                                            <label htmlFor='campaignsLocation' className='form-label'>
                                                Add guests
                                            </label>
                                            <div className="form-control flex">
                                                <input type="text" className="form-input !rounded-r-none" placeholder="Recipient's username" />
                                                <button className="btn btn-outline-secondary !border-border-color !rounded-l-none" type="button">
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-control mb-4 flex gap-2 items-center'>
                                        <label className='form-label'>
                                            Participate :
                                        </label>
                                        <Link href="#">
                                            <Image src={avatar1} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                        </Link>
                                        <Link href="#">
                                            <Image src={avatar2} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                        </Link>
                                        <Link href="#">
                                            <Image src={avatar3} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                        </Link>
                                        <Link href="#">
                                            <Image src={avatar4} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                        </Link>
                                    </div>
                                    <div className='form-control mb-4'>
                                        <label className='form-label'>
                                            Set reminder
                                        </label>
                                        <div className='relative w-full flex'>
                                            <div className="flex items-center justify-center gap-4 border border-border-color rounded-s-md mr-[-1px] py-[6px] px-[12px] bg-body-color">
                                                <div className="form-radio">
                                                    <input
                                                        type="radio"
                                                        id="campaignsEmail"
                                                        name="campaignsReminder"
                                                        className="form-radio-input"
                                                    />
                                                    <label className="form-radio-label" htmlFor="campaignsEmail">Email</label>
                                                </div>
                                                <div className="form-radio">
                                                    <input
                                                        type="radio"
                                                        id="campaignsStack"
                                                        name="campaignsReminder"
                                                        className="form-radio-input"
                                                    />
                                                    <label className="form-radio-label" htmlFor="campaignsStack">Stack</label>
                                                </div>
                                            </div>
                                            <input type='text' className='form-input !rounded-s-none' />
                                        </div>
                                    </div>
                                    <div className='flex items-stretch gap-1.5'>
                                        <button onClick={openCreateEventModal} className='btn btn-secondary'>
                                            Close
                                        </button>
                                        <button className='btn btn-primary'>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={openCreateEventModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
                {jobListingModal &&
                    <>
                        <div className={`fixed p-4 w-full max-w-[500px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='bg-card-color rounded-lg shadow-shadow-lg overflow-hidden'>
                                <div className='p-4 flex gap-1.5 justify-between border-b border-border-color'>
                                    <p className='text-[20px]/[26px] font-medium'>
                                        Job listing
                                    </p>
                                    <button onClick={openJobListingModal} className=''>
                                        <IconX />
                                    </button>
                                </div>
                                <div className='py-2.5 md:px-2.5 px-[7px] bg-body-color'>
                                    <div className='my-2.5 lg:px-5 md:px-2.5 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                        <p className="text-font-color-100 mb-4">If you are going to use a passage of Lorem Ipsum, you need</p>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4 mb-2'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-primary">Creative &amp; Art</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">User Experience Designer Employee</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4 mb-2'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-secondary">UI/UX</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">User Experience Designer Employee</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-chart-color3">Finance & Accounting</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">Foreign Language Research Analyst</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={openJobListingModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
                {orderTrackingModal &&
                    <>
                        <div className={`fixed p-4 w-full max-w-[800px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='py-2.5 md:px-2.5 px-[7px] bg-card-color rounded-lg shadow-shadow-lg'>
                                <div className='my-2.5 lg:px-5 md:px-2.5 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                    <div className='text-[24px]/[30px] font-medium mb-2'>
                                        Order Tracking
                                    </div>
                                    <div className='text-font-color-100 mb-6'>
                                        All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary
                                    </div>
                                    <div className="bg-body-color md:p-4 p-2 mb-2 rounded-xl">
                                        <p className="mb-1">Expected Arrival <span>01/06/2022</span></p>
                                        <p>Luno <span className="font-bold"><Link href="#" className='text-primary transition-all hover:text-secondary'>V504KO</Link></span></p>
                                    </div>
                                    <ul className='ms-24 border-s-[3px] border-secondary'>
                                        <li data-date="12:30 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                New Order
                                                <span className="py-[3px] px-[6px] bg-warning rounded-md text-[10px]/[1]">
                                                    ID: 215
                                                </span>
                                            </div>
                                            <div>
                                                <small className="text-font-color-100">1 Burger, 1 Corn Rice curd</small>
                                            </div>
                                        </li>
                                        <li data-date="12:31 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                Order Received
                                            </div>
                                        </li>
                                        <li data-date="12:32 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                Payment Verify
                                            </div>
                                            <div>
                                                <h5 className="text-[20px]/[30px] font-medium text-success">$80.5 - Done</h5>
                                                <small className="text-font-color-100">NetBanking</small>
                                            </div>
                                        </li>
                                        <li data-date="12:35 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                Order inprogress
                                            </div>
                                            <div className='flex items-center flex-wrap gap-1'>
                                                <label className='me-1'>
                                                    Team :
                                                </label>
                                                <Image src={avatar1} alt='user' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                                                <Image src={avatar2} alt='user' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                                                <Image src={avatar3} alt='user' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                                                <Image src={avatar4} alt='user' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                                            </div>
                                        </li>
                                        <li data-date="12:55 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                Delivery on the way
                                            </div>
                                            <div>
                                                <p className="text-font-color-100 small flex gap-1 items-center mb-1"><IconMapPin className='w-[16px] h-[16px] min-w-[16px]' /> 123 6th St. Melbourne, FL 32904</p>
                                                <Link href="#" className='flex items-center gap-1'>
                                                    <Image src={avatar6} alt='user' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                                                    Robert Hammer
                                                </Link>
                                            </div>
                                        </li>
                                        <li data-date="01:10 - Sun" className='relative mb-1 last:mb-0 py-2 px-4 before:content-[attr(data-date)] before:min-w-[100px] before:text-[12px]/[18px] before:text-start before:absolute before:end-[calc(100%+20px)] after:absolute after:w-15 after:h-15 after:bg-card-color after:top-10 after:rounded-full after:end-[calc(100%-6px)] after:border-[3px] after:border-primary'>
                                            <div className="font-bold small flex justify-between items-center">
                                                Delivery
                                                <span className="py-[3px] px-[6px] bg-success text-white rounded-md text-[10px]/[1]">
                                                    Done
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div onClick={openOrderTrackingModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
            </div>
        </div>
    )
}
