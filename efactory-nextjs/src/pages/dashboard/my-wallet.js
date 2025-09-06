import React from 'react'
import Breadcrumb from '../../components/common/Breadcrumb'
import WelcomeHeader from '../../components/common/WelcomeHeader'
import {
  IconBasket,
  IconBrandMastercard,
  IconBrandPaypal,
  IconBuildingBank,
  IconCashBanknote,
  IconCornerRightDown,
  IconCreditCard,
  IconCurrencyDollar,
  IconDots,
} from '@tabler/icons-react'
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }); import Link from 'next/link'

export default function MyWallet() {

  const breadcrumbItem = [
    {
      name: "Dashboard",
    },
    {
      name: "My Wallet",
    },
  ]

  const chartData1 = {
    series: [{
      name: 'Saving',
      data: [13, 22, 28, 20, 13, 18, 29, 15, 24, 31, 9, 27,],
    },
    {
      name: 'Expense',
      data: [33, 42, 25, 20, 30, 38, 29, 47, 44, 56, 18, 47,],
    },
    {
      name: 'Income',
      data: [45, 52, 38, 24, 33, 26, 44, 55, 45, 48, 35, 61,],
    }],
    options: {
      colors: ['var(--success)', 'var(--danger)', 'var(--primary)'],
      stroke: {
        width: 2,
        curve: 'monotoneCubic',
        dashArray: [0, 8, 0]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        colors: ['var(--success)', 'var(--danger)', 'var(--primary)'],
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
        max: 70,
        tickAmount: 7,
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

  return (
    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader report />
        <div className='grid xxl:grid-cols-[7fr_5fr] grid-cols-1 gap-4 items-start'>
          <div className='grid md:grid-cols-4 ssm:grid-cols-2 grid-cols-1 gap-4'>
            <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
              <div className='md:mb-6 mb-4 md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] rounded-md flex items-center justify-center text-white bg-primary'>
                <IconCurrencyDollar />
              </div>
              <div className="mb-1 text-[24px]/[30px] font-medium">$8.5k</div>
              <span className="text-font-color-100">Income</span>
            </div>
            <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
              <div className='md:mb-6 mb-4 md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] rounded-md flex items-center justify-center text-white bg-danger'>
                <IconCreditCard />
              </div>
              <div className="mb-1 text-[24px]/[30px] font-medium">$3.5k</div>
              <span className="text-font-color-100">Expense</span>
            </div>
            <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
              <div className='md:mb-6 mb-4 md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] rounded-md flex items-center justify-center text-white bg-sky'>
                <IconCornerRightDown />
              </div>
              <div className="mb-1 text-[24px]/[30px] font-medium">$2.5k</div>
              <span className="text-font-color-100">Upcoming</span>
            </div>
            <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
              <div className='md:mb-6 mb-4 md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] rounded-md flex items-center justify-center text-white bg-success'>
                <IconBuildingBank />
              </div>
              <div className="mb-1 text-[24px]/[30px] font-medium">$41.8k</div>
              <span className="text-font-color-100">Savings</span>
            </div>
            <div className='card bg-card-color rounded-xl md:col-span-4 ssm:col-span-2 border border-dashed border-border-color'>
              <div className='flex items-center justify-between gap-15 md:p-6 p-4'>
                <div>
                  <div className='font-semibold'>
                    LUNO Revenue
                  </div>
                  <div className='text-font-color-100 text-[14px]/[20px]'>
                    Your data last update 1 hours ago.
                  </div>
                </div>
                <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                  <IconDots className='w-[18px] h-[18px]' />
                </button>
              </div>
              <ReactApexChart options={chartData1.options} series={chartData1.series} type="line" height="300" className="md:px-6" />
            </div>
          </div>
          <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='flex gap-15 justify-between md:p-6 p-4'>
              <div className="font-semibold">Transactions</div>
              <Link href="#" className='text-primary transition-all hover:text-secondary'>View All</Link>
            </div>
            <ul className='flex flex-col'>
              <li className='p-4 border-b border-dashed border-border-color flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconBasket />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      G&F Supershop
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 2:00 pm
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Shopping
                    </div>
                    <div className='text-danger font-bold md:min-w-[100px]'>
                      -$74
                    </div>
                  </div>
                </div>
              </li>
              <li className='p-4 border-b border-dashed border-border-color flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconCashBanknote />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      Bank Transfer
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 6:00 pm
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Mutual fund SIP
                    </div>
                    <div className='text-success font-bold md:min-w-[100px]'>
                      $200
                    </div>
                  </div>
                </div>
              </li>
              <li className='p-4 border-b border-dashed border-border-color flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconBrandMastercard />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      Mastercard
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 6:00 pm
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Shopping
                    </div>
                    <div className='text-danger font-bold md:min-w-[100px]'>
                      -$50
                    </div>
                  </div>
                </div>
              </li>
              <li className='p-4 border-b border-dashed border-border-color flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconBrandPaypal />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      Paypal
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 10:30 pm
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Freelancer payment
                    </div>
                    <div className='text-success font-bold md:min-w-[100px]'>
                      $750.50
                    </div>
                  </div>
                </div>
              </li>
              <li className='p-4 border-b border-dashed border-border-color flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconBrandMastercard />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      Mastercard
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 6:00 pm
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Life insurance
                    </div>
                    <div className='text-danger font-bold md:min-w-[100px]'>
                      -$110
                    </div>
                  </div>
                </div>
              </li>
              <li className='p-4 flex gap-4 transition-all hover:bg-primary-10'>
                <div className='md:w-[56px] md:h-[56px] md:min-w-[56px] w-[46px] h-[46px] min-w-[46px] flex items-center justify-center rounded-md bg-body-color text-secondary'>
                  <IconCashBanknote />
                </div>
                <div className='flex justify-between flex-1 gap-10 md:flex-row flex-col'>
                  <div>
                    <p className='font-medium'>
                      Bank Transfer
                    </p>
                    <span className='text-[14px]/[20px] text-font-color-100'>
                      April 06,2022 at 11:00 am
                    </span>
                  </div>
                  <div className='flex gap-8 md:justify-normal justify-between'>
                    <div>
                      Hobby & Life
                    </div>
                    <div className='text-success font-bold md:min-w-[100px]'>
                      $1074
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
