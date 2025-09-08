import React, { useState, useRef, useEffect } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
  IconBriefcase,
  IconCash,
  IconCornerRightUp,
  IconCreditCard,
  IconDots,
  IconFileCode,
  IconFileTypePdf,
  IconFileZip,
  IconUserScan,
} from '@tabler/icons-react'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import Link from 'next/link'

interface BreadcrumbItem {
  name: string;
}

interface ChartData {
  series: Array<{
    name: string;
    data: number[];
  }>;
  options: any;
}

export default function Analysis() {

  const [adminMenu, setAdminMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const breadcrumbItem: BreadcrumbItem[] = [
    {
      name: "Dashboard",
    },
  ]

  const chartData1: ChartData = {
    series: [
      {
        name: 'Income',
        data: [20, 10, 50, 30, 40, 30, 50, 60, 5, 20, 30, 20]
      },
      {
        name: 'Expense',
        data: [40, 20, 30, 50, 20, 20, 20, 5, 15, 40, 40, 50]
      },
      {
        name: 'Revenue',
        data: [40, 50, 10, 20, 20, 50, 10, 20, 60, 5, 20, 30]
      },
    ],
    options: {
      dataLabels: {
        enabled: false
      },
      colors: ['var(--chart-color1)', 'var(--chart-color2)', 'var(--chart-color3)',],
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        x: {
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
        tickAmount: 10,
      },
    },
  };

  const chartData2: ChartData = {
    series: [
      { name: 'Series 1', data: [55] },
      { name: 'Series 2', data: [35] },
      { name: 'Series 3', data: [10] }
    ],
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef?.current?.contains(event.target as Node) &&
        !buttonRef?.current?.contains(event.target as Node)
      ) {
        setAdminMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleAdminMenu = (): void => {
    setAdminMenu(!adminMenu)
  }

  return (

    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader report />
        <div className='grid grid-cols-12 gap-4'>
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-1.5 mb-2'>
                <p>
                  NEW EMPLOYEE
                </p>
                <IconUserScan className='stroke-primary stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='flex items-end gap-1 mb-1'>
                <span className='inline-block text-[24px]/[30px] font-medium'>
                  51
                </span>
                <IconCornerRightUp className='stroke-font-color-100 w-[18px] h-[18px]' />
                <span className='text-font-color-100 text-[14px]/[20px]'>
                  13%
                </span>
              </div>
              <div className='text-font-color-100 text-[14px]/[20px]'>
                Analytics for last week
              </div>
            </div>
            <div className='progress mt-auto overflow-hidden h-[4px] bg-border-color rounded-full'>
              <div className='progress-bar w-[85%] bg-secondary h-full'></div>
            </div>
          </div>
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-1.5 mb-2'>
                <p>
                  EXPENSE
                </p>
                <IconCreditCard className='stroke-primary stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='flex items-end gap-1 mb-1'>
                <span className='inline-block text-[24px]/[30px] font-medium'>
                  $3,251
                </span>
                <IconCornerRightUp className='stroke-font-color-100 w-[18px] h-[18px]' />
                <span className='text-font-color-100 text-[14px]/[20px]'>
                  13%
                </span>
              </div>
              <div className='text-font-color-100 text-[14px]/[20px]'>
                Analytics for last week
              </div>
            </div>
            <div className='progress mt-auto overflow-hidden h-[4px] bg-border-color rounded-full'>
              <div className='progress-bar w-[13%] bg-danger h-full'></div>
            </div>
          </div>
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-1.5 mb-2'>
                <p>
                  REVENUE
                </p>
                <IconCash className='stroke-primary stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='flex items-end gap-1 mb-1'>
                <span className='inline-block text-[24px]/[30px] font-medium'>
                  $18,925
                </span>
                <IconCornerRightUp className='stroke-font-color-100 w-[18px] h-[18px]' />
                <span className='text-font-color-100 text-[14px]/[20px]'>
                  78%
                </span>
              </div>
              <div className='text-font-color-100 text-[14px]/[20px]'>
                Analytics for last week
              </div>
            </div>
            <div className='progress mt-auto overflow-hidden h-[4px] bg-border-color rounded-full'>
              <div className='progress-bar w-[70%] bg-success h-full'></div>
            </div>
          </div>
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-1.5 mb-2'>
                <p>
                  NEW LEADS
                </p>
                <IconBriefcase className='stroke-primary stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='flex items-end gap-1 mb-1'>
                <span className='inline-block text-[24px]/[30px] font-medium'>
                  125
                </span>
                <IconCornerRightUp className='stroke-font-color-100 w-[18px] h-[18px]' />
                <span className='text-font-color-100 text-[14px]/[20px]'>
                  55%
                </span>
              </div>
              <div className='text-font-color-100 text-[14px]/[20px]'>
                Analytics for last week
              </div>
            </div>
            <div className='progress mt-auto overflow-hidden h-[4px] bg-border-color rounded-full'>
              <div className='progress-bar w-[55%] bg-warning h-full'></div>
            </div>
          </div>
          <div className='xxl:col-span-3 lg:col-span-4 col-span-12 card flex flex-col items-center justify-center text-white text-center md:p-6 p-4 bg-gradient-to-br from-primary to-secondary rounded-xl border border-dashed border-border-color'>
            <h4 className='text-[24px]/[28px] font-medium mb-2'>Welcome Back, Chris!!</h4>
            <p className='mb-8'>
              <strong>Need help?</strong> Check out the documentation of Luno Admin. It includes tons of <strong>Widgets</strong>, <strong>Components</strong>, and <strong>Elements</strong> with easy-to-follow documentation.
            </p>
            <Link href="/documentation" className='btn btn-white large'>Visit Documentation</Link>
          </div>
          <div className='xxl:col-span-6 lg:col-span-8 col-span-12 card rounded-xl bg-card-color border border-dashed border-border-color'>
            <div className='flex items-center justify-between gap-4 md:p-6 p-4'>
              <div className='font-semibold'>
                LUNO Revenue
              </div>
              <div className='relative'>
                <button onClick={toggleAdminMenu} className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                  <IconDots className='w-[18px] h-[18px]' />
                </button>
                <ul ref={menuRef} className={`bg-card-color text-font-color z-[1] rounded-xl w-[180px] shadow-shadow-lg absolute end-0 top-full origin-top-right transition-all duration-300 ${adminMenu ? ' opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      File Info
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      Copy to
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      Move to
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      Rename
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      Block
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                      Delete
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <ReactApexChart options={chartData1.options} series={chartData1.series} type="bar" height="280" className="md:px-6" />
          </div>
          <div className='xxl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
            <div className='font-semibold md:mb-6 mb-4'>
              Sales by Category
            </div>
            <ReactApexChart options={chartData2.options} series={chartData2.series} type="donut" height="300" className="max-w-[300px] mx-auto" />
          </div>
          <div className='xxl:col-span-3 lg:col-span-4 sm:col-span-6 col-span-12 card bg-card-color rounded-xl border border-dashed border-border-color'>
            <div className='border-b border-dashed border-border-color md:p-6 p-4'>
              <div className='font-semibold md:mb-6 mb-4'>
                My Wallet
              </div>
              <p className='md:text-[24px]/[30px] text-[20px]/[26px] font-medium md:mb-2'>
                0.0386245 BTC
              </p>
              <p>
                Available BTC <Link href="#" className='text-primary transition-all hover:text-secondary'>View Account</Link>
              </p>
              <div className='mt-6'>
                <span className='uppercase text-[14px]/[20px] text-font-color-100'>
                  BUY THIS MONTH
                </span>
                <p className='md:text-[20px]/[26px] font-medium'>
                  3.0675432 BTC
                </p>
              </div>
              <div className='mt-6'>
                <span className='uppercase text-[14px]/[20px] text-font-color-100'>
                  SELL THIS MONTH
                </span>
                <p className='md:text-[20px]/[26px] font-medium'>
                  2.0345618 BTC
                </p>
              </div>
            </div>
            <div className='md:px-6 px-4 py-4 flex gap-2.5'>
              <button className='btn btn-secondary w-full'>
                Buy
              </button>
              <button className='btn btn-outline-secondary w-full'>
                Sell
              </button>
            </div>
          </div>
          <div className='xxl:col-span-3 lg:col-span-4 sm:col-span-6 col-span-12 card md:p-6 p-4 bg-card-color rounded-xl border border-dashed border-border-color'>
            <div className='flex items-center justify-between gap-4 md:mb-6 mb-4'>
              <div className='font-semibold'>
                Downloads
              </div>
              <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                <IconDots className='w-[18px] h-[18px]' />
              </button>
            </div>
            <ul>
              <li className='flex gap-4 py-3'>
                <div className='w-[36px] h-[36px] min-w-[36px] flex items-center justify-center bg-primary-10 text-primary rounded-md'>
                  <IconFileZip />
                </div>
                <div className='flex-1'>
                  <span className='inline-block mb-2'>LUNO_admin.zip</span>
                  <div className="progress overflow-hidden h-[5px] bg-border-color rounded-full">
                    <div className="progress-bar w-[44%] bg-primary h-full"></div>
                  </div>
                </div>
              </li>
              <li className='flex gap-4 py-3'>
                <div className='w-[36px] h-[36px] min-w-[36px] flex items-center justify-center bg-primary-10 text-primary rounded-md'>
                  <IconFileTypePdf />
                </div>
                <div className='flex-1'>
                  <span className='inline-block mb-2'>reposrt_2020.pdf</span>
                  <div className="progress overflow-hidden h-[5px] bg-border-color rounded-full">
                    <div className="progress-bar w-[75%] bg-primary h-full"></div>
                  </div>
                </div>
              </li>
              <li className='flex gap-4 py-3'>
                <div className='w-[36px] h-[36px] min-w-[36px] flex items-center justify-center bg-primary-10 text-primary rounded-md'>
                  <IconFileCode />
                </div>
                <div className='flex-1'>
                  <span className='inline-block mb-2'>package.json</span>
                  <div className="progress overflow-hidden h-[5px] bg-border-color rounded-full">
                    <div className="progress-bar w-[10%] bg-primary h-full"></div>
                  </div>
                </div>
              </li>
              <li className='flex gap-4 py-3'>
                <div className='w-[36px] h-[36px] min-w-[36px] flex items-center justify-center bg-primary-10 text-primary rounded-md'>
                  <IconFileCode />
                </div>
                <div className='flex-1'>
                  <span className='inline-block mb-2'>bootstrap.min.css</span>
                  <div className="progress overflow-hidden h-[5px] bg-border-color rounded-full">
                    <div className="progress-bar w-[89%] bg-primary h-full"></div>
                  </div>
                </div>
              </li>
            </ul>
            <small className='text-font-color-100 mt-3 inline-block'>Showing 4 out of 24 downloads.</small>
          </div>
          <div className='xxl:col-span-6 lg:col-span-12 md:col-span-6 col-span-12 card rounded-xl bg-card-color flex flex-col border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-4 md:mb-6 mb-4'>
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
        </div>
      </div>
    </div>
  )
}
