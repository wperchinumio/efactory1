import React from 'react'
import ReactDataTable from 'react-data-table-component';
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
} from '/public/images';
import {
    IconFileTypeXls,
    IconFolderFilled,
    IconLayout2,
    IconList,
    IconPhoto,
    IconSettings,
    IconStar,
    IconStarFilled,
    IconTrash,
} from '@tabler/icons-react'
import Link from 'next/link';
import Image from 'next/image';

export default function MyDrive() {

    const columnsFilter = [
        {
            name: 'Name',
            selector: row => row.name,
            cell: row =>
                <div className='flex items-center gap-2 flex-wrap'>
                    <div>{row.icon}</div>
                    <div>
                        {row.name}
                    </div>
                    <div className='flex gap-1 flex-wrap'>
                        {row.label.map((item, key) => (
                            <div key={key} className='py-1 px-2 rounded-md bg-body-color text-[12px]/[1] font-bold'>
                                {item.labelName}
                            </div>
                        ))}
                    </div>
                </div>,
            sortable: true,
        },
        {
            name: 'Modified',
            selector: row => row.modified,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Shared With',
            selector: row =>
                <div className='flex gap-1 flex-wrap'>
                    {row.sharedWith.map((item, key) => (
                        <Link key={key} href={item.url}>
                            <Image src={item.userImage} alt='profile' width="16" height="16" className='w-[16px] h-[16px] min-w-[16px] rounded-md' />
                        </Link>
                    ))}
                </div>,
            width: '15%',
        },
        {
            name: 'Size',
            selector: row => row.size,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Action',
            selector: row =>
                <div className='flex gap-4'>
                    <button title='Favourite'>
                        <IconStar className='w-[18px] h-[18px] text-warning' />
                    </button>
                    <button title='Manage'>
                        <IconSettings className='w-[18px] h-[18px] text-primary' />
                    </button>
                    <button title='Delete'>
                        <IconTrash className='w-[18px] h-[18px] text-primary' />
                    </button>
                </div>,
            width: '130px',
        },
    ];

    const dataFilter = [
        {
            icon: <IconPhoto className='w-[20px] h-[20px]' />,
            name: 'App_design-iOS.jpg',
            label: [
                {
                    labelName: 'Design',
                },
            ],
            modified: 'Yesterday',
            sharedWith: [
                {
                    userImage: avatar9,
                    url: '#',
                },
                {
                    userImage: avatar2,
                    url: '#',
                },
            ],
            size: '5MB',
        },
        {
            icon: <IconFileTypeXls className='w-[20px] h-[20px]' />,
            name: 'Work Sheet.xls',
            label: [
                {
                    labelName: 'Design',
                },
            ],
            modified: 'Yesterday',
            sharedWith: [
                {
                    userImage: avatar3,
                    url: '#',
                },
                {
                    userImage: avatar4,
                    url: '#',
                },
            ],
            size: '1.4MB',
        },
        {
            icon: <IconFolderFilled className='w-[20px] h-[20px]' />,
            name: 'Marketing Strategy',
            label: [
                {
                    labelName: 'Agency',
                },
            ],
            modified: 'Today',
            sharedWith: [
                {
                    userImage: avatar6,
                    url: '#',
                },
            ],
            size: '12MB',
        },
        {
            icon: <IconFolderFilled className='w-[20px] h-[20px]' />,
            name: 'Graphics Design',
            label: [
                {
                    labelName: 'Figma',
                },
                {
                    labelName: 'Photoshop',
                },
            ],
            modified: '16 April 2021',
            sharedWith: [
                {
                    userImage: avatar6,
                    url: '#',
                },
                {
                    userImage: avatar7,
                    url: '#',
                },
                {
                    userImage: avatar8,
                    url: '#',
                },
            ],
            size: '12MB',
        },
        {
            icon: <IconFolderFilled className='w-[20px] h-[20px]' />,
            name: 'React Project',
            label: [
                {
                    labelName: 'React',
                },
                {
                    labelName: 'Dev',
                },
                {
                    labelName: 'Clients',
                },
            ],
            modified: '16 April 2021',
            sharedWith: [
                {
                    userImage: avatar3,
                    url: '#',
                },
                {
                    userImage: avatar4,
                    url: '#',
                },
                {
                    userImage: avatar5,
                    url: '#',
                },
                {
                    userImage: avatar6,
                    url: '#',
                },
            ],
            size: '880MB',
        },
        {
            icon: <IconFolderFilled className='w-[20px] h-[20px]' />,
            name: 'Web Design',
            label: [
                {
                    labelName: 'Design',
                },
                {
                    labelName: 'Project',
                },
            ],
            modified: '12 April 2021',
            sharedWith: [
                {
                    userImage: avatar1,
                    url: '#',
                },
                {
                    userImage: avatar2,
                    url: '#',
                },
            ],
            size: '40MB',
        },
    ]

    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                My Drive
            </div>
            <div className='relative mt-4 mb-12 p-4 border border-dashed border-primary rounded-xl'>
                <span className='inline-block bg-body-color px-5 font-semibold text-primary absolute -top-3'>
                    Suggested :
                </span>
                <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2'>
                    <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                        <div className='bg-primary p-5 w-[30px] inline-flex items-center justify-center absolute top-0 end-[20px] after:absolute after:end-0 after:top-[calc(100%-10px)] after:border-[15px] after:border-primary after:border-b-[5px] after:border-b-transparent '>
                            <IconStarFilled className='text-white w-[16px] h-[16px] relative z-[1]' />
                        </div>
                        <IconFolderFilled className='w-[36px] h-[36px]' />
                        <h5 className='my-2 text-[20px]/[26px] font-medium'>Documents</h5>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Files :
                            </span>
                            <span>
                                245
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Size :
                            </span>
                            <span>
                                80 MB
                            </span>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                        <IconFolderFilled className='w-[36px] h-[36px] text-chart-color2' />
                        <h5 className='my-2 text-[20px]/[26px] font-medium'>Work Project</h5>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Files :
                            </span>
                            <span>
                                2K
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Size :
                            </span>
                            <span>
                                250 MB
                            </span>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                        <IconFolderFilled className='w-[36px] h-[36px] text-chart-color3' />
                        <h5 className='my-2 text-[20px]/[26px] font-medium'>Public html</h5>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Files :
                            </span>
                            <span>
                                542
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Size :
                            </span>
                            <span>
                                543 MB
                            </span>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                        <IconFolderFilled className='w-[36px] h-[36px] text-chart-color5' />
                        <h5 className='my-2 text-[20px]/[26px] font-medium'>Templates</h5>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Files :
                            </span>
                            <span>
                                890
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-between text-font-color-100">
                            <span>
                                Size :
                            </span>
                            <span>
                                506 MB
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='flex items-center gap-4 justify-between flex-wrap mb-3'>
                    <div>
                        <h6 className="font-bold">Recent Activity</h6>
                        <span className="text-font-color-100">Based your preferences</span>
                    </div>
                    <div className='inline-flex items-stretch border border-primary rounded-md overflow-hidden'>
                        <button className='bg-primary p-[6px] text-white'>
                            <IconList className='w-[20px] h-[20px]' />
                        </button>
                        <button className='bg-transparent p-[6px] text-primary transition-all hover:text-white hover:bg-primary'>
                            <IconLayout2 className='w-[20px] h-[20px]' />
                        </button>
                    </div>
                </div>
                <div className='react-data-table'>
                    <ReactDataTable
                        columns={columnsFilter}
                        data={dataFilter}
                    />
                </div>
            </div>
        </>
    )
}
