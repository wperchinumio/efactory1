import React from 'react'
import {
    avatar2,
    avatar4,
    avatar8,
    avatar9,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function UpComing() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Up Coming
            </div>
            <div className='flex flex-wrap gap-4'>
                <div className='card bg-card-color rounded-xl xxl:flex-[1_0_calc(33.33%-32px)] sm:flex-[1_0_calc(50%-16px)] flex-grow border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                        <h5 className='text-[20px]/[26px] font-medium mb-1'>
                            <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                WT.TH Health analytics
                            </Link>
                        </h5>
                        <p className='text-font-color-100 mb-6'>
                            CRM App application to University Admin..
                        </p>
                        <ul className='flex gap-2 flex-wrap mb-6'>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    12
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Issues
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    2
                                </h6>
                                <small className='text-font-color-100 uppercase'>
                                    Resolved
                                </small>
                            </li>
                            <li className='py-1 px-4 border border-dashed border-border-color rounded-xl'>
                                <h6>
                                    7
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
                        </div>
                        <div className='flex items-center justify-between gap-2 small'>
                            25%
                            <span>
                                Done
                            </span>
                        </div>
                        <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                            <div className='progress-bar w-[25%] bg-danger h-full'></div>
                        </div>
                    </div>
                    <div className='md:px-6 p-4 flex gap-x-3 gap-y-1 flex-wrap'>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Due date :
                            </span>
                            <strong className='min-w-fit'>
                                21 Feb, 2022
                            </strong>
                        </div>
                        <span className='inline-block'>|</span>
                        <div className='flex gap-1 flex-wrap'>
                            <span className='min-w-fit'>
                                Budget :
                            </span>
                            <strong className='min-w-fit'>
                                $2,050
                            </strong>
                        </div>
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl xxl:flex-[1_0_calc(33.33%-32px)] sm:flex-[1_0_calc(50%-16px)] flex-grow border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                        <h5 className='text-[20px]/[26px] font-medium mb-1'>
                            <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                TRG Banking
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
                            <Image src={avatar8} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar9} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
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
                                21 Ayg, 2022
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
            </div>
        </>
    )
}
