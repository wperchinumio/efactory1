import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import Footer from '@/components/partial/Footer'
import CompanyLogo from '@/components/common/CompanyLogo'
import {
    IconBrandDribbble,
    IconBrandGithub,
    IconBrandTwitter,
    IconHeartFilled,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function Footers() {

    const CurrentYear = new Date().getFullYear()

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Footers",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='flex flex-col gap-6'>
                    <Footer className="p-6 bg-card-color rounded-xl border border-dashed border-border-color" />
                    <div className="footer p-6 bg-card-color rounded-xl border border-dashed border-border-color flex items-center justify-between gap-15 md:flex-row flex-col md:text-[16px]/[24px] text-[14px]/[20px]">
                        <div className='flex items-center gap-4 md:flex-row flex-col'>
                            <Link href="/">
                                <CompanyLogo className="w-[53px] h-[18px] text-font-color-100 transition-all hover:text-secondary" />
                            </Link>
                            <p className='text-font-color-100 text-center'>
                                © {CurrentYear} <Link href="/" className='text-primary'>Luno</Link>. <IconHeartFilled className='w-[20px] h-[20px] min-w-[20px] text-danger inline-block' /> All Rights Reserved.
                            </p>
                        </div>
                        <ul className='flex items-center gap-x-20 gap-y-5 flex-wrap justify-center'>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    <IconBrandDribbble className='w-[22px] h-[22px] min-w-[22px]' />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    <IconBrandGithub className='w-[22px] h-[22px] min-w-[22px]' />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    <IconBrandTwitter className='w-[22px] h-[22px] min-w-[22px]' />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer p-6 bg-card-color rounded-xl border border-dashed border-border-color flex items-center justify-between gap-15 flex-col md:text-[16px]/[24px] text-[14px]/[20px]">
                        <ul className='flex items-center gap-x-20 gap-y-5 w-full flex-wrap justify-center pb-4 border-b border-border-color'>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                    About
                                </Link>
                            </li>
                        </ul>
                        <p className='text-font-color-100 text-center'>
                            © {CurrentYear} <Link href="/" className='text-primary'>Luno</Link>, All Rights Reserved.
                        </p>
                    </div>
                    <div className="footer p-6 bg-card-color rounded-xl border border-dashed border-border-color grid lg:grid-cols-[1fr_1.5fr] grid-cols-1 gap-6 md:text-[16px]/[24px] text-[14px]/[20px]">
                        <div>
                            <Link href="/" className='inline-block mb-4'>
                                <CompanyLogo className="w-[53px] h-[18px] text-primary transition-all hover:text-secondary" />
                            </Link>
                            <p className='w-full max-w-[280px] mb-4'>
                                Habitasse vivamus non dictum malesuada viverra aliquam mus facilisis ex curabitur leo magnis maecenas nunc cras
                            </p>
                            <p className='text-font-color-100 flex items-center gap-1 flex-wrap'>
                                © {CurrentYear} <Link href="/" className='text-primary'>Luno.</Link><IconHeartFilled className='w-[20px] h-[20px] min-w-[20px] text-danger' /> by <span className='text-danger'>Luno</span>.
                            </p>
                        </div>
                        <div className='grid sm:grid-cols-3 grid-cols-1 gap-15'>
                            <div>
                                <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                    Section
                                </h4>
                                <ul className='flex flex-col gap-2'>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            About
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                    Section
                                </h4>
                                <ul className='flex flex-col gap-2'>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            About
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                    Section
                                </h4>
                                <ul className='flex flex-col gap-2'>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                            About
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer p-6 bg-card-color rounded-xl border border-dashed border-border-color md:text-[16px]/[24px] text-[14px]/[20px]">
                        <div className='grid lg:grid-cols-[1.5fr_1fr] grid-cols-1 gap-6'>
                            <div className='grid sm:grid-cols-3 grid-cols-1 gap-15'>
                                <div>
                                    <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                        Section
                                    </h4>
                                    <ul className='flex flex-col gap-2'>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Pricing
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                FAQs
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                About
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                        Section
                                    </h4>
                                    <ul className='flex flex-col gap-2'>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Pricing
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                FAQs
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                About
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className='text-[20px]/[24px] font-medium mb-2'>
                                        Section
                                    </h4>
                                    <ul className='flex flex-col gap-2'>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                Pricing
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                FAQs
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                                About
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h5 className='text-[20px]/[24px] font-medium mb-2'>
                                    Subscribe to our newsletter
                                </h5>
                                <p className='mb-4'>
                                    Monthly digest of whats new and exciting from us.
                                </p>
                                <div className='flex gap-2'>
                                    <div className='form-control w-full max-w-[400px]'>
                                        <input type='email' placeholder='Email address' className='form-input' />
                                    </div>
                                    <button className='btn btn-primary'>
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border-color flex items-center justify-between gap-15 md:flex-row flex-col md:text-[16px]/[24px] text-[14px]/[20px]">
                            <p className='text-font-color-100 text-center'>
                                © {CurrentYear} <Link href="/" className='text-primary'>Luno</Link>, All Rights Reserved.
                            </p>
                            <ul className='flex items-center gap-x-20 gap-y-5 flex-wrap justify-center'>
                                <li>
                                    <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                        <IconBrandDribbble className='w-[22px] h-[22px] min-w-[22px]' />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                        <IconBrandGithub className='w-[22px] h-[22px] min-w-[22px]' />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-font-color-100 transition-all hover:text-blue'>
                                        <IconBrandTwitter className='w-[22px] h-[22px] min-w-[22px]' />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
