import React from 'react'
import CompanyLogo from '../common/CompanyLogo'
import Link from 'next/link'

export default function Footer({ className }) {

  const CurrentYear = new Date().getFullYear()

  return (
    <div className={`${className ? className : ''} footer md:p-6 sm:p-3 py-3 mt-auto`}>
      <div className='container-fluid flex items-center justify-between gap-15 md:flex-row flex-col md:text-[16px]/[24px] text-[14px]/[20px]'>
        <p className='text-font-color-100 text-center'>
          © {CurrentYear} <span className='text-primary'>eFactory</span>, All Rights Reserved.
        </p>
        <div />
        <div />
      </div>
    </div>
  )
}
