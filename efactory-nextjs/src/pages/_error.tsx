import React from 'react'
import { auth_404 } from '../../public/images'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

export default function Custom() {
    return (
        <>
            <div className='flex justify-center sm:mb-6 mb-4'>
                <Image src={auth_404} width="240" height="221" alt='auth 404' />
            </div>
            <p className='md:text-[80px]/[90px] text-[60px]/[68px] font-medium mb-2 text-center'>
                404
            </p>
            <p className='text-[20px]/[26px] font-medium text-center uppercase mb-3'>
                OOP! PAGE NOT FOUND
            </p>
            <p className='text-center sm:mb-12 mb-6 text-font-color-100'>
                Sorry, the page you're looking for doesn;t exist. if you think something is brlken, report a problem.
            </p>
            <Link href="/" className='btn btn-secondary large w-full uppercase mb-20'>
                Back To Home
            </Link>
        </>
    )
}
