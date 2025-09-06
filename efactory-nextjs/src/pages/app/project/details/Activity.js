import React from 'react'
import { avatar1, avatar2, avatar3, avatar4, avatar6, avatar7, gallery1, gallery2, gallery5 } from '/public/images'
import { IconFileTypePdf, IconFileTypeZip } from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Activity() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Project Activity
            </div>
            <div className='project-activity card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-secondary after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        <p className='mb-1'>
                            Gerald Vaughn changed the status to QA on <Link href="#" className='text-primary transition-all hover:text-secondary'>MA-86</Link> - Retargeting Ads
                        </p>
                        <p className='small text-font-color-100'>
                            New Dashboard Design - 9:24PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 mt-3 border border-dashed border-border-color rounded-xl'>
                            <p>
                                I've prepared all sizes for you. Can you take a look tonight so we can prepare my final invoice?
                            </p>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-primary after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        <p className='mb-1'>
                            3 new screen design added: on <Link href="#" className='text-primary transition-all hover:text-secondary'>MA-86</Link>
                        </p>
                        <p className='small text-font-color-100'>
                            New added - 9:24PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 sm:mt-3'>
                            <div className='grid xxl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1 border border-dashed border-border-color rounded-xl md:p-4 p-2'>
                                <div className='design-card rounded-xl overflow-hidden relative text-center group'>
                                    <Image src={gallery1} alt='gallery' className='w-full opacity-60 saturate-50' />
                                    <div className='p-8 absolute left-0 top-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:opacity-0 before:translate-y-[50%] before:transition-all before:duration-300 group-hover:before:opacity-100 group-hover:before:translate-y-0'>
                                        <h2 className="text-[24px]/[30px] font-medium absolute top-[50%] translate-y-[-50%] left-0 w-full transition-all duration-300 group-hover:text-white group-hover:translate-y-[-40px]">
                                            Chat App
                                        </h2>
                                        <p className='px-4 mb-4 text-white line-clamp-2 absolute w-full bottom-0 left-0 opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0'>
                                            Sadie never took her eyes off me. She had a dark soul.
                                        </p>
                                        <Link href="/app/chat" className='absolute left-0 top-0 w-full h-full opacity-0 text-[0] z-[1]'>
                                            View more
                                        </Link>
                                    </div>
                                </div>
                                <div className='design-card rounded-xl overflow-hidden relative text-center group'>
                                    <Image src={gallery2} alt='gallery' className='w-full opacity-60 saturate-50' />
                                    <div className='p-8 absolute left-0 top-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:opacity-0 before:translate-y-[50%] before:transition-all before:duration-300 group-hover:before:opacity-100 group-hover:before:translate-y-0'>
                                        <h2 className="text-[24px]/[30px] font-medium absolute top-[50%] translate-y-[-50%] left-0 w-full transition-all duration-300 group-hover:text-white group-hover:translate-y-[-40px]">
                                            Todo App
                                        </h2>
                                        <p className='px-4 mb-4 text-white line-clamp-2 absolute w-full bottom-0 left-0 opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0'>
                                            Sadie never took her eyes off me. She had a dark soul.
                                        </p>
                                        <Link href="/app/todo" className='absolute left-0 top-0 w-full h-full opacity-0 text-[0] z-[1]'>
                                            View more
                                        </Link>
                                    </div>
                                </div>
                                <div className='design-card rounded-xl overflow-hidden relative text-center group'>
                                    <Image src={gallery5} alt='gallery' className='w-full opacity-60 saturate-50' />
                                    <div className='p-8 absolute left-0 top-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:opacity-0 before:translate-y-[50%] before:transition-all before:duration-300 group-hover:before:opacity-100 group-hover:before:translate-y-0'>
                                        <h2 className="text-[24px]/[30px] font-medium absolute top-[50%] translate-y-[-50%] left-0 w-full transition-all duration-300 group-hover:text-white group-hover:translate-y-[-40px]">
                                            File Manager
                                        </h2>
                                        <p className='px-4 mb-4 text-white line-clamp-2 absolute w-full bottom-0 left-0 opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0'>
                                            Sadie never took her eyes off me. She had a dark soul.
                                        </p>
                                        <Link href="/app/file-manager" className='absolute left-0 top-0 w-full h-full opacity-0 text-[0] z-[1]'>
                                            View more
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color4 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        <p className='mb-1'>
                            Clients share with new documentation file
                        </p>
                        <p className='small text-font-color-100'>
                            New file - 11:30AM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 mt-3 flex flex-col gap-4 border border-dashed border-border-color rounded-xl'>
                            <Link href="#" className='flex items-center gap-4'>
                                <IconFileTypePdf className='text-primary' />
                                <div>
                                    <p>
                                        New layout for admin pages
                                    </p>
                                    <small className='text-font-color-100'>
                                        .pdf, 5.3 MB
                                    </small>
                                </div>
                            </Link>
                            <Link href="#" className='flex items-center gap-4'>
                                <IconFileTypeZip className='text-secondary' />
                                <div>
                                    <p>
                                        Brand Photography
                                    </p>
                                    <small className='text-font-color-100'>
                                        .zip, 30.5 MB
                                    </small>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color5 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar1} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        <p className='mb-1'>
                            Create new module development team for <Link href="#" className='text-primary transition-all hover:text-secondary'>MA-86</Link> stocks for our Instagram channel
                        </p>
                        <p className='small text-font-color-100'>
                            ReactJs, Nodejs - 7:58AM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>You</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 mt-3 border border-dashed border-border-color rounded-xl'>
                            <p>
                                What do you think about these? Should I continue in this style?
                            </p>
                        </div>
                        <div className='flex gap-1 items-center mt-4'>
                            <span className='me-2'>
                                Team :
                            </span>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar1} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-md saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='NodeJs'>
                                <Image src={avatar2} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-md saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar3} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-md saturate-50 hover:saturate-100' />
                            </Link>
                            <Link href="#" title='ReactJs'>
                                <Image src={avatar4} width="16" height="16" alt='chat profile' className='w-[16px] h-[16px] min-w-[16px] rounded-md saturate-50 hover:saturate-100' />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color3 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar6} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
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
                <div className='p-4 md:pb-8 flex sm:flex-row flex-col sm:gap-4 gap-2 border-l border-border-color relative after:absolute after:h-[26px] after:w-[3px] after:top-4 after:left-[-2px] after:bg-chart-color1 after:transition-all after:duration-300 hover:after:h-[calc(100%-3em)]'>
                    <Image src={avatar7} alt='User' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        <p className='mb-1'>
                            Task <Link href="#" className='text-primary transition-all hover:text-secondary'> #1425 </Link> merged with <Link href="#" className='text-primary transition-all hover:text-secondary'> #25836 </Link> in luno Admin Dashboard project :
                        </p>
                        <p className='small text-font-color-100'>
                            Updates for Jason Carroll - 7:12PM by <Link href="#" className='text-primary transition-all hover:text-secondary'><strong>Orlando</strong></Link>
                        </p>
                        <div className='md:p-4 md:mt-4 p-3 mt-3 border border-dashed border-border-color rounded-xl'>
                            <p>
                                Both task merged and latest code push on GitHub
                            </p>
                            <ul className='mt-4 list-disc ps-20'>
                                <li>
                                    Responsive design issue fix and testing all device-width
                                </li>
                                <li>
                                    Profile page create
                                </li>
                                <li>
                                    Login page text changes
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
