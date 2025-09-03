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
    IconPhoto,
    IconSettings,
    IconStar,
    IconTrash,
} from '@tabler/icons-react'
import Image from 'next/image';
import Link from 'next/link';

export default function Recent() {

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
                Recent
            </div>
            <div className='react-data-table'>
                <ReactDataTable
                    columns={columnsFilter}
                    data={dataFilter}
                />
            </div>
        </>
    )
}
