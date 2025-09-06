import React, { useState } from 'react'
import EmailSidebar from './EmailSidebar'
import {
    IconArchiveFilled,
    IconArrowBackUp,
    IconArrowForwardUp,
    IconArrowLeft,
    IconCaretDownFilled,
    IconCircleArrowRight,
    IconDots,
    IconFileTypeDoc,
    IconFileTypePdf,
    IconFileTypeXls,
    IconInfoCircleFilled,
    IconSubtask,
    IconTags,
    IconTrashFilled,
} from '@tabler/icons-react'
import {
    avatar1,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function EmailDetail() {

    const [emailSide, setEmailSide] = useState(false)
    const emailSideToggle = () => {
        setEmailSide(!emailSide)
    }

    return (
        <div className='flex'>
            <EmailSidebar emailSide={emailSide} />
            <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                <div className='container-fluid'>
                    <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                        <div className='flex items-center md:gap-2 gap-4'>
                            <button title='Archive' className='md:p-2 flex items-center justify-center gap-2'>
                                <IconArchiveFilled className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='md:p-2 flex items-center justify-center gap-2'>
                                <IconTrashFilled className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Info' className='md:p-2 flex items-center justify-center gap-2'>
                                <IconInfoCircleFilled className='w-[20px] h-[20px]' />
                            </button>
                            <button className='md:p-2 flex items-center justify-center gap-2'>
                                <IconSubtask className='w-[20px] h-[20px]' />
                                <span className='md:block hidden'>
                                    Add to task
                                </span>
                            </button>
                            <button className='md:p-2 flex items-center justify-center gap-2'>
                                <IconCircleArrowRight className='w-[20px] h-[20px]' />
                                <span className='md:block hidden'>
                                    Move to
                                </span>
                            </button>
                            <button className='md:p-2 flex items-center justify-center gap-2'>
                                <IconTags className='w-[20px] h-[20px]' />
                                <span className='md:block hidden'>
                                    Labels
                                </span>
                            </button>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <button onClick={emailSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${emailSide ? 'opened' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 100 100">
                                <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                <path className="line line2" d="M 20,50 H 80" />
                                <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                            </svg>
                        </button>
                    </div>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <div className='md:p-6 p-4 flex items-center gap-4'>
                            <Link href="/app/email" title='Back'>
                                <IconArrowLeft className='stroke-[3] stroke-primary rtl:rotate-180' />
                            </Link>
                            <p className='md:text-[20px]/[24px] font-semibold'>
                                Project Outsourcing/Lead Generation/Freelancer Bidder
                            </p>
                        </div>
                        <div className='py-4 md:px-6 px-4 bg-body-color flex gap-4'>
                            <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full mt-2' />
                            <div className='flex flex-col gap-5 flex-1'>
                                <p className='flex flex-wrap gap-x-5'>
                                    Marshall Nichols
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        info@examples.com
                                    </Link>
                                </p>
                                <div className='flex gap-5'>
                                    <span>
                                        To :
                                    </span>
                                    <div className='relative group'>
                                        <button className='flex items-center gap-1 text-blue underline'>
                                            Me
                                            <IconCaretDownFilled className='w-[14px] h-[14px]' />
                                        </button>
                                        <div className='bg-card-color text-font-color rounded-xl overflow-auto max-h-[300px] custom-scrollbar w-[210px] shadow-shadow-lg absolute -left-30 rtl:-right-30 top-full origin-top-left rtl:origin-top-right z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100'>
                                            <div className='p-4 flex flex-col gap-2'>
                                                <div className='flex gap-2 text-[14px]/[20px]'>
                                                    <span className='inline-block min-w-fit'>
                                                        from :
                                                    </span>
                                                    <div>
                                                        <p className='text-font-color-100'>
                                                            Info-TM
                                                        </p>
                                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                                            info@example.com
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 text-[14px]/[20px]'>
                                                    <span className='inline-block min-w-fit'>
                                                        to :
                                                    </span>
                                                    <div>
                                                        <p className='text-font-color-100'>
                                                            Chris Fox
                                                        </p>
                                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                                            info@example.com
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 text-[14px]/[20px]'>
                                                    <span className='inline-block min-w-fit'>
                                                        cc :
                                                    </span>
                                                    <div>
                                                        <p className='text-font-color-100'>
                                                            Chris Fox
                                                        </p>
                                                        <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                                            info@example.com
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 text-[14px]/[20px]'>
                                                    <span className='inline-block min-w-fit'>
                                                        date :
                                                    </span>
                                                    <div>
                                                        <p className='text-font-color-100'>
                                                            Aug 2, 2021, 11:27 AM
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 text-[14px]/[20px]'>
                                                    <span className='inline-block min-w-fit'>
                                                        subject :
                                                    </span>
                                                    <div>
                                                        <p className='text-font-color-100'>
                                                            #1706W025010 | Payment Request
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <p className='md:block hidden'>
                                    Jul 29, 2019, 4:37 PM
                                </p>
                                <button title='Reply' className='text-blue md:block hidden'>
                                    <IconArrowBackUp className='w-[20px] h-[20px]' />
                                </button>
                                <button className='p-[2px] text-blue'>
                                    <IconDots className='w-[20px] h-[20px]' />
                                </button>
                            </div>
                        </div>
                        <div className='md:p-6 p-4'>
                            <div className='pb-4 mb-4 border-b border-border-color '>
                                <p>Hello,</p>
                                <br />
                                <p>I am project outsourcer if need any type of project (website / apps any IT Project ) please read.</p>
                                <br />
                                <p className='mb-4'>I am a BDM (Expert in Lead Generation) and I have 11 years of experience in this industry and do the work of outsourcing the project. I am searching an urgent basis expert developer team or company. I have a regular customer, agency, and consultant overseas like USA, Canada, UK etc. Which gives me regular work. There is a lot of projects. They discuss me with every kind of project. I have done a lot of projects with them. And have maintained their relationship. So I have no shortage of any kind of project.</p>
                                <p className='mb-4'><strong>I will provide 3 Type of service.</strong></p>
                                <ul className='mb-4 list-disc ps-4'>
                                    <li>Direct Project (Outsourcing) Business $5000 minimum in 45 working days.</li>
                                    <li>Lead Provide (Domestic and International)</li>
                                    <li>If you need Bidder so working your profile (25 Bidding Portal)</li>
                                </ul>
                                <p className="text-info">Purchase: LUNO has not yet purchased this item from you.</p>
                                <br />
                                <p className='mb-4'>Luno</p>
                                <div>Skype : luno</div>
                                <div>Website: luno.com</div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Link href="#" className="py-2 px-4 rounded-md flex items-center gap-4 border border-border-color transition-all hover:border-primary">
                                    <div className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color text-success flex items-center justify-center'>
                                        <IconFileTypeXls className='stroke-[1.5]' />
                                    </div>
                                    <div>
                                        <p>Report2017.xls</p>
                                        <div className="text-font-color-100 text-[14px]/[20px]">Size: 68KB</div>
                                    </div>
                                </Link>
                                <Link href="#" className="py-2 px-4 rounded-md flex items-center gap-4 border border-border-color transition-all hover:border-primary">
                                    <div className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color text-info flex items-center justify-center'>
                                        <IconFileTypeDoc className='stroke-[1.5]' />
                                    </div>
                                    <div>
                                        <p>Report2017.doc</p>
                                        <div className="text-font-color-100 text-[14px]/[20px]">Size: 68KB</div>
                                    </div>
                                </Link>
                                <Link href="#" className="py-2 px-4 rounded-md flex items-center gap-4 border border-border-color transition-all hover:border-primary">
                                    <div className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color text-danger flex items-center justify-center'>
                                        <IconFileTypePdf className='stroke-[1.5]' />
                                    </div>
                                    <div>
                                        <p>Report2017.pdf</p>
                                        <div className="text-font-color-100 text-[14px]/[20px]">Size: 168KB</div>
                                    </div>
                                </Link>
                            </div>
                            <div className='flex items-stretch gap-2'>
                                <button className='btn btn-outline-secondary'>
                                    <IconArrowBackUp className='w-[18px] h-[18px]' />
                                    Reply
                                </button>
                                <button className='btn btn-outline-secondary'>
                                    <IconArrowForwardUp className='w-[18px] h-[18px]' />
                                    Forward
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
