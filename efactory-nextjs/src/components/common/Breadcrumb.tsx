import Link from 'next/link'
import React from 'react'

interface BreadcrumbItem {
	name?: string;
	link?: string;
	url?: string;
}

interface BreadcrumbProps {
	breadcrumbItem: BreadcrumbItem[];
}

export default function Breadcrumb({ breadcrumbItem }: BreadcrumbProps) {

    // const breadcrumbItem = [
    //     {
    //       name: "Dashboard",
    //     },
    //     {
    //       link: "Dashboard",
    //       url: "dfsfd",
    //     },
    //   ]

    return (

        // <Breadcrumb breadcrumbItem={breadcrumbItem} />

        <div className='mb-4'>
            <ul className='flex flex-wrap gap-x-2 gap-y-1'>
                <li>
                    <Link href="/" className='text-secondary sm:text-[16px]/[24px] text-[14px]/[20px]'>
                        Home
                    </Link>
                </li>
                {breadcrumbItem?.map((item, key) => (
                    <li key={key} className='before:content-["/"] before:pe-2'>
                        {item.link ?
                            <Link href={item.url || '/'} className='text-secondary sm:text-[16px]/[24px] text-[14px]/[20px]'>
                                {item.link}
                            </Link>
                            :
                            <span className='inline-block sm:text-[16px]/[24px] text-[14px]/[20px]'>
                                {item.name}
                            </span>
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}