import React from 'react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
} from '/public/images'
import {
    IconBrandFacebook,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconDots,
} from '@tabler/icons-react'
import Link from 'next/link'
import Image from 'next/image'

export default function People() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                People
            </div>
            <div className='grid xxl:grid-cols-4 sm:grid-cols-2 gap-4'>
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery1} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar1} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Comeren Diaz
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery2} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar2} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Dean Otto
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery3} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar3} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Jack Bird
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery4} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar4} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Marshall Nichols
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery5} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar5} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Orlando Lentz
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery6} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar6} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Thomas's Joe
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
                <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                    <Image src={gallery7} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='px-6 pb-6 pt-12 text-center relative'>
                        <Image src={avatar7} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                        <p className='font-medium mt-6'>
                            Michelle Green
                        </p>
                        <p className='text-font-color-100'>
                            example@info.com
                        </p>
                        <ul className='flex items-stretch justify-center'>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandFacebook />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandLinkedin />
                                </Link>
                            </li>
                            <li className='flex'>
                                <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                    <IconBrandTwitter />
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
            </div>
        </>
    )
}
