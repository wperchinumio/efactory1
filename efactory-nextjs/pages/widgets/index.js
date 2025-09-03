import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
    IconAirConditioning,
    IconArchiveFilled,
    IconBrandFacebook,
    IconBrandGoogleFilled,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconCaretUpFilled,
    IconCash,
    IconCheck,
    IconCircleCheckFilled,
    IconClockHour9,
    IconCornerRightUp,
    IconDots,
    IconFolderFilled,
    IconHeartFilled,
    IconMapPin,
    IconSearch,
    IconStar,
    IconStarFilled,
    IconX,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    campaigns_new,
    gallery1,
    modal_joblisting,
    profile_av,
} from '/public/images'
import Link from 'next/link';
import Image from 'next/image';

export default function Widget() {

    const [jobListingModal, setJobListingModal] = useState(false)
    const openJobListingModal = () => {
        setJobListingModal(!jobListingModal)
    }
    useEffect(() => {
        document.body.classList[jobListingModal ? "add" : "remove"]("overflow-hidden")
    }, [jobListingModal])

    const [campaignsModal, setCampaignsModal] = useState(false)
    const openCampaignsModal = () => {
        setCampaignsModal(!campaignsModal)
    }
    useEffect(() => {
        document.body.classList[campaignsModal ? "add" : "remove"]("overflow-hidden")
    }, [campaignsModal])

    const breadcrumbItem = [
        {
            name: "Widget",
        },
    ]

    const chartData1 = {
        series: [55, 35, 10],
        options: {
            colors: ['var(--chart-color1)', 'var(--chart-color2)', 'var(--chart-color3)'],
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
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                            },
                        },
                    }
                }
            }
        },
    };

    const chartData2 = {
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

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-4'>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                            <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                                <div className='flex items-center justify-between gap-5 mb-2'>
                                    <p>
                                        REVENUE
                                    </p>
                                    <IconCash className='stroke-primary stroke-[1.5] w-[32px] h-[32px]' />
                                </div>
                                <div className='flex items-end gap-1 mb-4'>
                                    <span className='inline-block text-[24px]/[30px] font-medium'>
                                        $18,925
                                    </span>
                                    <IconCornerRightUp className='stroke-font-color-100 w-[18px] h-[18px]' />
                                    <span className='text-font-color-100 text-[14px]/[20px]'>
                                        78%
                                    </span>
                                </div>
                                <div className='progress overflow-hidden h-[2px] bg-border-color rounded-full'>
                                    <div className='progress-bar w-[70%] bg-success h-full'></div>
                                </div>
                            </div>
                            <div className='py-3 md:px-6 px-4 text-font-color-100 text-[14px]/[20px]'>
                                Analytics for last week
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color md:p-6 p-4'>
                            <div className='font-semibold md:mb-6 mb-4'>
                                Sales by Category
                            </div>
                            <ReactApexChart options={chartData1.options} series={chartData1.series} type="donut" height="300" className="max-w-[300px] mx-auto" />
                        </div>
                        <div className='card md:p-6 p-4 rounded-xl border border-dashed border-danger text-danger bg-red-100'>
                            <IconAirConditioning />
                            <div className='mt-4'>
                                <p className='mb-2 font-medium'>
                                    Air Conditioner
                                </p>
                                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                                    <span className='inline-block'>
                                        Temprature :
                                    </span>
                                    <span className='inline-block font-semibold'>
                                        26° C
                                    </span>
                                </div>
                                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                                    <span className='inline-block'>
                                        Status :
                                    </span>
                                    <span className='inline-block font-semibold'>
                                        Cooling On
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='md:p-6 p-4 rounded-xl card bg-card-color border border-dashed border-border-color'>
                            <div className="flex justify-between items-center mb-6">
                                <IconBrandGoogleFilled className='w-[30px] h-[30px]' />
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <h6>Google Drive</h6>
                            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                <div className='progress-bar w-[50%] bg-primary h-full'></div>
                            </div>
                            <div className="flex justify-between text-font-color-100 mt-2 text-[14px]/[20px]">7.23GB<span>15GB</span></div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color relative xxl:p-12 p-6 flex flex-col'>
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
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color md:p-6 p-4 relative'>
                            <div className='w-[56px] h-[56px] min-w-[56px] mb-4 rounded-full overflow-hidden uppercase bg-body-color flex items-center justify-center font-semibold text-[20px]/[30px] text-secondary'>
                                AJ
                            </div>
                            <small className="text-font-color-100">Total</small>
                            <h4 className='text-[24px]/[28px] font-medium mb-2'>USD 12,500</h4>
                            <ul className='list-disc ps-6 leading-8 text-font-color-100'>
                                <li>
                                    Andew Jon
                                </li>
                                <li>
                                    #RA0018
                                </li>
                                <li>
                                    Jan 05 2022
                                </li>
                            </ul>
                        </div>
                        <div className='card bg-card-color p-4 rounded-xl border border-dashed border-border-color'>
                            <div className='flex gap-2 items-center uppercase text-font-color-100 mb-1'>
                                <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-danger'></span>
                                NEW TICKET
                            </div>
                            <div className='flex items-end gap-2'>
                                <span className="font-bold text-[24px]/[30px]">
                                    12
                                </span>
                                <span className='flex items-end'>
                                    5%
                                    <IconCaretUpFilled className='w-[16px] h-[16px] min-w-[16px]' />
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-4 sm:flex-row flex-col-reverse card bg-secondary text-white rounded-xl overflow-hidden md:p-6 p-4 border border-dashed border-border-color'>
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
                    <div className='flex flex-col gap-4'>
                        <div className='card rounded-xl bg-card-color flex flex-col border border-dashed border-border-color'>
                            <div className='md:p-6 p-4'>
                                <div className='flex items-center justify-between gap-15 md:mb-6 mb-4'>
                                    <div className='font-semibold'>
                                        Reports overview
                                    </div>
                                    <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                        <IconDots className='w-[18px] h-[18px]' />
                                    </button>
                                </div>
                                <p className='md:text-[24px]/[30px] text-[20px]/[26px] font-bold mb-2'>
                                    $7,431.14 USD
                                </p>
                                <div className='progress overflow-hidden h-10 bg-border-color rounded-full flex'>
                                    <div className='progress-bar w-[15%] bg-chart-color1 h-full'></div>
                                    <div className='progress-bar w-[30%] bg-chart-color2 h-full'></div>
                                    <div className='progress-bar w-[20%] bg-chart-color3 h-full'></div>
                                </div>
                                <div className="flex justify-between text-[14px]/[20px] text-font-color-100 mt-2">
                                    <span>0%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto border-t border-border-color mt-auto">
                                <table className="w-full min-w-[500px]">
                                    <tbody>
                                        <tr>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>
                                                <p className='flex items-center gap-2'>
                                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-chart-color1'></span>Gross value
                                                </p>
                                            </td>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>$3,500.71</td>
                                            <td className='px-4 py-3 border-b border-dashed border-border-color'><span className="py-1 px-2 rounded-md text-white text-[12px]/[1] bg-success">+12.1%</span></td>
                                        </tr>
                                        <tr>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>
                                                <p className='flex items-center gap-2'>
                                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-chart-color2'></span>Net volume from sales
                                                </p>
                                            </td>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>$2,980.45</td>
                                            <td className='px-4 py-3 border-b border-dashed border-border-color'><span className="py-1 px-2 rounded-md text-black text-[12px]/[1] bg-warning">+6.9%</span></td>
                                        </tr>
                                        <tr>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>
                                                <p className='flex items-center gap-2'>
                                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-chart-color3'></span>New volume from sales
                                                </p>
                                            </td>
                                            <td className='px-4 py-3 border-e border-b border-dashed border-border-color'>$950.00</td>
                                            <td className='px-4 py-3 border-b border-dashed border-border-color'><span className="py-1 px-2 rounded-md text-white text-[12px]/[1] bg-danger">-1.5%</span></td>
                                        </tr>
                                        <tr>
                                            <td className='px-4 py-3 border-r border-dashed border-border-color'>
                                                <p className='flex items-center gap-2'>
                                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-chart-color4'></span>Other
                                                </p>
                                            </td>
                                            <td className='px-4 py-3 border-r border-dashed border-border-color'>32</td>
                                            <td className='px-4 py-3'><span className="py-1 px-2 rounded-md text-white text-[12px]/[1] bg-success">1.9%</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color overflow-hidden'>
                            <div className='flex items-center justify-between gap-2 md:p-6 p-4'>
                                <div className='font-semibold'>
                                    Notifications Settings
                                </div>
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <ul>
                                <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                    <div className='form-check'>
                                        <input type="checkbox" id="notiSetting1" className="form-check-input check-line" />
                                        <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting1">
                                            Anyone send me a message
                                        </label>
                                    </div>
                                </li>
                                <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                    <div className='form-check'>
                                        <input type="checkbox" id="notiSetting2" className="form-check-input check-line" />
                                        <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting2">
                                            Anyone seeing my profile page
                                        </label>
                                    </div>
                                </li>
                                <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                    <div className='form-check'>
                                        <input type="checkbox" id="notiSetting3" className="form-check-input check-line" />
                                        <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting3">
                                            Anyone posts a comment on my post
                                        </label>
                                    </div>
                                </li>
                                <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                    <div className='form-check'>
                                        <input type="checkbox" id="notiSetting4" className="form-check-input check-line" />
                                        <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting4">
                                            Anyone send me a message
                                        </label>
                                    </div>
                                </li>
                                <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                    <div className='form-check'>
                                        <input type="checkbox" id="notiSetting5" className="form-check-input check-line" />
                                        <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting5">
                                            Anyone seeing my profile page
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color p-4 relative'>
                            <div className='bg-primary p-5 w-[30px] inline-flex items-center justify-center absolute top-0 end-[20px] after:absolute after:end-0 after:top-[calc(100%-10px)] after:border-[15px] after:border-primary after:border-b-[5px] after:border-b-transparent '>
                                <IconStarFilled className='text-white w-[16px] h-[16px] relative z-[1]' />
                            </div>
                            <IconFolderFilled className='w-[36px] h-[36px]' />
                            <h5 className='my-2 text-[20px]/[26px] font-medium'>Documents</h5>
                            <div className="flex flex-wrap justify-between text-font-color-100">
                                <span>
                                    Files :
                                </span>
                                <span>
                                    245
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-between text-font-color-100">
                                <span>
                                    Size :
                                </span>
                                <span>
                                    80 MB
                                </span>
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color md:p-6 p-4'>
                            <h6 className='font-semibold mb-4'>
                                Skills Information
                            </h6>
                            <p className='text-font-color-100 mb-4'>
                                Augue mauris dignissim arcu, ut venenatis metus ante eu orci. Donec non maximus neque, ut finibus ex. <Link href="#" className='text-primary transition-all hover:text-secondary'>Read more</Link>
                            </p>
                            <ul className='flex flex-col gap-4'>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            HTML5
                                        </small>
                                        <small>
                                            77
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[77%] bg-chart-color2 h-full"></div>
                                    </div>
                                </li>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            CSS3
                                        </small>
                                        <small>
                                            85
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[85%] bg-chart-color5 h-full"></div>
                                    </div>
                                </li>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            BOOTSTRAP
                                        </small>
                                        <small>
                                            95
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[95%] bg-chart-color1 h-full"></div>
                                    </div>
                                </li>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            Tailwind
                                        </small>
                                        <small>
                                            90
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[90%] bg-success h-full"></div>
                                    </div>
                                </li>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            RESPONSIVE
                                        </small>
                                        <small>
                                            80
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[80%] bg-chart-color4 h-full"></div>
                                    </div>
                                </li>
                                <li>
                                    <div className='text-font-color-100 flex items-center gap-1 justify-between mb-1 uppercase'>
                                        <small>
                                            Javascript
                                        </small>
                                        <small>
                                            66
                                        </small>
                                    </div>
                                    <div className="progress overflow-hidden h-[3px] bg-border-color rounded-full">
                                        <div className="progress-bar w-[66%] bg-chart-color3 h-full"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                            <p className='font-semibold md:mb-6 mb-4'>
                                Average Agent Rating
                            </p>
                            <div className='text-[28px]/[34px] font-medium mb-2'>
                                4/<small>5</small>
                            </div>
                            <ul className='flex items-center gap-1 flex-wrap'>
                                <li>
                                    <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                        <IconStarFilled className='w-full h-full' />
                                    </button>
                                </li>
                                <li>
                                    <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                        <IconStarFilled className='w-full h-full' />
                                    </button>
                                </li>
                                <li>
                                    <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                        <IconStarFilled className='w-full h-full' />
                                    </button>
                                </li>
                                <li>
                                    <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center transition-all hover:bg-warning'>
                                        <IconStarFilled className='w-full h-full' />
                                    </button>
                                </li>
                                <li>
                                    <button className='w-[30px] h-[30px] min-w-[30px] rounded-full bg-amber-400 p-2 flex items-center justify-center group transition-all hover:bg-warning'>
                                        <IconStar className='w-full h-full transition-all group-hover:fill-font-color' />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color md:p-6 p-4'>
                            <label className="form-label mb-5 inline-block">Search</label>
                            <div className='form-control flex w-full'>
                                <input
                                    type="text"
                                    id="team_board_search"
                                    className="form-input !rounded-r-none !py-[6px]"
                                    placeholder="Search..."
                                />
                                <button className="btn border border-border-color !rounded-l-none" type="button">
                                    <IconSearch className='w-[20px] h-[20px]' />
                                </button>
                            </div>
                        </div>
                        <div className='card bg-card-color md:p-6 p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color'>
                            <Image src={modal_joblisting} alt='modal popup' className='mb-6' />
                            <h5 className='text-[20px]/[24px] font-medium mb-2 text-center'>
                                Job listing
                            </h5>
                            <p className="text-font-color-100 mb-4 text-center">
                                Click on the below buttons to launch a Job listing example.
                            </p>
                            <button onClick={openJobListingModal} className="btn btn-primary uppercase">
                                View in modals
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color overflow-hidden'>
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
                            <ReactApexChart options={chartData2.options} series={chartData2.series} type="line" height={50} width="100%" />
                        </div>
                        <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                            <div className='flex items-center justify-between gap-2 flex-wrap mb-6'>
                                <p className='font-semibold'>
                                    Connection Request
                                </p>
                                <span className='inline-block py-1 px-2 rounded-md bg-primary text-white text-[12px]/[1] font-bold'>
                                    20 min ago
                                </span>
                            </div>
                            <div className='flex gap-4 mb-6'>
                                <Image src={profile_av} alt='profile' width="56" height="56" className='w-[56px] h-[56px] min-w-[56px] object-cover rounded-md' />
                                <div>
                                    <p className='text-[20px]/[24px] font-medium mb-1'>
                                        Hossein Shams
                                    </p>
                                    <p className='text-font-color-100'>
                                        21 mutual connections
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-2 items-stretch'>
                                <button className='btn btn-success w-full'>
                                    <IconCheck className='w-[18px] h-[18px] stroke-[3]' />
                                    Accept
                                </button>
                                <button className='btn btn-danger w-full'>
                                    <IconX className='w-[18px] h-[18px] stroke-[3]' />
                                    Ignore
                                </button>
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
                            <div className='md:p-6 p-4 border-b border-dashed border-border-color'>
                                <h5 className='text-[20px]/[26px] font-medium mb-1'>
                                    <Link href="/app/project/details" className='transition-all hover:text-secondary'>
                                        School / University
                                    </Link>
                                </h5>
                                <p className='text-font-color-100 mb-6'>
                                    CRM App application to University Admin..
                                </p>
                                <ul className='flex gap-6 flex-wrap mb-6'>
                                    <li>
                                        <h6>
                                            7
                                        </h6>
                                        <small className='text-font-color-100 uppercase'>
                                            Issues
                                        </small>
                                    </li>
                                    <li>
                                        <h6>
                                            4
                                        </h6>
                                        <small className='text-font-color-100 uppercase'>
                                            Resolved
                                        </small>
                                    </li>
                                    <li>
                                        <h6>
                                            3
                                        </h6>
                                        <small className='text-font-color-100 uppercase'>
                                            Comments
                                        </small>
                                    </li>
                                </ul>
                                <div className='flex items-center flex-wrap gap-1 mb-4'>
                                    <label className='me-1'>
                                        Team :
                                    </label>
                                    <Image src={avatar1} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    <Image src={avatar2} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    <Image src={avatar3} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                    <Image src={avatar4} alt='user' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                                </div>
                                <div className='flex items-center justify-between gap-2 small'>
                                    95%
                                    <span>
                                        Done
                                    </span>
                                </div>
                                <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full mt-2'>
                                    <div className='progress-bar w-[95%] bg-success h-full'></div>
                                </div>
                            </div>
                            <div className='md:p-6 p-4 flex gap-x-3 gap-y-1 flex-wrap'>
                                <div className='flex gap-1 flex-wrap'>
                                    <span className='min-w-fit'>
                                        Due date :
                                    </span>
                                    <strong className='min-w-fit'>
                                        21 Aug, 2022
                                    </strong>
                                </div>
                                <span className='inline-block'>|</span>
                                <div className='flex gap-1 flex-wrap'>
                                    <span className='min-w-fit'>
                                        Budget :
                                    </span>
                                    <strong className='min-w-fit'>
                                        $12,050
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                            <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                                <p className='font-semibold'>
                                    Labels
                                </p>
                                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                    <IconDots className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                    Family
                                </button>
                                <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-primary transition-all hover:text-secondary hover:border-secondary'>
                                    Home
                                </button>
                                <button className='rounded-md text-white py-1 px-4 text-[14px]/[20px] border border-primary bg-primary'>
                                    UI/UX Designer
                                </button>
                                <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                    ReactJS
                                </button>
                                <button className='rounded-md text-primary py-1 px-4 text-[14px]/[20px] border border-border-color transition-all hover:text-secondary'>
                                    Angular
                                </button>
                            </div>
                        </div>
                        <div className='card overflow-hidden bg-card-color rounded-xl relative border border-dashed border-border-color'>
                            <Image src={gallery1} alt='people bg' width="315" height="120" className='w-full h-[120px] object-cover' />
                            <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                            <div className='px-6 pb-6 pt-12 text-center relative'>
                                <Image src={avatar1} alt='user' width="120" height="120" className='absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] w-[120px] h-[120px] min-w-[120px] object-cover rounded-full p-1 bg-card-color shadow-shadow-lg' />
                                <p className='font-medium mt-6'>
                                    Comeren Diaz
                                </p>
                                <p className='text-font-color-100'>
                                    example@info.com
                                </p>
                                <ul className='flex items-stretch justify-center'>
                                    <li className='flex'>
                                        <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                            <IconBrandFacebook />
                                        </Link>
                                    </li>
                                    <li className='flex'>
                                        <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                            <IconBrandLinkedin />
                                        </Link>
                                    </li>
                                    <li className='flex'>
                                        <Link href="#" className='p-2 m-2 inline-block text-primary transition-all hover:text-secondary'>
                                            <IconBrandTwitter />
                                        </Link>
                                    </li>
                                </ul>
                                <div className='flex items-stretch gap-1 justify-center'>
                                    <button className='btn btn-outline-secondary'>
                                        Follow
                                    </button>
                                    <button className='btn btn-outline-secondary'>
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color md:p-6 p-4 flex md:gap-4 gap-2 items-center'>
                            <div className='sm:w-[56px] sm:h-[56px] sm:min-w-[56px] w-[40px] h-[40px] min-w-[40px] text-secondary flex items-center justify-center'>
                                <IconArchiveFilled />
                            </div>
                            <div>
                                <p className='text-font-color-100'>
                                    Total Projects
                                </p>
                                <h5 className='text-[20px]/[24px] font-medium'>
                                    24
                                </h5>
                            </div>
                        </div>
                        <div className='card bg-card-color rounded-xl border border-dashed border-border-color overflow-hidden md:mb-8 mb-6'>
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
                    </div>
                </div>
                {jobListingModal &&
                    <>
                        <div className={`fixed p-15 w-full max-w-[500px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]`}>
                            <div className='bg-card-color rounded-lg shadow-shadow-lg overflow-hidden'>
                                <div className='p-4 flex gap-5 justify-between border-b border-border-color'>
                                    <p className='text-[20px]/[26px] font-medium'>
                                        Job listing
                                    </p>
                                    <button onClick={openJobListingModal} className=''>
                                        <IconX />
                                    </button>
                                </div>
                                <div className='py-10 md:px-10 px-[7px] bg-body-color'>
                                    <div className='my-10 lg:px-20 md:px-10 px-[7px] md:max-h-[80svh] max-h-[60svh] overflow-auto custom-scrollbar'>
                                        <p className="text-font-color-100 mb-4">If you are going to use a passage of Lorem Ipsum, you need</p>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4 mb-2'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-primary">Creative &amp; Art</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">User Experience Designer Employee</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4 mb-2'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-secondary">UI/UX</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">User Experience Designer Employee</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                        <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                                            <span className="small rounded-full text-white py-1 px-4 bg-chart-color3">Finance & Accounting</span>
                                            <h5 className="mt-6 text-[20px]/[24px] font-medium text-primary transition-all hover:text-secondary"><Link href="#">Foreign Language Research Analyst</Link></h5>
                                            <ul className="flex flex-wrap gap-x-6 gap-y-1 my-4">
                                                <li className='flex items-center gap-2'><IconMapPin className='w-[18px] h-[18px] min-w-[18px]' /> New York, USA</li>
                                                <li className='flex items-center gap-2'><IconClockHour9 className='w-[18px] h-[18px] min-w-[18px]' /> Full Time</li>
                                            </ul>
                                            <div className="flex items-center justify-between">
                                                <p>Globe Solution Ltd.</p>
                                                <span>2h ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={openJobListingModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
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
                        <div onClick={openCampaignsModal} className={`contents-[] fixed z-[5] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px]`}></div>
                    </>
                }
            </div>
        </div>
    )
}
