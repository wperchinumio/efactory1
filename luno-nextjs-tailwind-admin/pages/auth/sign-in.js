import React, { useState } from 'react'
import { IconBrandGoogleFilled, IconEye, IconEyeOff } from '@tabler/icons-react'
import Link from 'next/link';


export async function getStaticProps() {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

export default function Signin() {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className='sm:mb-8 mb-6 text-center'>
                <div className='sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2'>
                    Sign In
                </div>
                <span className='text-font-color-100 inline-block'>
                    Free access to our dashboard.
                </span>
            </div>
            <div className='sm:mb-6 mb-4 text-center'>
                <Link href="#" className='btn btn-white !border-border-color'>
                    <IconBrandGoogleFilled className='fill-font-color-100' />
                    Sign in with Google
                </Link>
                <div className='mt-6 flex items-center'>
                    <span className='inline-block h-[1px] w-full bg-font-color-400'></span>
                    <span className='px-30 text-font-color-400'>
                        OR
                    </span>
                    <span className='inline-block h-[1px] w-full bg-font-color-400'></span>
                </div>
            </div>
            <div className=''>
                <div className='form-control mb-15'>
                    <label htmlFor='email' className='form-label'>
                        Email
                    </label>
                    <input type='email' id='email' placeholder='name@example.com' className='form-input' />
                </div>
                <div className='form-control mb-15'>
                    <label htmlFor='password' className='form-label'>
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            placeholder='Enter the password'
                            className='form-input !pr-12'
                        />
                        <button onClick={togglePasswordVisibility} className='absolute top-[50%] translate-y-[-50%] right-3 text-font-color-100'>
                            {showPassword ? <IconEyeOff /> : <IconEye />}
                        </button>
                    </div>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-10 sm:mb-30 mb-6'>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="forgotPassword"
                            className="form-check-input"
                        />
                        <label className="form-check-label" htmlFor="forgotPassword">Remember me</label>
                    </div>
                    <Link href="/auth/forgot-password" className='text-primary sm:text-[16px]/[24px] text-[14px]/[20px]'>
                        Forgot Password?
                    </Link>
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
            </div>
        </>
    )
}
