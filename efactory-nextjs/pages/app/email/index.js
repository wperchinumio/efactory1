import React, { useState } from 'react'
import {
    IconArchive,
    IconCaretDownFilled,
    IconChevronLeft,
    IconChevronRight,
    IconClockHour9,
    IconFileTypeDoc,
    IconFileTypePdf,
    IconFileZip,
    IconMail,
    IconRefresh,
    IconStarFilled,
    IconTrash,
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
} from '/public/images'
import EmailSidebar from './EmailSidebar'
import Link from 'next/link'
import Image from 'next/image'

export default function EmailInbox() {

    const [emailSide, setEmailSide] = useState(false)
    const emailSideToggle = () => {
        setEmailSide(!emailSide)
    }

    return (
        <div className='flex'>
            <EmailSidebar emailSide={emailSide} />
            <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                <div className='container-fluid'>
                    <div className='md:pb-6 pb-4 md:px-4 flex sm:items-center justify-between sm:flex-row flex-col gap-10'>
                        <div className='flex items-center gap-4 sm:justify-normal justify-between'>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="emailAll"
                                    className="form-check-input"
                                />
                                <label className="form-check-label !text-[16px]/[24px]" htmlFor="emailAll">All</label>
                            </div>
                            <div className='flex items-stretch gap-5'>
                                <button title='Refresh' className='p-5 flex items-center gap-1 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white'>
                                    <IconRefresh className='w-[18px] h-[18px]' />
                                </button>
                                <button className='ps-2 p-5 flex items-center gap-1 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white'>
                                    More
                                    <IconCaretDownFilled className='w-[16px] h-[16px]' />
                                </button>
                                <button className='md:flex hidden ps-2 p-5 items-center gap-1 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white'>
                                    Move to
                                    <IconCaretDownFilled className='w-[16px] h-[16px]' />
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 sm:justify-normal justify-between'>
                            <span className='inline-block'>
                                1-50 of 234
                            </span>
                            <div className='flex items-stretch gap-5 rtl:flex-row-reverse'>
                                <button className='p-5 flex items-center gap-1 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white'>
                                    <IconChevronLeft className='w-[16px] h-[16px]' />
                                </button>
                                <button className='p-5 flex items-center gap-1 text-[14px]/[1] border border-grey rounded-md text-font-color transition-all hover:bg-grey hover:text-white'>
                                    <IconChevronRight className='w-[16px] h-[16px]' />
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
                    </div>
                    <ul className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar1} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Marshall Nichols
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing
                                        </p>
                                        <button className='mt-2 flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-danger py-1 px-4 border border-border-color rounded-full'>
                                            <IconFileTypePdf className='w-[20px] h-[20px] stroke-[1.5]' />
                                            established.pdf
                                        </button>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar2} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Marshall Cameron
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested
                                        </p>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar3} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Brian Swader
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks
                                        </p>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar4} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Edit Toke
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate
                                        </p>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar5} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Dean Otto
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested
                                        </p>
                                        <button className='mt-2 flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-danger py-1 px-4 border border-border-color rounded-full'>
                                            <IconFileTypePdf className='w-[20px] h-[20px] stroke-[1.5]' />
                                            established.pdf
                                        </button>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar6} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Jack Bird
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature
                                        </p>
                                        <div className='mt-2 flex flex-wrap items-stretch gap-4'>
                                            <button className='flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-success py-1 px-4 border border-border-color rounded-full'>
                                                established.exc
                                            </button>
                                            <button className='flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-danger py-1 px-4 border border-border-color rounded-full'>
                                                <IconFileTypePdf className='w-[20px] h-[20px] stroke-[1.5]' />
                                                established.pdf
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar7} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Orlando Lentz
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested
                                        </p>
                                        <button className='mt-2 flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-primary py-1 px-4 border border-border-color rounded-full'>
                                            <IconFileZip className='w-[20px] h-[20px] stroke-[1.5]' />
                                            established.zip
                                        </button>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar1} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Nellie Maxwell
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested
                                        </p>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='p-4 hover:bg-primary-10 group'>
                            <div className='flex items-start gap-4'>
                                <div className='items-end gap-5 sm:flex hidden'>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                        />
                                    </div>
                                    <button>
                                        <IconStarFilled className='w-[18px] h-[18px] fill-font-color-100 transition-all hover:fill-primary' />
                                    </button>
                                </div>
                                <div className='grid xxl:grid-cols-[25%_auto] md:grid-cols-[33.33%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                                    <Link href="/app/email/detail" className='flex gap-2 transition-all'>
                                        <Image src={avatar8} alt='avatar' width="32" height="32" className='w-[32px] h-[32px] min-w-[32px] rounded-md' />
                                        <span className='text-primary truncate'>
                                            Chris Fox
                                        </span>
                                    </Link>
                                    <div className=''>
                                        <p>
                                            It has survived not only five centuries, but also the leap into electronic typesetting
                                        </p>
                                        <button className='mt-2 flex items-center gap-2 min-h-[30px] text-[14px]/[1] text-info py-1 px-4 border border-border-color rounded-full'>
                                            <IconFileTypeDoc className='w-[20px] h-[20px] stroke-[1.5]' />
                                            established.docx
                                        </button>
                                    </div>
                                </div>
                                <div className='min-w-fit flex justify-end ms-auto relative'>
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        Aug 4
                                    </span>
                                    <div className='absolute items-stretch bg-body-color rounded-md hidden group-hover:flex'>
                                        <button title='Archive' className='p-2 text-blue'>
                                            <IconArchive className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Delete' className='p-2 text-blue'>
                                            <IconTrash className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Mark as read' className='p-2 text-blue'>
                                            <IconMail className='w-[16px] h-[16px]' />
                                        </button>
                                        <button title='Snooze' className='p-2 text-blue'>
                                            <IconClockHour9 className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
