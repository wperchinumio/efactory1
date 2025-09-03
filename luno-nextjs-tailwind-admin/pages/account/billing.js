import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import Link from 'next/link'

export default function Billing() {

    const breadcrumbItem = [
        {
            name: "Account",
        },
        {
            name: "Billing",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='card bg-card-color rounded-xl overflow-hidden md:mb-8 mb-6 border border-dashed border-border-color'>
                    <div className='md:p-6 p-4 bg-secondary text-white'>
                        <h4 className='text-[24px]/[30px] font-medium mb-2'>luno.com</h4>
                        <p>Warning: You're approaching your limit. Please upgrade.</p>
                    </div>
                    <div className='md:p-6 p-4'>
                        <h2 className="md:text-[32px]/[38px] text-[24px]/[30px] mb-2">Current subscription: Pro Business (Annual) </h2>
                        <p className='mb-4'>Your subscription has 3 (included) <code className='text-primary font-base'>team members</code>. Your next payment of <strong>$990</strong> (yearly) occurs on <strong>April 20, 2023</strong>. </p>
                        <span className="text-font-color-100">Thanks for choosing <strong className="text-primary">ThemeMakker</strong> Admin.</span>
                    </div>
                    <div className='md:p-6 p-4 flex flex-wrap gap-4 border-t border-dashed border-border-color'>
                        <Link href="/page/pricing" className='btn btn-secondary'>
                            Upgrade Plan
                        </Link>
                        <button className='text-danger underline small'>
                            Cancel subscription
                        </button>
                    </div>
                </div>
                <div className='relative rounded-xl border border-dashed border-border-color p-4'>
                    <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">Order History</span>
                    <div className='card bg-card-color rounded-xl'>
                        <div className='overflow-auto'>
                            <table className='w-full min-w-[900px]'>
                                <thead>
                                    <tr className='border-b border-dashed border-border-color'>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-[12px]/[18px] font-bold'>
                                            DATE
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-[12px]/[18px] font-bold'>
                                            TYPE
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-[12px]/[18px] font-bold'>
                                            RECEIPT
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            April 27, 2021
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            LUNO - Admin Dashboard Template for One project
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>HTML</Link>
                                            <span className="mx-4">|</span>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>PDF</Link>
                                        </td>
                                    </tr>
                                    <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Jun 22, 2021
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Lucid ASP .NET Core MVC - Responsive Admin Template
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>HTML</Link>
                                            <span className="mx-4">|</span>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>PDF</Link>
                                        </td>
                                    </tr>
                                    <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Jun 22, 2021
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Aero - Bootstrap 5 & 4 Admin Template with Laravel & Angular version
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>HTML</Link>
                                            <span className="mx-4">|</span>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>PDF</Link>
                                        </td>
                                    </tr>
                                    <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Jun 22, 2021
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            Alpino - Bootstrap 4 Admin Dashboard Template
                                        </td>
                                        <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>HTML</Link>
                                            <span className="mx-4">|</span>
                                            <Link href="#" className='text-primary transition-all hover:text-secondary'>PDF</Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
