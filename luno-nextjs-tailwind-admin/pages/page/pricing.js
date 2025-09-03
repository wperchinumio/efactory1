import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import { IconHeartFilled } from '@tabler/icons-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css';

export default function Pricing() {

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Pricing",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <Swiper
                    pagination={true}
                    modules={[Pagination]}
                    slidesPerView="1.1"
                    spaceBetween={10}
                    grabCursor={true}
                    breakpoints={{
                        1600: {
                            slidesPerView: "4"
                        },
                        992: {
                            slidesPerView: "3"
                        },
                        767: {
                            slidesPerView: "2.5"
                        },
                        449: {
                            slidesPerView: "1.5"
                        }
                    }}
                    className='pb-12'
                >
                    <SwiperSlide className='!flex !h-auto'>
                        <div className='card bg-card-color rounded-xl xxl:p-12 p-6 flex flex-col border border-dashed border-border-color'>
                            <h5 className='text-[20px]/[24px] font-medium mb-2'>
                                Free
                            </h5>
                            <p className='mb-2'>
                                Best for Startup agencies who want to automate their reporting
                            </p>
                            <div className='mb-4'>
                                <span className='text-primary text-[40px]/[60px] font-bold'>
                                    $0
                                </span>
                                <span> / month</span>
                            </div>
                            <ul className='flex flex-col gap-2 mb-6 list-disc ps-20'>
                                <li>
                                    5 Clients
                                </li>
                            </ul>
                            <button className='btn btn-white !border-border-color w-full uppercase large mt-auto'>
                                Buy Now
                            </button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='!flex !h-auto'>
                        <div className='card bg-card-color rounded-xl xxl:p-12 p-6 flex flex-col border border-dashed border-border-color'>
                            <h5 className='text-[20px]/[24px] font-medium mb-2'>
                                Starter
                            </h5>
                            <p className='mb-2'>
                                Best for Startup agencies who want to automate their reporting
                            </p>
                            <div className='mb-4'>
                                <span className='text-primary text-[40px]/[60px] font-bold'>
                                    $19
                                </span>
                                <span> / month</span>
                            </div>
                            <ul className='flex flex-col gap-2 mb-6 list-disc ps-20'>
                                <li>
                                    15 Clients
                                </li>
                                <li>
                                    Unlimited Reports
                                </li>
                                <li>
                                    Unlimited Live Dashboards
                                </li>
                            </ul>
                            <button className='btn btn-white !border-border-color w-full uppercase large mt-auto'>
                                Buy Starter
                            </button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='!flex !h-auto'>
                        <div className='card bg-card-color rounded-xl relative xxl:p-12 p-6 flex flex-col border border-dashed border-border-color'>
                            <div className="bg-primary p-5 w-[30px] inline-flex items-center justify-center absolute top-0 end-[20px] after:absolute after:end-0 after:top-[calc(100%-10px)] after:border-[15px] after:border-primary after:border-b-[5px] after:border-b-transparent ">
                                <IconHeartFilled className='text-white w-[16px] h-[16px] relative z-[1]' />
                            </div>
                            <h5 className='text-[20px]/[24px] font-medium mb-2'>
                                Professional
                            </h5>
                            <p className='mb-2'>
                                Best for Agencies who want a brandable marketing platform
                            </p>
                            <div className='mb-4'>
                                <span className='text-primary text-[40px]/[60px] font-bold'>
                                    $39
                                </span>
                                <span> / month</span>
                            </div>
                            <ul className='flex flex-col gap-2 mb-6 list-disc ps-20'>
                                <li>
                                    45 Clients
                                </li>
                                <li>
                                    Unlimited Reports
                                </li>
                                <li>
                                    Unlimited Live Dashboards
                                </li>
                            </ul>
                            <button className='btn btn-primary w-full uppercase large mt-auto'>
                                Buy Starter
                            </button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='!flex !h-auto'>
                        <div className='card bg-card-color rounded-xl xxl:p-12 p-6 flex flex-col border border-dashed border-border-color'>
                            <div>
                                <h5 className='text-[20px]/[24px] font-medium mb-2'>
                                    Enterprise
                                </h5>
                                <p className='mb-2'>
                                    Best for Large agencies who want to scale their processes
                                </p>
                                <div className='mb-4'>
                                    <span className='text-primary text-[40px]/[60px] font-bold'>
                                        Contact us
                                    </span>
                                </div>
                                <ul className='flex flex-col gap-2 mb-6 list-disc ps-20'>
                                    <li>
                                        Everything in Team plan
                                    </li>
                                    <li>
                                        Custom Connectors
                                    </li>
                                    <li>
                                        Franchise Solutions
                                    </li>
                                    <li>
                                        Marketing Analytics
                                    </li>
                                    <li>
                                        Data
                                    </li>
                                    <li>
                                        Storage
                                    </li>
                                    <li>
                                        150+ Data Sources
                                    </li>
                                </ul>
                            </div>
                            <button className='btn btn-white !border-border-color w-full uppercase large mt-auto'>
                                Contact Us
                            </button>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}
