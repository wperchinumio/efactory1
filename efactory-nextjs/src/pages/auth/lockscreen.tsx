import React, { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { profile_av } from '../../../public/images'
import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps() {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

export default function Lockscreen() {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className='sm:mb-12 mb-6 text-center flex flex-col items-center'>
                <Image src={profile_av} alt='user profile' width="160" height="160" className='mb-4 sm:w-[160px] sm:h-[160px] sm:min-w-[160px] w-[100px] h-[100px] min-w-[100px] object-cover rounded-full p-1 bg-body-color border border-border-color shadow-shadow-sm saturate-50 transition-all hover:saturate-100' />
                <p className='sm:text-[20px]/[26px] font-medium'>
                    Manuella Nevoresky
                </p>
            </div>
            <div className='form-control mb-20'>
                <label htmlFor='password' className='form-label'>
                    Enter Password
                </label>
                <div className='relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='**********'
                        className='form-input !pr-12'
                    />
                    <button onClick={togglePasswordVisibility} className='absolute top-[50%] translate-y-[-50%] right-3 text-font-color-100'>
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                    </button>
                </div>
            </div>
            <Link href="/" className='btn btn-secondary large w-full uppercase'>
                Sign In
            </Link>
            <div className='text-center sm:mt-30 mt-6 text-font-color-100'>
                <p>
                    Don't have an account yet?
                </p>
                <Link href="/auth/sign-up" className='text-primary'>
                    Sign up here
                </Link>
            </div>
        </>
    )
}
