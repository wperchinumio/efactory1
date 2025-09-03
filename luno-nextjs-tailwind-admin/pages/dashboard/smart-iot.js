import React from 'react'
import Breadcrumb from '../../components/common/Breadcrumb'
import WelcomeHeader from '../../components/common/WelcomeHeader'
import {
  IconAirConditioning,
  IconBattery3,
  IconDevices,
  IconFridge,
  IconInfoSquare,
  IconProgressAlert,
  IconWashMachine,
} from '@tabler/icons-react'
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }); import Link from 'next/link'

export default function SmartIot() {

  const generateHeatmapData = (count, { min, max }) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: `Category ${i + 1}`,
        y: Math.floor(Math.random() * (max - min + 1)) + min
      });
    }
    return data;
  };

  const breadcrumbItem = [
    {
      name: "Dashboard",
    },
    {
      name: "IOT",
    },
  ]

  const chartData1 = {
    series: [{
      name: 'Kitchen',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Apple Tv',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Sound Sys.',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Air Cond.',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Fridge',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Wash Machine',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Bath Room',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Garden',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }, {
      name: 'Store Room',
      data: generateHeatmapData(8, {
        min: 0,
        max: 90
      })
    }],
    options: {
      dataLabels: {
        enabled: false
      },
      colors: ["#ffc122"],
      chart: {
        toolbar: {
          show: false,
        },
      },
      grid: {
        borderColor: 'var(--border-color)',
      },
      stroke: {
        colors: ['var(--body-color)'],
      },
      xaxis: {
        categories: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
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
    }
  };

  return (
    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader report />
        <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mb-4'>
          <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
            <IconDevices />
            <p className='mb-4'>
              Total Devices
            </p>
            <span className='inline-block text-[24px]/[30px] font-medium'>
              17
            </span>
          </div>
          <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
            <IconInfoSquare />
            <p className='mb-4'>
              Problem devices
            </p>
            <span className='inline-block text-[24px]/[30px] font-medium'>
              07
            </span>
          </div>
          <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
            <IconProgressAlert />
            <p className='mb-4'>
              24x7 Check problems
            </p>
            <span className='inline-block text-[24px]/[30px] font-medium'>
              03
            </span>
          </div>
          <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
            <IconBattery3 />
            <p className='mb-8'>
              Power Backup
            </p>
            <div className='progress overflow-hidden h-[3px] bg-border-color rounded-full'>
              <div className='progress-bar w-[55%] bg-primary h-full'></div>
            </div>
          </div>
        </div>
        <div className='grid xxl:grid-cols-4 grid-cols-1 gap-4'>
          <div className='grid xxl:grid-cols-3 grid-cols-1 gap-4 xxl:col-span-3'>
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
            <div className='card md:p-6 p-4 rounded-xl border border-dashed border-info text-info bg-cyan-50'>
              <IconFridge />
              <div className='mt-4'>
                <p className='mb-2 font-medium'>
                  Refrigerator
                </p>
                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                  <span className='inline-block'>
                    Temprature :
                  </span>
                  <span className='inline-block font-semibold'>
                    10° C
                  </span>
                </div>
                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                  <span className='inline-block'>
                    Status :
                  </span>
                  <span className='inline-block font-semibold'>
                    Stand By
                  </span>
                </div>
              </div>
            </div>
            <div className='card md:p-6 p-4 rounded-xl border border-dashed border-grey text-grey bg-slate-100'>
              <IconWashMachine />
              <div className='mt-4'>
                <p className='mb-2 font-medium'>
                  Washing Machine
                </p>
                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                  <span className='inline-block'>
                    Remaining Time :
                  </span>
                  <span className='inline-block font-semibold'>
                    01:23
                  </span>
                </div>
                <div className='flex items-center justify-between gap-15 text-[14px]/[20px]'>
                  <span className='inline-block'>
                    Status :
                  </span>
                  <span className='inline-block font-semibold'>
                    On
                  </span>
                </div>
              </div>
            </div>
            <div className='card rounded-xl bg-card-color xxl:col-span-3 border border-dashed border-border-color'>
              <div className='flex items-center justify-between flex-wrap gap-15 md:p-6 p-4'>
                <div className='font-semibold'>
                  Uses of Energy
                </div>
                <div className='flex gap-6'>
                  <div>
                    <p className='font-semibold'>
                      356
                    </p>
                    <p className='text-font-color-100 text-[14px]/[20px]'>
                      Day Uses
                    </p>
                  </div>
                  <div>
                    <p className='font-semibold'>
                      198
                    </p>
                    <p className='text-font-color-100 text-[14px]/[20px]'>
                      Night Uses
                    </p>
                  </div>
                </div>
              </div>
              <ReactApexChart options={chartData1.options} series={chartData1.series} type="heatmap" height="320" className="md:px-6" />
            </div>
          </div>
          <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
            <p className='text-[20px]/[26px] font-medium mb-6'>
              Quick Access
            </p>
            <div className='flex xxl:flex-col md:flex-row flex-col xxl:gap-6 md:gap-100 gap-6'>
              <div>
                <p className='uppercase font-bold text-[14px]/[20px]'>
                  LIGHTS INDOOR
                </p>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightIndoor1"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightIndoor1">Kitchen</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightIndoor2"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightIndoor2">Dining Room</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightIndoor3"
                    className="form-check-input"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightIndoor3">Living Room</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightIndoor4"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightIndoor4">Bed Room</label>
                </div>
              </div>
              <div>
                <p className='uppercase font-bold text-[14px]/[20px]'>
                  LIGHTS OUTDOOR
                </p>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOutdoor1"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightOutdoor1">Front Door</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOutdoor2"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightOutdoor2">Back Door</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOutdoor3"
                    className="form-check-input"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightOutdoor3">Pool</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOutdoor4"
                    className="form-check-input"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightOutdoor4">Garage</label>
                </div>
              </div>
              <div>
                <p className='uppercase font-bold text-[14px]/[20px]'>
                  OTHER APPLIENCES
                </p>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther1"
                    className="form-check-input"
                    disabled
                  />
                  <label className="form-check-label text-primary" htmlFor="lightOther1">Apple Tv</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther2"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightOther2">Sound System</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther3"
                    className="form-check-input"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightOther3">Air Conditioner</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther4"
                    className="form-check-input"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightOther4">Fridge</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther5"
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="lightOther5">Laptop</label>
                </div>
                <div className="form-check form-switch mt-2">
                  <input
                    type="checkbox"
                    id="lightOther6"
                    className="form-check-input"
                    disabled
                  />
                  <label className="form-check-label text-primary" htmlFor="lightOther6">Smart Fan</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
