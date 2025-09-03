import React from 'react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
} from '/public/images'
import {
    IconBrandFacebook,
    IconBrandLinkedin,
    IconBrandTwitter,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Favourite() {
    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[26px]'>
                    Favorites
                    <span className='inline-block font-bold ms-1'>
                        (05)
                    </span>
                </h5>
            </div>
            <div className='grid xxl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4'>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col items-center text-center border border-dashed border-border-color'>
                    <Image src={avatar1} width="80" height="80" alt='user profile' className='w-[80px] h-[80px] min-w-[80px] p-1 border border-border-color rounded-full' />
                    <p className='mt-4 font-semibold'>
                        Michelle Green
                    </p>
                    <p>
                        jason-porter@info.com
                    </p>
                    <ul className='flex gap-x-6 gap-y-2 justify-center flex-wrap my-6'>
                        <li>
                            <Link href="#" title="Facebook" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandFacebook className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="LinkedIn" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandLinkedin className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="Twitter" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandTwitter className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                    </ul>
                    <div className='flex items-stretch gap-1 justify-center'>
                        <button className='btn btn-outline-secondary'>
                            Follow
                        </button>
                        <button className='btn btn-outline-secondary'>
                            Message
                        </button>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col items-center text-center border border-dashed border-border-color'>
                    <Image src={avatar2} width="80" height="80" alt='user profile' className='w-[80px] h-[80px] min-w-[80px] p-1 border border-border-color rounded-full' />
                    <p className='mt-4 font-semibold'>
                        Andew Jon
                    </p>
                    <p>
                        jason-porter@info.com
                    </p>
                    <ul className='flex gap-x-6 gap-y-2 justify-center flex-wrap my-6'>
                        <li>
                            <Link href="#" title="Facebook" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandFacebook className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="LinkedIn" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandLinkedin className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="Twitter" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandTwitter className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                    </ul>
                    <div className='flex items-stretch gap-1 justify-center'>
                        <button className='btn btn-outline-secondary'>
                            Follow
                        </button>
                        <button className='btn btn-outline-secondary'>
                            Message
                        </button>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col items-center text-center border border-dashed border-border-color'>
                    <Image src={avatar3} width="80" height="80" alt='user profile' className='w-[80px] h-[80px] min-w-[80px] p-1 border border-border-color rounded-full' />
                    <p className='mt-4 font-semibold'>
                        Orlando Lentz
                    </p>
                    <p>
                        jason-porter@info.com
                    </p>
                    <ul className='flex gap-x-6 gap-y-2 justify-center flex-wrap my-6'>
                        <li>
                            <Link href="#" title="Facebook" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandFacebook className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="LinkedIn" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandLinkedin className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="Twitter" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandTwitter className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                    </ul>
                    <div className='flex items-stretch gap-1 justify-center'>
                        <button className='btn btn-outline-secondary'>
                            Follow
                        </button>
                        <button className='btn btn-outline-secondary'>
                            Message
                        </button>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col items-center text-center border border-dashed border-border-color'>
                    <Image src={avatar4} width="80" height="80" alt='user profile' className='w-[80px] h-[80px] min-w-[80px] p-1 border border-border-color rounded-full' />
                    <p className='mt-4 font-semibold'>
                        Marshall Nichols
                    </p>
                    <p>
                        jason-porter@info.com
                    </p>
                    <ul className='flex gap-x-6 gap-y-2 justify-center flex-wrap my-6'>
                        <li>
                            <Link href="#" title="Facebook" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandFacebook className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="LinkedIn" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandLinkedin className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="Twitter" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandTwitter className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                    </ul>
                    <div className='flex items-stretch gap-1 justify-center'>
                        <button className='btn btn-outline-secondary'>
                            Follow
                        </button>
                        <button className='btn btn-outline-secondary'>
                            Message
                        </button>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col items-center text-center border border-dashed border-border-color'>
                    <Image src={avatar5} width="80" height="80" alt='user profile' className='w-[80px] h-[80px] min-w-[80px] p-1 border border-border-color rounded-full' />
                    <p className='mt-4 font-semibold'>
                        Comeren Diaz
                    </p>
                    <p>
                        jason-porter@info.com
                    </p>
                    <ul className='flex gap-x-6 gap-y-2 justify-center flex-wrap my-6'>
                        <li>
                            <Link href="#" title="Facebook" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandFacebook className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="LinkedIn" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandLinkedin className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" title="Twitter" className='flex text-primary transition-all hover:text-secondary'>
                                <IconBrandTwitter className="w-[20px] h-[20px]" />
                            </Link>
                        </li>
                    </ul>
                    <div className='flex items-stretch gap-1 justify-center'>
                        <button className='btn btn-outline-secondary'>
                            Follow
                        </button>
                        <button className='btn btn-outline-secondary'>
                            Message
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
