import React from 'react'
import {
    IconAlertTriangle,
    IconClockHour9,
    IconInbox,
    IconMail,
    IconNote,
    IconSend,
    IconShieldHeart,
    IconTag,
    IconTrash,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function Sidebar({ emailSide }) {
    return (
        <div className={`bg-card-color min-w-[210px] w-[210px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${emailSide ? 'left-0 rtl:right-0 shadow-shadow-lg' : '-left-full rtl:-right-full'}`}>
            <Link href="/app/email/compose" className='btn bg-secondary large text-white w-full'>
                New Message
            </Link>
            <ul className='py-6 flex flex-col gap-4 border-b border-border-color'>
                <li>
                    <Link href="/app/email" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconInbox className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Inbox
                        </span>
                        <span className='inline-block bg-body-color rounded-md py-1 px-2 text-[12px]/[1] text-font-color font-semibold'>
                            23
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconClockHour9 className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Snooze
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconShieldHeart className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Important
                        </span>
                        <span className='inline-block bg-body-color rounded-md py-1 px-2 text-[12px]/[1] text-font-color font-semibold'>
                            3
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconSend className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Sent
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconNote className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Drafts
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconMail className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            All Mail
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconAlertTriangle className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Spam
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconTrash className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Trash
                        </span>
                        <span className='inline-block bg-body-color rounded-md py-1 px-2 text-[12px]/[1] text-font-color font-semibold'>
                            68
                        </span>
                    </Link>
                </li>
            </ul>
            <p className='py-4 uppercase text-font-color-100 text-[14px]/[20px]'>
                CATEGORIES
            </p>
            <ul className='flex flex-col gap-4'>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconTag className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Angular
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconTag className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Ui UX Design
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconTag className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Developemnt
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="#" className='flex items-center gap-10 transition-all hover:text-primary'>
                        <IconTag className='w-[18px] h-[18px]' />
                        <span className='flex-1 inline-block'>
                            Marketing
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
