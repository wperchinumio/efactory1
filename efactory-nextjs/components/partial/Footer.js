import React from 'react'
import CompanyLogo from '../common/CompanyLogo'
import Link from 'next/link'

export default function Footer({ className }) {

  const CurrentYear = new Date().getFullYear()

  return (
    <div className={`${className ? className : ''} footer md:p-6 sm:p-3 py-3 mt-auto`}>
      <div className='container-fluid flex items-center justify-between gap-15 md:flex-row flex-col md:text-[16px]/[24px] text-[14px]/[20px]'>
        <p className='text-font-color-100 text-center'>
          © {CurrentYear} <Link href="/" className='text-primary'>Luno</Link>, All Rights Reserved.
        </p>
        <Link href="/">
          <CompanyLogo className="w-[53px] h-[18px] text-primary transition-all hover:text-secondary" />
        </Link>
        <ul className='flex items-center gap-x-20 gap-y-5 flex-wrap justify-center'>
          <li>
            <Link href="https://www.thememakker.com/portfolio/" className='text-font-color-100 transition-all hover:text-blue'>
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="https://themeforest.net/licenses/standard" className='text-font-color-100 transition-all hover:text-blue'>
              Licenses
            </Link>
          </li>
          <li>
            <Link href="https://help.market.envato.com/hc/en-us" className='text-font-color-100 transition-all hover:text-blue'>
              Support
            </Link>
          </li>
          {/* <li>
            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
              FAQs
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  )
}
