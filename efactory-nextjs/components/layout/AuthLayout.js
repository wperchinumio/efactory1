import React from 'react'
import CompanyLogo from '../common/CompanyLogo'
import { IconBrandFacebookFilled, IconBrandGithubFilled, IconBrandTwitterFilled, IconBrandYoutubeFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function AuthLayout({ children }) {
    return (
        <div className='admin-wrapper min-h-svh py-6 px-4 flex items-center justify-center bg-body-color after:fixed after:w-full after:h-full after:start-0 after:top-0 after:opacity-90 after:bg-[url("/images/auth.png")]'>
            <div className='container-fluid'>
                <div className='flex gap-15 w-full relative z-[1]'>
                    <div className='items-center justify-center w-full lg:flex hidden'>
                        <div className='max-w-[460px]'>
                            <div className='mb-6'>
                                <CompanyLogo className="text-primary w-[116px] h-auto" />
                            </div>
                            <p className='mb-6 text-[28px]/[36px] font-medium'>
                                An order fulfillment platform made by operators, for operators.
                            </p>
                            <div className='mb-6 text-font-color-100'>
                                With best-in-class fulfillment software and customizable solutions, eFactory gives omnichannel brands complete control and visibility of orders, inventory, shipping, and returns—real time and at scale.
                            </div>
                            <ul className='space-y-3 mb-8'>
                                <li className='flex gap-3'>
                                    <span className='mt-1 h-2 w-2 rounded-full bg-secondary flex-none'></span>
                                    <div>
                                        <div className='font-medium'>Order operations</div>
                                        <div className='text-font-color-100 text-[14px]'>Manage DTC, retail, and wholesale in one portal.</div>
                                    </div>
                                </li>
                                <li className='flex gap-3'>
                                    <span className='mt-1 h-2 w-2 rounded-full bg-secondary flex-none'></span>
                                    <div>
                                        <div className='font-medium'>Inventory control</div>
                                        <div className='text-font-color-100 text-[14px]'>Real-time stock, locations, and financial-grade accuracy.</div>
                                    </div>
                                </li>
                                <li className='flex gap-3'>
                                    <span className='mt-1 h-2 w-2 rounded-full bg-secondary flex-none'></span>
                                    <div>
                                        <div className='font-medium'>Shipping intelligence</div>
                                        <div className='text-font-color-100 text-[14px]'>Cost transparency, carrier performance, and tracking.</div>
                                    </div>
                                </li>
                                <li className='flex gap-3'>
                                    <span className='mt-1 h-2 w-2 rounded-full bg-secondary flex-none'></span>
                                    <div>
                                        <div className='font-medium'>Analytics & reporting</div>
                                        <div className='text-font-color-100 text-[14px]'>Granular insights to connect fulfillment to your business.</div>
                                    </div>
                                </li>
                            </ul>
                            <div className='text-[13px] text-font-color-100'>
                                Source: DCL eFactory overview – Modern fulfillment for high‑growth brands. See “Our Technology Platform”.
                                <Link href="https://dclcorp.com/why-dcl/efactory-platform/" target="_blank" rel="noreferrer" className='text-primary ms-1 underline'>Learn more</Link>.
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <div className='bg-card-color rounded-xl sm:p-4 p-2 max-w-[500px] w-full shadow-shadow-sm border border-dashed border-border-color'>
                            <div className='sm:max-h-[calc(100svh-48px-32px)] max-h-[calc(100svh-48px-16px)] sm:p-4 p-3 overflow-auto custom-scrollbar'>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}