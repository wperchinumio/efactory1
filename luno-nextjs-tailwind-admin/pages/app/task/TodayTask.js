import React from 'react'
import {
    IconArchive,
    IconClockHour9,
    IconMail,
    IconTrash,
} from '@tabler/icons-react'

export default function TodayTask() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Today's Task
            </div>
            <ul className='card bg-card-color rounded-xl border border-transparent overflow-hidden'>
                <li className='p-4 hover:bg-primary-10 border-b border-dashed border-border-color group'>
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    LUNO admin Responsive design issue in mobile
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY : CHRIS FOX
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-current text-danger'>
                                            BugFix
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Feb 11
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    Start working on new Admin dashboard
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY : ROBERT
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-border-color text-font-color'>
                                            Design
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Feb 12
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    Start Figma to HTML onepage with bootstrap
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY: ALEXANDER
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-current text-info'>
                                            HTML
                                        </span>
                                        <span className='px-1 rounded-md border border-danger bg-danger text-white'>
                                            Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                All the Lorem Ipsum generators on the Internet tend to repeat predefined
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Feb 15
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    Create new onepage Figma
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY: CHRIS FOX
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-border-color text-font-color-100'>
                                            Design
                                        </span>
                                        <span className='px-1 rounded-md border border-danger bg-danger text-white'>
                                            Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                Many desktop publishing packages and web page editors now use Lorem Ipsum
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Feb 15
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    LUNO admin Responsive design issue in mobile
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY: CHRIS FOX
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-current text-danger'>
                                            BugFix
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Feb 22
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
                    <div className='flex items-start gap-4 sm:flex-row flex-col'>
                        <div className='grid md:grid-cols-[30%_auto] grid-cols-1 md:gap-4 gap-2 flex-1'>
                            <div>
                                <p className='mb-5'>
                                    Create Logo for LUNO admin app
                                </p>
                                <div className='flex items-center flex-wrap gap-3 text-[14px]/[20px]'>
                                    <p className='uppercase text-font-color-100'>
                                        ASSIGNED BY: CHRIS FOX
                                    </p>
                                    <div className='flex flex-wrap items-stretch gap-1'>
                                        <span className='px-1 rounded-md border border-border-color text-font-color'>
                                            Design
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-font-color-100'>
                                Contrary to popular belief, Lorem Ipsum is not simply random text.
                            </p>
                        </div>
                        <div className='min-w-fit flex sm:justify-end sm:ms-auto relative'>
                            <span className='text-[14px]/[20px]'>
                                Mar 9
                            </span>
                            <div className='absolute sm:bottom-[unset] bottom-0 items-stretch bg-body-color rounded-md hidden group-hover:flex'>
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
        </>
    )
}
