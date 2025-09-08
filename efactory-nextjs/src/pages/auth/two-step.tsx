import React from 'react'
import { auth_two_step } from '../../../public/images'
import Link from 'next/link'
import Image from 'next/image'

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}


export default function TwoStep() {
  return (
    <>
      <div className='flex justify-center sm:mb-6 mb-4'>
        <Image src={auth_two_step} width="240" height="178" alt='forgot password' />
      </div>
      <p className='sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2 text-center'>
        2-step Verification
      </p>
      <p className='text-center sm:mb-12 mb-6 text-font-color-100'>
        We sent a verification code to your email. Enter the code from the email in the field below.
      </p>
      <div className='flex gap-4 mb-5'>
        <div className='form-control'>
          <input type='number' id='twoStep1' placeholder='-' className='form-input text-center' />
        </div>
        <div className='form-control'>
          <input type='number' id='twoStep2' placeholder='-' className='form-input text-center' />
        </div>
        <div className='form-control'>
          <input type='number' id='twoStep3' placeholder='-' className='form-input text-center' />
        </div>
        <div className='form-control'>
          <input type='number' id='twoStep4' placeholder='-' className='form-input text-center' />
        </div>
      </div>
      <Link href="/" className='btn btn-secondary large w-full uppercase'>
        Verify my account
      </Link>
      <div className='text-center sm:mt-8 mt-6 text-font-color-100'>
        <p>
          Haven't received it?
        </p>
        <Link href="#" className='text-primary'>
          Resend a new code.
        </Link>
      </div>
    </>
  )
}
