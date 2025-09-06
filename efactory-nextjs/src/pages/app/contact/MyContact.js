import React from 'react'
import ReactDataTable from 'react-data-table-component';
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
} from '/public/images';
import {
    IconTrash,
    IconCloudDownload,
    IconCloudUpload,
    IconBrandFacebook,
    IconBrandGithub,
    IconMail,
    IconPencil,
    IconHeart,
    IconBrandLinkedin,
    IconBrandTwitter,
} from '@tabler/icons-react'
import Image from 'next/image';
import Link from 'next/link';

export default function MyContact() {

    const columnsFilter = [
        {
            name: 'Name',
            selector: row => row.name,
            cell: row =>
                <div className='flex items-center gap-2 flex-wrap'>
                    <Image src={row.userImage} alt='profile' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                    <div>
                        {row.name}
                    </div>
                </div>,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: row => row.number,
            sortable: true,
        },
        {
            name: 'Position',
            selector: row => row.position,
            sortable: true,
        },
        {
            name: 'Social',
            selector: row =>
                <div className='flex gap-4 flex-wrap'>
                    {row.social.map((item, key) => (
                        <Link key={key} href={item.url} title={item.socialName} className='text-primary'>
                            <item.socialIcon className="w-[18px] h-[18px]" />
                        </Link>
                    ))}
                </div>,
        },
        {
            name: 'Action',
            selector: row =>
                <div className='flex gap-4'>
                    <button title='Message'>
                        <IconMail className='w-[18px] h-[18px] text-font-color-100' />
                    </button>
                    <button title='Edit'>
                        <IconPencil className='w-[18px] h-[18px] text-font-color-100' />
                    </button>
                    <button title='Delete'>
                        <IconTrash className='w-[18px] h-[18px] text-font-color-100' />
                    </button>
                    <button title='Favourites'>
                        <IconHeart className='w-[18px] h-[18px] text-font-color-100' />
                    </button>
                </div>,
        },
    ];

    const dataFilter = [
        {
            userImage: avatar7,
            name: 'Andew Jon',
            email: 'example@info.com',
            number: '+91 1800 78963',
            position: 'Colleagues',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },
        {
            userImage: avatar9,
            name: 'Comeren Diaz',
            email: 'example@info.com',
            number: '+0 1800 14725',
            position: 'Colleagues',
            social: [
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },
        {
            userImage: avatar1,
            name: 'Jack Bird',
            email: 'example@info.com',
            number: '+0 1800 14725',
            position: 'Colleagues',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar2,
            name: 'Nellie Maxwell',
            email: 'example@info.com',
            number: '+91 1800 78963',
            position: 'Colleagues',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar3,
            name: 'Chris Fox',
            email: 'example@info.com',
            number: '+0 1800 25896',
            position: 'Developer',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar8,
            name: 'Chris Fox',
            email: 'example@info.com',
            number: '+0 1800 25896',
            position: 'Developer',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar8,
            name: 'Bucky Barnes',
            email: 'example@info.com',
            number: '+0 1800 14725',
            position: 'Friends',
            social: [
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar8,
            name: 'Orlando Lentz',
            email: 'example@info.com',
            number: '+0 1800 14725',
            position: 'Friends',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar1,
            name: 'Dean Otto',
            email: 'example@info.com',
            number: '+1 1800 45698',
            position: 'Web Designer',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar10,
            name: 'Issa Bell',
            email: 'example@info.com',
            number: '+1 1800 45698',
            position: 'Web Designer',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandLinkedin,
                    socialName: 'LinkedIn',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar1,
            name: 'Marshall Nichols',
            email: 'example@info.com',
            number: '+4 1800 12345',
            position: 'Web Designer',
            social: [
                {
                    socialIcon: IconBrandGithub,
                    socialName: 'Github',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },

        {
            userImage: avatar6,
            name: "Thomas's Joe",
            email: 'example@info.com',
            number: '+4 1800 12345',
            position: 'Web Designer',
            social: [
                {
                    socialIcon: IconBrandFacebook,
                    socialName: 'Facebook',
                    url: '#',
                },
                {
                    socialIcon: IconBrandTwitter,
                    socialName: 'Twitter',
                    url: '#',
                },
            ],
        },
    ]

    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[26px]'>
                    My Contact
                    <span className='inline-block font-bold ms-1'>
                        (705)
                    </span>
                </h5>
                <div className='flex items-stretch gap-1 flex-wrap'>
                    <select className="form-select cursor-pointer rounded-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                        <option defaultValue="">Filter</option>
                        <option value="1">Designer</option>
                        <option value="2">Developer</option>
                        <option value="3">Office</option>
                        <option value="4">Friends</option>
                        <option value="5">Management</option>
                    </select>
                    <button className='btn btn-outline-secondary'>
                        <IconCloudDownload className='w-[18px] h-[18px]' />
                        <span className='sm:block hidden'>
                            Import
                        </span>
                    </button>
                    <button className='btn btn-outline-secondary'>
                        <IconCloudUpload className='w-[18px] h-[18px]' />
                        <span className='sm:block hidden'>
                            Export
                        </span>
                    </button>
                </div>
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
