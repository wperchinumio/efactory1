import React from 'react'
import {
    IconChevronDown,
    IconChevronUp,
    IconCloudDownload,
    IconFileText,
    IconMailFilled,
    IconShare,
} from '@tabler/icons-react'

interface WelcomeHeaderProps {
	report?: boolean;
	income?: boolean;
}

export default function WelcomeHeader({ report, income }: WelcomeHeaderProps) {
    return (
        <div className='flex md:items-center md:justify-between md:flex-row flex-col gap-15 md:mb-12 mb-6'>
            <div>
                <p className='text-[20px]/[24px] font-medium mb-1'>
                    Welcome back, Allie!
                </p>
                <p className='text-[14px]/[20px] text-font-color-100'>
                    You have 12 new messages and 7 new notifications.
                </p>
            </div>
            {report ? <div className='form-control flex md:justify-end flex-1'>
                <input type='text' id='dateRange' name='dateRange' className='form-input ssm:text-[14px]/[1] text-[12px]/[1] !py-2 !rounded-e-none w-full max-w-[300px]' defaultValue="04/12/2023 - 04/01/2024" />
                <button title='Send Report' className='py-2 px-3 bg-grey text-white transition-all hover:opacity-80'>
                    <IconMailFilled className='w-[16px] h-[16px]' />
                </button>
                <button title='Download Report' className='py-2 px-3 bg-grey text-white transition-all hover:opacity-80'>
                    <IconCloudDownload className='w-[16px] h-[16px]' />
                </button>
                <button title='Generate PDF' className='py-2 px-3 bg-grey text-white transition-all hover:opacity-80'>
                    <IconFileText className='w-[16px] h-[16px]' />
                </button>
                <button title='Share Dashboard' className='py-2 px-3 bg-grey text-white transition-all hover:opacity-80 rounded-e-md'>
                    <IconShare className='w-[16px] h-[16px]' />
                </button>
            </div>
                : income ?
                    <div className='flex'>
                        <div className='pe-4 border-e border-border-color'>
                            <div className='flex items-end gap-1 flex-wrap'>
                                <span className='md:text-[20px]/[26px] font-medium'>
                                    8.18K
                                </span>
                                <span className='text-[14px]/[20px] text-secondary flex items-end gap-1'>
                                    <IconChevronUp className='w-[14px] h-[14px]' />
                                    1.3%
                                </span>
                            </div>
                            <div className='md:text-[14px]/[20px] text-[12px]/[16px] text-font-color-100 uppercase'>
                                INCOME
                            </div>
                        </div>
                        <div className='px-4 border-e border-border-color'>
                            <div className='flex items-end gap-1 flex-wrap'>
                                <span className='md:text-[20px]/[26px] font-medium'>
                                    1.11K
                                </span>
                                <span className='text-[14px]/[20px] text-secondary flex items-end gap-1'>
                                    <IconChevronUp className='w-[14px] h-[14px]' />
                                    4.1%
                                </span>
                            </div>
                            <div className='md:text-[14px]/[20px] text-[12px]/[16px] text-font-color-100 uppercase'>
                                EXPENSE
                            </div>
                        </div>
                        <div className='ps-4'>
                            <div className='flex items-end gap-1 flex-wrap'>
                                <span className='md:text-[20px]/[26px] font-medium'>
                                    3.66K
                                </span>
                                <span className='text-[14px]/[20px] text-danger flex items-end gap-1'>
                                    <IconChevronDown className='w-[14px] h-[14px]' />
                                    7.5%
                                </span>
                            </div>
                            <div className='md:text-[14px]/[20px] text-[12px]/[16px] text-font-color-100 uppercase'>
                                REVENUE
                            </div>
                        </div>
                    </div>
                    : ''
            }
        </div>
    )
}
