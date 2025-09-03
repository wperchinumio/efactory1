import { React, useState } from 'react'
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    campaigns_new,
    gallery1,
    gallery2,
    gallery3,
    gallery4,
} from '/public/images'
import {
    IconCircleCheckFilled,
    IconCloudDownload,
    IconCloudUpload,
    IconCopy,
    IconCornerRightDown,
    IconCornerRightUp,
    IconDots,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react'
import Link from 'next/link';
import Image from 'next/image';

export default function CampaignBody({ campaignsModal, openCampaignsModal }) {

    const [isOpen, setIsOpen] = useState(false);


    const chartData1 = {
        options: {
            fill: {
                type: "solid",
            },
            colors: ['var(--chart-color1)'],
            dataLabels: {
                enabled: false
            },
            chart: {
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: 'var(--danger)',
                        dashArray: 0,
                    },
                }
            },
            yaxis: {
                show: false,
                min: 0,
                max: 65,
                tickAmount: 1,
            },
            tooltip: {
                x: {
                    show: false,
                },
                style: {
                    fontFamily: 'var(--font-family)',
                },
            },
            markers: {
                size: 0,
                hover: {
                    size: 0,
                }
            },
        },
        series: [
            {
                name: "",
                data: [47, 45, 54, 38, 24, 65, 31, 45, 56, 24, 65, 31]
            }
        ]
    };

    const chartData2 = {
        options: {
            fill: {
                type: "solid",
            },
            colors: ['var(--chart-color2)'],
            dataLabels: {
                enabled: false
            },
            chart: {
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: 'var(--danger)',
                        dashArray: 0,
                    },
                }
            },
            yaxis: {
                show: false,
                min: 0,
                max: 65,
                tickAmount: 1,
            },
            tooltip: {
                x: {
                    show: false,
                },
                style: {
                    fontFamily: 'var(--font-family)',
                },
            },
            markers: {
                size: 0,
                hover: {
                    size: 0,
                }
            },
        },
        series: [
            {
                name: "",
                data: [47, 45, 54, 38, 24, 65, 31, 45, 56, 24, 65, 31]
            }
        ]
    };

    const chartData3 = {
        options: {
            fill: {
                type: "solid",
            },
            colors: ['var(--chart-color3)'],
            dataLabels: {
                enabled: false
            },
            chart: {
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: 'var(--danger)',
                        dashArray: 0,
                    },
                }
            },
            yaxis: {
                show: false,
                min: 0,
                max: 65,
                tickAmount: 1,
            },
            tooltip: {
                x: {
                    show: false,
                },
                style: {
                    fontFamily: 'var(--font-family)',
                },
            },
            markers: {
                size: 0,
                hover: {
                    size: 0,
                }
            },
        },
        series: [
            {
                name: "",
                data: [47, 45, 54, 38, 24, 65, 31, 45, 56, 24, 65, 31]
            }
        ]
    };

    const chartData4 = {
        options: {
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            fill: {
                type: "solid",
            },
            colors: ['var(--secondary)'],
            dataLabels: {
                enabled: false
            },
            chart: {
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: 'var(--danger)',
                        dashArray: 0,
                    },
                }
            },
            yaxis: {
                show: false,
                min: 0,
                max: 65,
                tickAmount: 1,
            },
            tooltip: {
                x: {
                    show: false,
                },
                style: {
                    fontFamily: 'var(--font-family)',
                },
            },
            markers: {
                size: 0,
                hover: {
                    size: 0,
                }
            },
        },
        series: [
            {
                name: "",
                data: [47, 56, 24, 65, 31, 45, 54, 38, 24, 65, 31, 45]
            }
        ]
    };

    const chartData5 = {
        series: [{
            name: "IMPRESSIONS",
            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        }, {
            name: "TRANSFERED",
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }],
        options: {
            colors: ['var(--chart-color1)', 'var(--chart-color5)'],
            stroke: {
                width: 2,
                curve: 'smooth',
                dashArray: [10, 0]
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                colors: ['var(--chart-color1)', 'var(--chart-color5)'],
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

    const handleIconDotsClick = () => {
        setIsOpen(!isOpen);
    }


    return (
        <>
            <div className='grid xxl:grid-cols-[5fr_7fr] grid-cols-1 gap-4 mb-6'>
                <div className='grid sm:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <div className='md:p-6 p-4'>
                            <p className='uppercase mb-2'>
                                New Sessions
                            </p>
                            <p className='text-[24px]/[30px] font-medium mb-1'>
                                22,500
                            </p>
                            <p className='text-[14px]/[20px] text-font-color-100'>
                                Analytics for last week
                            </p>
                        </div>
                        <ReactApexChart options={chartData1.options} series={chartData1.series} type="bar" height={50} width="100%" />
                    </div>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <div className='md:p-6 p-4'>
                            <p className='uppercase mb-2'>
                                TIME ON SITE
                            </p>
                            <p className='text-[24px]/[30px] font-medium mb-1'>
                                1,070
                            </p>
                            <p className='text-[14px]/[20px] text-font-color-100'>
                                Analytics for last week
                            </p>
                        </div>
                        <ReactApexChart options={chartData2.options} series={chartData2.series} type="bar" height={50} width="100%" />
                    </div>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <div className='md:p-6 p-4'>
                            <p className='uppercase mb-2'>
                                BOUNCE RATE
                            </p>
                            <p className='text-[24px]/[30px] font-medium mb-1'>
                                10K
                            </p>
                            <p className='text-[14px]/[20px] text-font-color-100'>
                                Analytics for last week
                            </p>
                        </div>
                        <ReactApexChart options={chartData3.options} series={chartData3.series} type="bar" height={50} width="100%" />
                    </div>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
                        <div className='md:p-6 p-4'>
                            <p className='uppercase mb-2'>
                                GOAL COMPLETIONS
                            </p>
                            <p className='text-[24px]/[30px] font-medium mb-1'>
                                $1,22,500
                            </p>
                            <p className='text-[14px]/[20px] text-font-color-100'>
                                Analytics for last week
                            </p>
                        </div>
                        <ReactApexChart options={chartData4.options} series={chartData4.series} type="line" height={50} width="100%" />
                    </div>
                    <div className='sm:col-span-2 flex gap-4 sm:flex-row flex-col-reverse card bg-secondary border border-dashed border-border-color text-white rounded-xl overflow-hidden md:p-6 p-4'>
                        <div>
                            <p className='text-[20px]/[26px] font-medium mb-2'>
                                LUNO - Admin Dashboard Template
                            </p>
                            <p className='mb-6'>
                                1 Jan 20222, 11:15 AMF
                            </p>
                            <div className='flex flex-wrap gap-10'>
                                <button className='btn btn-white'>
                                    Published
                                </button>
                                <button className='btn btn-black' onClick={openCampaignsModal}>
                                    Create New
                                </button>
                            </div>
                        </div>
                        <Image src={campaigns_new} alt='campaigns_new' width="164" height="127" className='sm:ms-auto' />
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                    <div className='flex items-center justify-between gap-15 md:p-6 p-4'>
                        <div>
                            <div className='font-semibold'>
                                Impressions & Data Traffic
                            </div>
                            <div className='text-font-color-100 text-[14px]/[20px]'>
                                Or you can <Link href="#" className='text-primary transition-all hover:text-secondary'>sync data to Dashboard</Link> to ensure your data is always up-to-date.
                            </div>
                        </div>
                        <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                            <IconDots className='w-[18px] h-[18px]' onClick={handleIconDotsClick} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-100 mt-200 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                <ul className="py-1">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> File Info</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Copy to</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Move to</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rename</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Block</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"></li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2 md:p-6 p-4'>
                        <div className='flex-1 border border-dashed border-border-color py-2 px-4 rounded-xl'>
                            <div className='flex items-center gap-1 text-font-color-100 uppercase text-[14px]/[20px] mb-2'>
                                <span className='inline-block w-[12px] h-[12px] min-w-[12px] rounded-sm bg-primary'></span>
                                Impressions
                            </div>
                            <div className='flex gap-1 items-end mb-2'>
                                <span className='md:text-[24px]/[30px] text-[20px]/[26px] font-bold'>
                                    4.2M
                                </span>
                                <span className='text-success flex items-end'>
                                    <IconCornerRightUp />
                                    43%
                                </span>
                            </div>
                            <div className='text-font-color-100 text-[14px]/[20px]'>
                                5.0M Total Target
                            </div>
                        </div>
                        <div className='flex-1 border border-dashed border-border-color py-2 px-4 rounded-xl'>
                            <div className='flex items-center gap-1 text-font-color-100 uppercase text-[14px]/[20px] mb-2'>
                                <span className='inline-block w-[12px] h-[12px] min-w-[12px] rounded-sm bg-secondary'></span>
                                DATA TRANSFERED
                            </div>
                            <div className='flex gap-1 items-end mb-2'>
                                <span className='md:text-[24px]/[30px] text-[20px]/[26px] font-bold'>
                                    8.3M
                                </span>
                                <span className='text-danger flex items-end'>
                                    <IconCornerRightDown />
                                    17%
                                </span>
                            </div>
                            <div className='text-font-color-100 text-[14px]/[20px]'>
                                10.0M Total Target
                            </div>
                        </div>
                        <div className='flex-1 border border-dashed border-border-color py-2 px-4 rounded-xl'>
                            <div className='text-font-color-100 uppercase text-[14px]/[20px] mb-2'>
                                DELEVERED
                            </div>
                            <span className='md:text-[24px]/[30px] text-[20px]/[26px] font-bold mb-2 inline-block'>
                                87%
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[87%] bg-primary h-full'></div>
                            </div>
                        </div>
                        <div className='flex-1 border border-dashed border-border-color py-2 px-4 rounded-xl'>
                            <div className='text-font-color-100 uppercase text-[14px]/[20px] mb-2'>
                                TRANSFERED
                            </div>
                            <span className='md:text-[24px]/[30px] text-[20px]/[26px] font-bold mb-2 inline-block'>
                                77%
                            </span>
                            <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full'>
                                <div className='progress-bar w-[77%] bg-secondary h-full'></div>
                            </div>
                        </div>
                    </div>
                    <ReactApexChart options={chartData5.options} series={chartData5.series} type="line" height="320" className="md:px-6" />
                </div>
            </div>
            <div>
                <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                    <div className='text-[20px]/[26px] font-medium'>
                        Recent Campaigns
                    </div>
                    <div className='flex items-stretch gap-1 flex-wrap'>
                        <select className="form-select cursor-pointer rounded-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                            <option defaultValue="">Filter</option>
                            <option value="1">Designer</option>
                            <option value="2">Developer</option>
                            <option value="3">Office</option>
                            <option value="4">Friends</option>
                            <option value="5">Management</option>
                        </select>
                        <button className='btn btn-outline-secondary !py-2 !px-3'>
                            <IconCloudDownload className='w-[18px] h-[18px]' />
                            <span className='sm:block hidden'>
                                Import
                            </span>
                        </button>
                        <button className='btn btn-outline-secondary !py-2 !px-3'>
                            <IconCloudUpload className='w-[18px] h-[18px]' />
                            <span className='sm:block hidden'>
                                Export
                            </span>
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-5'>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 flex gap-4 lg:items-center lg:flex-row flex-col border border-dashed border-border-color'>
                        <Image src={gallery1} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                        <div className='w-full lg:max-w-[600px]'>
                            <p className='font-medium'>
                                New Freebies for Designer and Developer
                            </p>
                            <p className='text-font-color-100'>
                                Regular (Send by time zone) 22 Dec 2021
                            </p>
                        </div>
                        <div className='grid grid-cols-3 gap-2 w-full lg:max-w-[400px]'>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    3,021
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Recipents
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[77%] bg-primary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    12.5%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Opened
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[91%] bg-secondary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    5.7%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Clicked
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[85%] bg-info h-full'></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-10 lg:ms-auto'>
                            <button title='Edit' className='p-1 text-font-color-100'>
                                <IconPencil className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Delete' className='p-1 text-font-color-100'>
                                <IconTrash className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Copy' className='p-1 text-font-color-100'>
                                <IconCopy className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 flex gap-4 lg:items-center lg:flex-row flex-col border border-dashed border-border-color'>
                        <Image src={gallery2} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                        <div className='w-full lg:max-w-[600px]'>
                            <p className='font-medium'>
                                Lucid - VueJS Admin Template & Webapp kit
                            </p>
                            <p className='text-font-color-100'>
                                Regular (Send by time zone) 25 Dec 2021
                            </p>
                        </div>
                        <div className='grid grid-cols-3 gap-2 w-full lg:max-w-[400px]'>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    5,201
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Recipents
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[77%] bg-primary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    16.5%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Opened
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[91%] bg-secondary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    5.7%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Clicked
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[85%] bg-info h-full'></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-10 lg:ms-auto'>
                            <button title='Edit' className='p-1 text-font-color-100'>
                                <IconPencil className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Delete' className='p-1 text-font-color-100'>
                                <IconTrash className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Copy' className='p-1 text-font-color-100'>
                                <IconCopy className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 flex gap-4 lg:items-center lg:flex-row flex-col border border-dashed border-border-color'>
                        <Image src={gallery3} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                        <div className='w-full lg:max-w-[600px]'>
                            <p className='font-medium'>
                                Alpino - Bootstrap 4 Admin Dashboard Template
                            </p>
                            <p className='text-font-color-100'>
                                Regular (Send by time zone) 26 Dec 2021
                            </p>
                        </div>
                        <div className='grid grid-cols-3 gap-2 w-full lg:max-w-[400px]'>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    3,548
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Recipents
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[77%] bg-primary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    18.5%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Opened
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[91%] bg-secondary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    8.7%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Clicked
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[85%] bg-info h-full'></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-10 lg:ms-auto'>
                            <button title='Edit' className='p-1 text-font-color-100'>
                                <IconPencil className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Delete' className='p-1 text-font-color-100'>
                                <IconTrash className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Copy' className='p-1 text-font-color-100'>
                                <IconCopy className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    </div>
                    <div className='card rounded-xl bg-card-color md:p-6 p-4 flex gap-4 lg:items-center lg:flex-row flex-col border border-dashed border-border-color'>
                        <Image src={gallery4} width="110" height="69" alt='chat attachment' className='p-1 border border-border-color rounded-md' />
                        <div className='w-full lg:max-w-[600px]'>
                            <p className='font-medium'>
                                New sale LUNO Admin template
                            </p>
                            <p className='text-font-color-100'>
                                Regular (Send by time zone) 31 Dec 2021
                            </p>
                        </div>
                        <div className='grid grid-cols-3 gap-2 w-full lg:max-w-[400px]'>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    1,850
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Recipents
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[77%] bg-primary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    10.5%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Opened
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[91%] bg-secondary h-full'></div>
                                </div>
                            </div>
                            <div className='border border-dashed border-border-color py-2 sm:px-4 px-2 rounded-xl'>
                                <p className='font-medium'>
                                    5.7%
                                </p>
                                <p className='text-font-color-100 mb-1'>
                                    Clicked
                                </p>
                                <div className='progress overflow-hidden h-[1px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[85%] bg-info h-full'></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-10 lg:ms-auto'>
                            <button title='Edit' className='p-1 text-font-color-100'>
                                <IconPencil className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Delete' className='p-1 text-font-color-100'>
                                <IconTrash className='w-[18px] h-[18px]' />
                            </button>
                            <button title='Copy' className='p-1 text-font-color-100 '>
                                <IconCopy className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {campaignsModal &&
                <>
                    <div className={`fixed p-15 w-full max-w-[800px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                        <div className='py-10 md:px-10 px-[7px] bg-card-color rounded-lg shadow-shadow-lg'>
                            <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                <div className='text-[24px]/[30px] font-medium mb-2'>
                                    Create Campaigns
                                </div>
                                <div className='text-font-color-100 mb-6'>
                                    All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary
                                </div>
                                <div className='form-control mb-15'>
                                    <label htmlFor='campaignsTitle' className='form-label'>
                                        Campaigns Title
                                    </label>
                                    <input type='text' id='campaignsTitle' placeholder='Campaigns Title' className='form-input' />
                                </div>
                                <div className="form-control mb-15 flex flex-col">
                                    <label className='form-label'>Campaigns Description</label>
                                    <textarea className="form-textarea" placeholder="Leave a comment here" rows="3"></textarea>
                                </div>
                                <div className='grid sm:grid-cols-3 grid-cols-1 gap-10 mb-1'>
                                    <div className="form-control">
                                        <label htmlFor='campaignsDate' className='form-label'>Date</label>
                                        <input type="date" id='campaignsDate' className="form-input" placeholder="Select Date" />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor='campaignsTime' className='form-label'>Time</label>
                                        <input type="time" id='campaignsTime' className="form-input" placeholder="Select Time" />
                                    </div>
                                    <div className='form-control'>
                                        <label htmlFor='campaignsDuration' className='form-label'>
                                            Duration
                                        </label>
                                        <input type='text' id='campaignsDuration' placeholder='1h 45m' className='form-input' />
                                    </div>
                                </div>
                                <p className="text-[14px]/[20px] text-font-color-100 flex gap-5 mb-15">
                                    <IconCircleCheckFilled className='w-[16px] h-[16px] min-w-[16px] mt-[2px]' />
                                    This event will take place on the july 14, 2022 form 02:30 PM untill 05:15 PM
                                </p>
                                <div className='form-control mb-15'>
                                    <label htmlFor='campaignsLocation' className='form-label'>
                                        Location
                                    </label>
                                    <input type='text' id='campaignsLocation' placeholder='Location' className='form-input' />
                                </div>
                                <div className='form-control mb-15 flex gap-2 items-center'>
                                    <label className='form-label'>
                                        Participate :
                                    </label>
                                    <Link href="#">
                                        <Image src={avatar1} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                    </Link>
                                    <Link href="#">
                                        <Image src={avatar2} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                    </Link>
                                    <Link href="#">
                                        <Image src={avatar3} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                    </Link>
                                    <Link href="#">
                                        <Image src={avatar4} width="26" height="26" alt='chat profile' className='w-[26px] h-[26px] min-w-[26px] border border-body-color rounded-md saturate-50 hover:saturate-100' />
                                    </Link>
                                </div>
                                <div className='form-control mb-15'>
                                    <label className='form-label'>
                                        Set reminder
                                    </label>
                                    <div className='relative w-full flex'>
                                        <div className="flex items-center justify-center gap-4 border border-border-color rounded-s-md me-[-1px] py-[6px] px-[12px] bg-body-color">
                                            <div className="form-radio">
                                                <input
                                                    type="radio"
                                                    id="campaignsEmail"
                                                    name="campaignsReminder"
                                                    className="form-radio-input"
                                                />
                                                <label className="form-radio-label" htmlFor="campaignsEmail">Email</label>
                                            </div>
                                            <div className="form-radio">
                                                <input
                                                    type="radio"
                                                    id="campaignsStack"
                                                    name="campaignsReminder"
                                                    className="form-radio-input"
                                                />
                                                <label className="form-radio-label" htmlFor="campaignsStack">Stack</label>
                                            </div>
                                        </div>
                                        <input type='text' className='form-input !rounded-s-none' />
                                    </div>
                                </div>
                                <div className='flex items-stretch gap-5'>
                                    <button onClick={openCampaignsModal} className='btn btn-secondary'>
                                        Close
                                    </button>
                                    <button className='btn btn-primary'>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={openCampaignsModal} className={`fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                </>
            }
        </>
    )
}
