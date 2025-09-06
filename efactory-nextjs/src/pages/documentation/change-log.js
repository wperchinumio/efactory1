import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconDirectionSignFilled,
} from '@tabler/icons-react'

export default function ChangeLog() {

    const breadcrumbItem = [
        {
            link: "Documentation",
            url: "/app/documentation",
        },
        {
            name: "Overview",
        },
    ]

    return (
        <>
            <div className='md:px-6 sm:px-3 pt-4'>
                <div className='container-fluid'>
                    <Breadcrumb breadcrumbItem={breadcrumbItem} />
                    <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                        <div className='flex gap-10 mb-30'>
                            <IconDirectionSignFilled className='rtl:rotate-180' />
                            <p className='text-[20px]/[24px] font-medium'>
                                Change Log
                            </p>
                        </div>
                        <div className='flex flex-col gap-20'>
                            <div className='flex items-start gap-15'>
                                <span className='bg-primary text-white rounded-lg py-1 px-2 text-[12px]/[1]'>
                                    v1.0.0
                                </span>
                                <div className=''>
                                    <p className='text-[16px]/[24px] text-text-secondary'>
                                        - -  October 04, 2024
                                    </p>
                                    <ul className='list-disc pl-15 mt-5 flex flex-col gap-5'>
                                        <li>
                                            Initial release of LUNO! Lots more coming soon, though. 😁
                                        </li>
                                        <li>
                                            <span className='inline-block bg-bg-light-100 rounded-full py-1 px-2 leading-[1]'>
                                                LUNO Version
                                            </span>
                                            <ul className='pl-15 mt-5 flex flex-col gap-5'>
                                                <li>
                                                    - Next JS <span className='inline-block bg-bg-light-100 text-success rounded-full py-1 px-2 text-[12px]/[1]'>v13.2.0</span>
                                                </li>
                                                <li>
                                                    - Tailwind CSS <span className='inline-block bg-bg-light-100 text-success rounded-full py-1 px-2 text-[12px]/[1]'>v3.4.1</span>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
