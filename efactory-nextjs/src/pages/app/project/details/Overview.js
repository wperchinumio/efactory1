import React from 'react'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
    IconCircleArrowLeftFilled,
    IconDots,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
} from '/public/images';
import Image from 'next/image';

export default function Overview() {

    const router = useRouter();

    const chartData1 = {
        series: [{
            name: 'Complete',
            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
            name: 'Incomplete',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
        },],
        options: {
            colors: ['var(--primary)', 'var(--secondary)'],
            stroke: {
                width: 2,
                curve: 'monotoneCubic',
                dashArray: [0, 8, 0]
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                colors: ['var(--primary)', 'var(--secondary)'],
                strokeWidth: 0,
                hover: {
                    size: 3,
                }
            },
            chart: {
                toolbar: {
                    show: false,
                },
            },
            grid: {
                borderColor: 'var(--border-color)',
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                tooltip: {
                    enabled: false,
                },
                axisBorder: {
                    color: 'var(--border-color)',
                },
                axisTicks: {
                    color: 'var(--border-color)',
                },
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
            },
            responsive: [{
                breakpoint: 767,
                options: {
                    chart: {
                        height: 'auto'
                    }
                },
            }]
        },
    };

    const chartData2 = {
        series: [44, 55, 41, 17],
        options: {
            labels: ['Active', 'Completed', 'Overdue', 'Yet to start'],
            colors: ['var(--chart-color1)', 'var(--chart-color2)', 'var(--chart-color3)', 'var(--chart-color4)'],
            legend: {
                show: true,
                position: 'bottom',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                colors: ['var(--card-color)']
            },
            plotOptions: {
                pie: {
                    expandOnClick: true,
                }
            }
        },
    };

    return (
        <>
            <div className='flex items-center gap-2 text-[24px]/[30px] font-medium my-2'>
                <button onClick={() => router.back()} className='text-primary transition-all hover:text-secondary'>
                    <IconCircleArrowLeftFilled className='rtl:rotate-180' />
                </button>
                Project Overview
            </div>
            <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mb-4'>
                <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                    <span className='font-bold text-[24px]/[30px]'>
                        1.5K
                    </span>
                    <p className='uppercase text-font-color-100 small'>
                        UPFRONT PAYMENT
                    </p>
                </div>
                <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                    <span className='font-bold text-[24px]/[30px]'>
                        3.5K
                    </span>
                    <p className='uppercase text-font-color-100 small'>
                        INVOICE SENT
                    </p>
                </div>
                <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                    <span className='font-bold text-[24px]/[30px]'>
                        4K
                    </span>
                    <p className='uppercase text-font-color-100 small'>
                        PAYMENT RECEIVED
                    </p>
                </div>
                <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                    <span className='font-bold text-[24px]/[30px]'>
                        1.7K
                    </span>
                    <p className='uppercase text-font-color-100 small'>
                        AMOUNT PENDING
                    </p>
                </div>
            </div>
            <div className='card bg-card-color rounded-xl mb-4'>
                <div className='flex items-center justify-between gap-15 md:p-6 p-4'>
                    <div className='font-semibold'>
                        Tasks Over Time
                    </div>
                    <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                </div>
                <ReactApexChart options={chartData1.options} series={chartData1.series} type="line" height="300" className="md:px-6" />
            </div>
            <div className='grid grid-cols-12 gap-4'>
                <div className='card xxl:col-span-4 md:col-span-6 col-span-12 bg-card-color rounded-xl md:p-6 p-4'>
                    <div className='flex items-center justify-between gap-15 md:mb-6 mb-4'>
                        <div className='font-semibold'>
                            Tasks Summary
                        </div>
                        <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                            <IconDots className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                    <div className='flex items-center justify-around gap-3 md:mb-6 mb-4'>
                        <div className='flex flex-col justify-center items-center'>
                            <span className='font-bold'>
                                27
                            </span>
                            <span className='uppercase text-font-color-100'>
                                Resolved
                            </span>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <span className='font-bold'>
                                13
                            </span>
                            <span className='uppercase text-font-color-100'>
                                ISSUES
                            </span>
                        </div>
                    </div>
                    <ReactApexChart options={chartData2.options} series={chartData2.series} type="donut" height="280" className="" />
                </div>
                <div className='card xxl:col-span-4 md:col-span-6 col-span-12 bg-card-color border border-card-color rounded-xl'>
                    <div className='flex items-center justify-between gap-15 md:p-6 p-4'>
                        <div className='font-semibold'>
                            Milestones
                        </div>
                        <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                            <IconDots className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                    <ul>
                        <li className='py-4 px-6 bg-body-color'>
                            <span className='inline-block mb-2'>
                                Overall progress
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[95%] bg-gradient-to-r from-primary to-secondary h-full'></div>
                            </div>
                        </li>
                        <li className='py-4 px-6 border-b border-dashed border-border-color'>
                            <span className='inline-block mb-2'>
                                App Ui design
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[77%] bg-chart-color1 h-full'></div>
                            </div>
                        </li>
                        <li className='py-4 px-6 border-b border-dashed border-border-color'>
                            <span className='inline-block mb-2'>
                                Desktop app development
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[55%] bg-chart-color2 h-full'></div>
                            </div>
                        </li>
                        <li className='py-4 px-6 border-b border-dashed border-border-color'>
                            <span className='inline-block mb-2'>
                                Website design
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[23%] bg-chart-color3 h-full'></div>
                            </div>
                        </li>
                        <li className='py-4 px-6'>
                            <span className='inline-block mb-2'>
                                QA Analyst
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[55%] bg-chart-color4 h-full'></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='card xxl:col-span-4 col-span-12 bg-card-color border border-card-color rounded-xl'>
                    <div className='flex items-center justify-between gap-15 md:p-6 p-4'>
                        <div className='font-semibold'>
                            Project Team
                        </div>
                        <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                            <IconDots className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                    <ul className=''>
                        <li className='border-b border-dashed border-border-color px-6 py-3 flex items-center gap-3 transition-all hover:bg-primary-10 last:border-b-0'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex items-center gap-2 justify-between w-full truncate'>
                                <div className='truncate'>
                                    <p className='truncate'>
                                        Chris Fox
                                    </p>
                                    <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                        Design Lead
                                    </p>
                                </div>
                                <div className="flex">
                                    <Image src={avatar1} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar2} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                </div>
                            </div>
                        </li>
                        <li className='border-b border-dashed border-border-color px-6 py-3 flex items-center gap-3 transition-all hover:bg-primary-10 last:border-b-0'>
                            <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex items-center gap-2 justify-between w-full truncate'>
                                <div className='truncate'>
                                    <p className='truncate'>
                                        Cindy Anderson
                                    </p>
                                    <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                        Marketing Lead
                                    </p>
                                </div>
                                <div className="flex">
                                    <Image src={avatar1} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar2} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar3} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                </div>
                            </div>
                        </li>
                        <li className='border-b border-dashed border-border-color px-6 py-3 flex items-center gap-3 transition-all hover:bg-primary-10 last:border-b-0'>
                            <Image src={avatar6} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex items-center gap-2 justify-between w-full truncate'>
                                <div className='truncate'>
                                    <p className='truncate'>
                                        Maryam Amiri
                                    </p>
                                    <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                        Dev Lead
                                    </p>
                                </div>
                                <div className="flex">
                                    <Image src={avatar4} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar5} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar6} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar7} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                </div>
                            </div>
                        </li>
                        <li className='border-b border-dashed border-border-color px-6 py-3 flex items-center gap-3 transition-all hover:bg-primary-10 last:border-b-0'>
                            <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex items-center gap-2 justify-between w-full truncate'>
                                <div className='truncate'>
                                    <p className='truncate'>
                                        Alexander
                                    </p>
                                    <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                        QA Lead
                                    </p>
                                </div>
                                <div className="flex">
                                    <Image src={avatar9} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar10} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                </div>
                            </div>
                        </li>
                        <li className='border-b border-dashed border-border-color px-6 py-3 flex items-center gap-3 transition-all hover:bg-primary-10 last:border-b-0'>
                            <Image src={avatar5} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex items-center gap-2 justify-between w-full truncate'>
                                <div className='truncate'>
                                    <p className='truncate'>
                                        Joge Lucky
                                    </p>
                                    <p className='text-[14px]/[20px] text-font-color-100 truncate'>
                                        Sales Lead
                                    </p>
                                </div>
                                <div className="flex">
                                    <Image src={avatar5} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                    <Image src={avatar8} alt="Project Team" className="rounded-full w-[26px] h-[26px] min-w-[26px] border-2 border-card-color -ml-3 hover:relative hover:z-[1]" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
