import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconThumbUpFilled,
    IconStarFilled,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function Overview() {

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
                            <IconThumbUpFilled />
                            <p className='text-[20px]/[24px] font-medium'>
                                Getting Started
                            </p>
                        </div>
                        <div>
                            <p className='md:text-[20px]/[30px] mb-15'>
                                This guide will help you get started with <span className='text-danger'>LUNO</span>
                            </p>
                            <p className='md:text-[20px]/[30px] mb-15'>
                                All the important stuff – compiling the source, file structure, build tools, file includes – is documented here.
                            </p>
                            <p className='md:text-[20px]/[30px] mb-15'>
                                If you really like our work, design, performance and support then <Link href="https://themeforest.net/" target='_blank' className='text-blue'> please don't forgot to rate us </Link> on Themeforest, it really motivate us to provide something better. &nbsp;
                                <span className='inline-flex gap-5 align-text-bottom'>
                                    <IconStarFilled className='text-warning md:w-[24px] md:h-[24px] w-[20px] h-[20px]' />
                                    <IconStarFilled className='text-warning md:w-[24px] md:h-[24px] w-[20px] h-[20px]' />
                                    <IconStarFilled className='text-warning md:w-[24px] md:h-[24px] w-[20px] h-[20px]' />
                                    <IconStarFilled className='text-warning md:w-[24px] md:h-[24px] w-[20px] h-[20px]' />
                                    <IconStarFilled className='text-warning md:w-[24px] md:h-[24px] w-[20px] h-[20px]' />
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
