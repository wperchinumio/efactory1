import React from 'react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar6,
} from '/public/images'
import Link from 'next/link'
import Image from 'next/image'

export default function Activity() {
    return (
        <>
            <h5 className='text-[20px]/[24px] font-medium mb-4'>
                User Activity
            </h5>
            <div className='project-activity card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-primary after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                    <div>
                        <p className='mb-1'>
                            Gerald Vaughn changed the status to QA on <strong>MA-86 - Retargeting Ads</strong>
                        </p>
                        <p className='small text-font-color-100'>
                            New Dashboard Design - 9:24PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 sm:mt-3 border border-dashed border-border-color rounded-xl'>
                            <p>
                                I've prepared all sizes for you. Can you take a look tonight so we can prepare my final invoice?
                            </p>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-secondary after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar2} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                    <div>
                        <p className='mb-1'>
                            Gerald Vaughn commented on <strong>DA-459 - Mediation: Demand Source Logo Size</strong>
                        </p>
                        <p className='small text-font-color-100'>
                            Portfolio Updates for Jason Carroll - 7:12PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>Orlando</strong></Link>
                        </p>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color3 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar3} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                    <div>
                        <p className='mb-1'>
                            Gerald Vaughn changed the status to QA on <strong>MA-45 - Finish Prototype</strong>
                        </p>
                        <p className='small text-font-color-100'>
                            New Dashboard Design - 11:30AM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color1 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                    <div>
                        <p className='mb-1'>
                            Create new module development team for <Link href="#" className='text-primary transition-all hover:text-secondary'>MA-86</Link> stocks for our Instagram channel
                        </p>
                        <p className='small text-font-color-100'>
                            ReactJs, Nodejs - 7:58AM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 sm:mt-3 border border-dashed border-border-color rounded-xl'>
                            <p>
                                What do you think about these? Should I continue in this style?
                            </p>
                        </div>
                        <div className='flex gap-1 items-center mt-4'>
                            <span className='me-2'>
                                Team :
                            </span>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='NodeJs'>
                                <Image src={avatar2} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar3} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar4} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-full saturate-50 hover:saturate-100' />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color2 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar6} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                    <div>
                        <p className='mb-1'>
                            update new source code on GitHub <strong>MA-78 - Retargeting React Webapp</strong>
                        </p>
                        <p className='small text-font-color-100'>
                            New Dashboard Design - 9:24PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>Chris</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 mt-3 rounded-xl border border-dashed border-success bg-success-50 text-success'>
                            <p>
                                I've prepared all sizes for you. Can you take a look tonight so we can prepare my final invoice?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
