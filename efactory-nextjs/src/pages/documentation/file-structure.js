import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconFolderFilled,
    IconFileCode,
    IconBrandGit,
    IconFolderOpen,
    IconInfoCircle,
    IconFileTypeJs,
} from '@tabler/icons-react'

export default function Overview() {

    const breadcrumbItem = [
        {
            link: "Documentation",
            url: "/documentation",
        },
        {
            name: "File Structure",
        },
    ]

    return (
        <>
            <div className='md:px-6 sm:px-3 pt-4'>
                <div className='container-fluid'>
                    <Breadcrumb breadcrumbItem={breadcrumbItem} />
                    <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                        <div className='flex gap-10 mb-30'>
                            <IconFolderFilled />
                            <p className='text-[20px]/[24px] font-medium'>
                                File Structure
                            </p>
                        </div>
                        <div>
                            <ul>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='text-danger min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    <div>
                                        <span className='text-danger'>.next</span> ( NPM dependencies (by default the folder is not included) <span className='text-danger'>npm</span> installs dependencies. )
                                    </div>
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    components
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    fonts
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='text-danger min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    <div>
                                        <span className='text-danger'>node_modules</span> ( NPM dependencies (by default the folder is not included) <span className='text-danger'>npm</span> installs dependencies. )
                                    </div>
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderOpen className='min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    pages
                                </li>
                                <li className='mb-10 last:mb-0'>
                                    <ul className='pl-20'>
                                        <li className='flex gap-5 mb-10 last:mb-0'>
                                            - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                            _app.js
                                        </li>
                                        <li className='flex gap-5 mb-10 last:mb-0'>
                                            - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                            _document.js
                                        </li>
                                        <li className='flex gap-5 mb-10 last:mb-0'>
                                            - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                            index.js
                                        </li>
                                    </ul>
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    public
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFolderFilled className='min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    styles
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconBrandGit className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    .gitignore
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileCode className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    jsconfig.json
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    next.config.mjs
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileCode className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    package-lock.json
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileCode className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    package.json
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    postcss.config.mjs
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconInfoCircle className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    README.md
                                </li>
                                <li className='flex gap-5 mb-10 last:mb-0'>
                                    - <IconFileTypeJs className='stroke-[1.5] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]' />
                                    tailwind.config.js
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
