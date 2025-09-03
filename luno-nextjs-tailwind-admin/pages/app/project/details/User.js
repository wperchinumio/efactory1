import React from 'react'
import { avatar1, avatar2, avatar3, avatar4, avatar5 } from '/public/images'
import { IconBrandGithub, IconMail, IconTrash } from '@tabler/icons-react'
import Image from 'next/image'

export default function User() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Users (11)
            </div>
            <ul className='flex flex-col gap-2'>
                <li className='card rounded-xl bg-card-color md:p-6 p-4 flex items-center gap-4 md:flex-row flex-col border border-dashed border-border-color'>
                    <Image src={avatar1} width="56" height="56" alt="user" className="w-[56px] h-[56px] min-w-[56px] p-1 rounded-full border border-border-color" />
                    <div className='grid xxl:grid-cols-[1.5fr_1.5fr_1fr] md:grid-cols-[1fr_2fr_1fr] grid-cols-1 md:justify-items-start justify-items-center gap-3 items-center w-full'>
                        <div>
                            <h6 className='font-medium'>
                                Andew Jon
                            </h6>
                            <span className='text-font-color-100'>
                                Developer
                            </span>
                        </div>
                        <ul className='grid grid-cols-3 gap-2 w-full md:text-start text-center md:max-w-full max-w-[350px]'>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-danger">
                                    21
                                </h6>
                                <span className='text-font-color-100'>
                                    Tasks
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-success">
                                    $1,025
                                </h6>
                                <span className='text-font-color-100'>
                                    Earnings
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-primary">
                                    $5,007
                                </h6>
                                <span className='text-font-color-100'>
                                    Sales
                                </span>
                            </li>
                        </ul>
                        <div className='flex items-center md:justify-end justify-center gap-2 w-full'>
                            <button title='Message' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconMail className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Github' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconBrandGithub className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconTrash className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </li>
                <li className='card rounded-xl bg-card-color md:p-6 p-4 flex items-center gap-4 md:flex-row flex-col border border-dashed border-border-color'>
                    <Image src={avatar2} width="56" height="56" alt="user" className="w-[56px] h-[56px] min-w-[56px] p-1 rounded-full border border-border-color" />
                    <div className='grid xxl:grid-cols-[1.5fr_1.5fr_1fr] md:grid-cols-[1fr_2fr_1fr] grid-cols-1 md:justify-items-start justify-items-center gap-3 items-center w-full'>
                        <div>
                            <h6 className='font-medium'>
                                Emma Smith
                            </h6>
                            <span className='text-font-color-100'>
                                Web Designer
                            </span>
                        </div>
                        <ul className='grid grid-cols-3 gap-2 w-full md:text-start text-center md:max-w-full max-w-[350px]'>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-danger">
                                    5
                                </h6>
                                <span className='text-font-color-100'>
                                    Tasks
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-success">
                                    $1,450
                                </h6>
                                <span className='text-font-color-100'>
                                    Earnings
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-primary">
                                    $5,120
                                </h6>
                                <span className='text-font-color-100'>
                                    Sales
                                </span>
                            </li>
                        </ul>
                        <div className='flex items-center md:justify-end justify-center gap-2 w-full'>
                            <button title='Message' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconMail className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Github' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconBrandGithub className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconTrash className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </li>
                <li className='card rounded-xl bg-card-color md:p-6 p-4 flex items-center gap-4 md:flex-row flex-col border border-dashed border-border-color'>
                    <Image src={avatar3} width="56" height="56" alt="user" className="w-[56px] h-[56px] min-w-[56px] p-1 rounded-full border border-border-color" />
                    <div className='grid xxl:grid-cols-[1.5fr_1.5fr_1fr] md:grid-cols-[1fr_2fr_1fr] grid-cols-1 md:justify-items-start justify-items-center gap-3 items-center w-full'>
                        <div>
                            <h6 className='font-medium'>
                                Bucky Barnes
                            </h6>
                            <span className='text-font-color-100'>
                                Developer
                            </span>
                        </div>
                        <ul className='grid grid-cols-3 gap-2 w-full md:text-start text-center md:max-w-full max-w-[350px]'>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-danger">
                                    8
                                </h6>
                                <span className='text-font-color-100'>
                                    Tasks
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-success">
                                    $1,750
                                </h6>
                                <span className='text-font-color-100'>
                                    Earnings
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-primary">
                                    $5,800
                                </h6>
                                <span className='text-font-color-100'>
                                    Sales
                                </span>
                            </li>
                        </ul>
                        <div className='flex items-center md:justify-end justify-center gap-2 w-full'>
                            <button title='Message' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconMail className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Github' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconBrandGithub className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconTrash className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </li>
                <li className='card rounded-xl bg-card-color md:p-6 p-4 flex items-center gap-4 md:flex-row flex-col border border-dashed border-border-color'>
                    <Image src={avatar4} width="56" height="56" alt="user" className="w-[56px] h-[56px] min-w-[56px] p-1 rounded-full border border-border-color" />
                    <div className='grid xxl:grid-cols-[1.5fr_1.5fr_1fr] md:grid-cols-[1fr_2fr_1fr] grid-cols-1 md:justify-items-start justify-items-center gap-3 items-center w-full'>
                        <div>
                            <h6 className='font-medium'>
                                Dean Otto
                            </h6>
                            <span className='text-font-color-100'>
                                Developer
                            </span>
                        </div>
                        <ul className='grid grid-cols-3 gap-2 w-full md:text-start text-center md:max-w-full max-w-[350px]'>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-danger">
                                    22
                                </h6>
                                <span className='text-font-color-100'>
                                    Tasks
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-success">
                                    $1,000
                                </h6>
                                <span className='text-font-color-100'>
                                    Earnings
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-primary">
                                    $5,500
                                </h6>
                                <span className='text-font-color-100'>
                                    Sales
                                </span>
                            </li>
                        </ul>
                        <div className='flex items-center md:justify-end justify-center gap-2 w-full'>
                            <button title='Message' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconMail className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Github' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconBrandGithub className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconTrash className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </li>
                <li className='card rounded-xl bg-card-color md:p-6 p-4 flex items-center gap-4 md:flex-row flex-col border border-dashed border-border-color'>
                    <Image src={avatar5} width="56" height="56" alt="user" className="w-[56px] h-[56px] min-w-[56px] p-1 rounded-full border border-border-color" />
                    <div className='grid xxl:grid-cols-[1.5fr_1.5fr_1fr] md:grid-cols-[1fr_2fr_1fr] grid-cols-1 md:justify-items-start justify-items-center gap-3 items-center w-full'>
                        <div>
                            <h6 className='font-medium'>
                                Issa Bell
                            </h6>
                            <span className='text-font-color-100'>
                                Web Designer
                            </span>
                        </div>
                        <ul className='grid grid-cols-3 gap-2 w-full md:text-start text-center md:max-w-full max-w-[350px]'>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-danger">
                                    21
                                </h6>
                                <span className='text-font-color-100'>
                                    Tasks
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-success">
                                    $1,025
                                </h6>
                                <span className='text-font-color-100'>
                                    Earnings
                                </span>
                            </li>
                            <li className='py-1 md:px-4 px-2 border border-dashed border-border-color rounded-xl'>
                                <h6 className="text-primary">
                                    $5,522
                                </h6>
                                <span className='text-font-color-100'>
                                    Sales
                                </span>
                            </li>
                        </ul>
                        <div className='flex items-center md:justify-end justify-center gap-2 w-full'>
                            <button title='Message' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconMail className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Github' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconBrandGithub className='w-[20px] h-[20px]' />
                            </button>
                            <button title='Delete' className='p-2 text-font-color-100 transition-all hover:text-blue'>
                                <IconTrash className='w-[20px] h-[20px]' />
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </>
    )
}
