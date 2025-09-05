import React from 'react';
import {
  IconTruck,
  IconPackage,
  IconShoppingCart,
  IconRefresh,
} from '@tabler/icons-react';

const OverviewDashboard = () => {
  return (
    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <h1 className="text-[32px]/[38px] font-semibold mb-6">Overview Dashboard</h1>
        
        {/* Overview Cards - using exact Luno card structure */}
        <div className='grid grid-cols-12 gap-4 mb-6'>
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-5 mb-2'>
                <p className="text-sm font-medium opacity-90">
                  RECEIVED TODAY
                </p>
                <IconTruck className='stroke-white stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='mb-4'>
                <span className='inline-block text-[28px]/[34px] font-bold mb-1'>
                  172 Orders
                </span>
                <div className="space-y-1">
                  <p className="text-sm opacity-90">198 Lines</p>
                  <p className="text-sm opacity-90">209 Units</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-5 mb-2'>
                <p className="text-sm font-medium opacity-90">
                  BACK ORDERS
                </p>
                <IconPackage className='stroke-white stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='mb-4'>
                <span className='inline-block text-[28px]/[34px] font-bold mb-1'>
                  4 Orders
                </span>
                <div className="space-y-1">
                  <p className="text-sm opacity-90">4 Lines</p>
                  <p className="text-sm opacity-90">15 Units</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-5 mb-2'>
                <p className="text-sm font-medium opacity-90">
                  SHIPPED TODAY
                </p>
                <IconShoppingCart className='stroke-white stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='mb-4'>
                <span className='inline-block text-[28px]/[34px] font-bold mb-1'>
                  201 Orders
                </span>
                <div className="space-y-1">
                  <p className="text-sm opacity-90">259 Lines</p>
                  <p className="text-sm opacity-90">267 Units</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className='lg:col-span-3 sm:col-span-6 col-span-12 card flex flex-col bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl overflow-hidden border border-dashed border-border-color'>
            <div className='md:p-6 p-4'>
              <div className='flex items-center justify-between gap-5 mb-2'>
                <p className="text-sm font-medium opacity-90">
                  RMA UNITS TODAY
                </p>
                <IconRefresh className='stroke-white stroke-[1.5] w-[32px] h-[32px]' />
              </div>
              <div className='mb-4'>
                <span className='inline-block text-[28px]/[34px] font-bold mb-1'>
                  0 Authorized
                </span>
                <div className="space-y-1">
                  <p className="text-sm opacity-90">0 Received</p>
                  <p className="text-sm opacity-90">0 Total Open</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Table - using exact Luno card and table structure */}
        <div className='card bg-card-color rounded-xl border border-dashed border-border-color mb-6'>
          <div className='flex items-center justify-between gap-15 md:p-6 p-4 border-b border-dashed border-border-color'>
            <div className='font-semibold flex items-center gap-2'>
              <i className="fa fa-bar-chart text-primary"></i>
              FULFILLMENT
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[14px]/[20px] text-font-color-100">ON</span>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-check-input" />
                <span className="text-[14px]/[20px] text-font-color-100">Hide zero qty</span>
              </label>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className='w-full min-w-[1200px]'>
              <thead className='bg-primary-5 border-b border-border-color'>
                <tr className='text-left text-font-color text-[12px]/[18px] font-bold uppercase'>
                  <th className='py-3 px-4'>ACCOUNT #</th>
                  <th className='py-3 px-4'>GROUP</th>
                  <th className='py-3 px-4'>WAREHOUSE</th>
                  <th className='py-3 px-4'>ORDERS TODAY</th>
                  <th className='py-3 px-4'>BACK ORDERS</th>
                  <th className='py-3 px-4'>HOLD</th>
                  <th className='py-3 px-4'>IN PROCESS</th>
                  <th className='py-3 px-4'>TOTAL OPEN</th>
                  <th className='py-3 px-4'>TOTAL OPEN UNITS</th>
                  <th className='py-3 px-4'>SHIPPED TODAY</th>
                  <th className='py-3 px-4'>SHIPPED TODAY UNITS</th>
                  <th className='py-3 px-4'>OTHERS</th>
                  <th className='py-3 px-4'>OTHERS UNITS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed border-border-color">
                  <td className='py-3 px-4 text-[14px]/[20px]'>21480</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>B2C</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>LA</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>50</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>1</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>22</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>23</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>31</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>51</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>70</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                </tr>
                <tr className="border-b border-dashed border-border-color">
                  <td className='py-3 px-4 text-[14px]/[20px]'>21480</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>B2C</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>LN</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>122</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>2</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>57</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>59</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>73</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>150</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>197</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                </tr>
                <tr className="border-b border-dashed border-border-color">
                  <td className='py-3 px-4 text-[14px]/[20px]'>21481</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>B2B</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>LN</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>1</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>1</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>14</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'>0</td>
                </tr>
                <tr className="bg-primary-5 font-semibold">
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>TOTALS</td>
                  <td className='py-3 px-4 text-[14px]/[20px]'></td>
                  <td className='py-3 px-4 text-[14px]/[20px]'></td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>172</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>4</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>79</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>83</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>118</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>201</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>267</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>0</td>
                  <td className='py-3 px-4 text-[14px]/[20px] font-bold'>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 30 Days Activity Chart - using exact Luno card structure */}
        <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
          <div className='flex items-center justify-between gap-15 md:p-6 p-4 border-b border-dashed border-border-color'>
            <div className='font-semibold flex items-center gap-2'>
              <i className="fa fa-bar-chart text-primary"></i>
              30 DAYS ACTIVITY
            </div>
          </div>
          <div className="md:p-6 p-4">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-chart-color1 rounded"></div>
                <span className="text-[14px]/[20px] text-font-color-100">Received 6,843</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-chart-color2 rounded"></div>
                <span className="text-[14px]/[20px] text-font-color-100">Shipped 6,918</span>
              </div>
            </div>
            <div className="h-64 bg-body-color rounded-xl flex items-center justify-center border border-dashed border-border-color">
              <p className="text-font-color-100 text-[16px]/[24px]">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;