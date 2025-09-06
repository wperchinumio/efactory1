import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
  IconDiamondFilled,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function References() {

  const breadcrumbItem = [
    {
      link: "Documentation",
      url: "/documentation",
    },
    {
      name: "References",
    },
  ]

  return (
    <>
      <div className='md:px-6 sm:px-3 pt-4'>
        <div className='container-fluid'>
          <Breadcrumb breadcrumbItem={breadcrumbItem} />
          <div className='card bg-card-color rounded-xl md:p-6 p-4'>
            <div className='flex items-center gap-10 mb-30'>
              <IconDiamondFilled />
              <p className='text-[20px]/[24px] font-medium'>
                References
              </p>
            </div>
            <div className='overflow-auto'>
              <table className='w-full min-w-[374px] table-striped text-[16px]/[24px]'>
                <tbody>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Google font
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://fonts.google.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://fonts.google.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      NextJS
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://reactjs.org/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://nextjs.org/docs
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Tailwind CSS
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://tailwindcss.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://tailwindcss.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      NPM
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://www.npmjs.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://www.npmjs.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Swiper
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://swiperjs.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://swiperjs.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Apex Charts
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://apexcharts.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://apexcharts.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Tabler Icons
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://tabler.io/icons" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://tabler.io/icons
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      Pexels
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://www.pexels.com/" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://www.pexels.com/
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td width={200} className='p-3 border-t border-border'>
                      React Data Table
                    </td>
                    <td className='p-3 border-t border-border'>
                      <Link href="https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs" target='_blank' className='text-blue transition-all duration-300 hover:text-primary'>
                        https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
