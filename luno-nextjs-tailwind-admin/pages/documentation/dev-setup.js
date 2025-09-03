import React from 'react'
import {
    IconCode,
} from '@tabler/icons-react'
import Breadcrumb from '@/components/common/Breadcrumb'
import Link from 'next/link'

export default function DevSetup() {

    const breadcrumbItem = [
        {
            link: "Documentation",
            url: "/documentation",
        },
        {
            name: "Dev Setup",
        },
    ]

    return (
        <>
            <div className='md:px-6 sm:px-3 pt-4'>
                <div className='container-fluid'>
                    <Breadcrumb breadcrumbItem={breadcrumbItem} />
                    <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                        <div className='mb-30'>
                            <div className='flex gap-10 mb-5'>
                                <IconCode />
                                <p className='text-[20px]/[24px] font-medium'>
                                    Development Setup
                                </p>
                            </div>
                            <p>
                                To get started, you need to do the following:
                            </p>
                        </div>
                        <div>
                            <p className='text-[20px]/[24px] mb-15'>
                                Project setup command
                            </p>
                            <ul className='pl-20 list-disc flex flex-col gap-10 text-[16px]/[20px]'>
                                <li>
                                    Open the project folder in your terminal
                                </li>
                                <li>
                                    Install node modules using npm <span className='text-danger'>npm i</span>
                                </li>
                                <li>
                                    For run project in localhost enter command <span className='text-danger'>npm run dev</span>
                                </li>
                                <li>
                                    Your project will open in your brwoser automatically ( if not opened enter URL in your browser <Link href="http://localhost:3000" target='_blank' className='text-blue transition-all duration-300 hover:text-blue-100'>http://localhost:3000</Link> )
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
