import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
    IconLayout,
    IconPalette,
} from '@tabler/icons-react'

export default function HelperClass() {

    const breadcrumbItem = [
        {
            link: "Documentation",
            url: "/documentation",
        },
        {
            name: "Helper Class",
        },
    ]

    return (
        <>
            <div className='md:px-6 sm:px-3 pt-4'>
                <div className='container-fluid'>
                    <Breadcrumb breadcrumbItem={breadcrumbItem} />
                    <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                        <div className='flex items-center gap-10 mb-30'>
                            <IconLayout />
                            <p className='text-[20px]/[24px] font-medium'>
                                Layout Setting Attribute
                            </p>
                        </div>
                        <div className='overflow-auto'>
                            <table className='w-full min-w-[767px] table-hover text-[16px]/[24px]'>
                                <tbody>
                                    <tr>
                                        <td className='p-3 border-t border-border'>
                                            Enable Light & Dark Mode!
                                        </td>
                                        <td className='p-3 border-t border-border'>
                                            <div className='p-3 bg-dark text-white mb-10'>
                                                {'<html lang="en" data-theme="light">'}
                                            </div>
                                            <div>
                                                Change attribute in html tage <span className='text-danger'>light, dark</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3 border-t border-b border-border'>
                                            Enable RTL Mode!
                                        </td>
                                        <td className='p-3 border-t border-b border-border'>
                                            <div className='p-3 bg-dark text-white mb-10'>
                                                {'<html dir="rtl">'}
                                            </div>
                                            <div>
                                                Change attribute in html tage <span className='text-danger'>ltr, rtl</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='p-3 border-t border-b border-border'>
                                            Theme Color Setting
                                        </td>
                                        <td className='p-3 border-t border-b border-border'>
                                            <div className='p-3 bg-dark text-white mb-10'>
                                                {'<body data-luno-theme="indigo">'}
                                            </div>
                                            <div>
                                                Change attribute in body tage <span className='text-danger'>indigo, blue, cyan, green, orange, blush, red</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4'>
                        <div className='flex items-center gap-10 mb-30'>
                            <IconPalette />
                            <p className='text-[20px]/[24px] font-medium'>
                                Useful Color Class
                            </p>
                        </div>
                        <div className='mb-30'>
                            <p className='text-[16px]/[24px] mb-10'>
                                Background Colors
                            </p>
                            <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-20 mb-20'>
                                <div className='bg-primary text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .bg-primary
                                </div>
                                <div className='bg-secondary text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .bg-secondary
                                </div>
                                <div className='bg-dark text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .bg-dark
                                </div>
                            </div>
                            <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-20'>
                                <div className='bg-grey text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .bg-grey
                                </div>
                                <div className='bg-black text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .black
                                </div>
                                <div className='bg-black-50 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .black-50
                                </div>
                                <div className='bg-white text-black text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .white
                                </div>
                            </div>
                        </div>
                        <div className='mb-30'>
                            <p className='text-[16px]/[24px] mb-10'>
                                Action Colors
                            </p>
                            <div className='grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-20'>
                                <div className='bg-success text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .success
                                </div>
                                <div className='bg-warning text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .warning
                                </div>
                                <div className='bg-danger text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .danger
                                </div>
                                <div className='bg-info text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .info
                                </div>
                                <div className='text-success text-center border border-dashed border-border text-[24px]/[24px] rounded-lg md:p-20 p-15'>
                                    .text-success
                                </div>
                                <div className='text-warning text-center border border-dashed border-border text-[24px]/[24px] rounded-lg md:p-20 p-15'>
                                    .text-warning
                                </div>
                                <div className='text-danger text-center border border-dashed border-border text-[24px]/[24px] rounded-lg md:p-20 p-15'>
                                    .text-danger
                                </div>
                                <div className='text-info text-center border border-dashed border-border text-[24px]/[24px] rounded-lg md:p-20 p-15'>
                                    .text-info
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            <p className='text-[16px]/[24px] mb-10'>
                                Chart Colors
                            </p>
                            <div className='grid xxl:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-20 mb-10'>
                                <div className='bg-chart-color1 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .chart-color1
                                </div>
                                <div className='bg-chart-color2 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .chart-color2
                                </div>
                                <div className='bg-chart-color3 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .chart-color3
                                </div>
                                <div className='bg-chart-color4 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .chart-color4
                                </div>
                                <div className='bg-chart-color5 text-white text-center border border-dashed border-border text-[16px]/[24px] rounded-lg md:p-20 p-15'>
                                    .chart-color5
                                </div>
                            </div>
                            <p className=''>
                                Note : Chart color change as per theme
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
