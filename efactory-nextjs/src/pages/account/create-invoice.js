import React, { useRef } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import ReactToPrint from 'react-to-print';
import { IconMailFilled, IconPrinter } from '@tabler/icons-react';
import { profile_av } from '/public/images';
import Image from 'next/image';

const SectionToPrint = React.forwardRef((props, ref) => (

    <div ref={ref} className='print-invoice card bg-card-color rounded-xl border border-dashed border-border-color'>
        <h5 className='md:p-6 p-4 text-[20px]/[24px] font-semibold border-b border-border-color'>INVOICE</h5>
        <div className='md:p-6 md:m-6 p-3 m-3 border border-dashed border-border-color rounded-xl'>
            <div className='flex gap-4 justify-between items-start sm:flex-row flex-col-reverse pb-6 mb-6 border-b border-border-color'>
                <textarea rows="5" cols="25" className='resize-none p-3' defaultValue={`Marshall Nichols,\n774 Andover St.\nSnohomish, WA 98290\n\nPhone: (012) 3456-7890`} />
                <div className='relative inline-block'>
                    <Image src={profile_av} alt='user profile' width="120" height="120" className='sm:w-[120px] sm:h-[120px] sm:min-w-[120px] w-[80px] h-[80px] min-w-[80px] object-contain sm:rounded-xl rounded-md' />
                </div>
            </div>
            <div className='flex gap-4 justify-between items-start flex-wrap pb-6'>
                <textarea cols="25" className='resize-none p-3 text-[20px]/[30px] font-bold' defaultValue={`Widget Card. c/o List\nWidget`} />
                <div className='overflow-auto'>
                    <table className="border-t border-l border-border-color min-w-[300px]">
                        <tbody>
                            <tr>
                                <td className='border-r border-b border-border-color p-2 bg-body-color'>Invoice #</td>
                                <td align='right' className='border-r border-b border-border-color p-2'>
                                    <textarea rows="1" className="resize-none flex text-right print:p-0" defaultValue="000123" />
                                </td>
                            </tr>
                            <tr>
                                <td className='border-r border-b border-border-color p-2 bg-body-color'>Date</td>
                                <td align='right' className='border-r border-b border-border-color p-2'>
                                    <textarea rows="1" className="resize-none flex text-right print:p-0" defaultValue="December 15, 2021" />
                                </td>
                            </tr>
                            <tr>
                                <td className='border-r border-b border-border-color p-2 bg-body-color'>Amount Due</td>
                                <td align='right' className='border-r border-b border-border-color p-2'>
                                    $875.00
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='overflow-auto'>
                <table className='w-full border-t border-l border-border-color min-w-[700px]'>
                    <thead>
                        <tr>
                            <th align='left' className='bg-body-color p-2 border-r border-b border-border-color'>
                                Item
                            </th>
                            <th align='left' className='bg-body-color p-2 border-r border-b border-border-color'>
                                Description
                            </th>
                            <th align='left' className='bg-body-color p-2 border-r border-b border-border-color'>
                                Unit Cost
                            </th>
                            <th align='left' className='bg-body-color p-2 border-r border-b border-border-color'>
                                Quantity
                            </th>
                            <th align='left' className='bg-body-color p-2 border-r border-b border-border-color'>
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                Web Updates
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                Monthly web updates for TTM (Nov. 1 - Nov. 30, 2021)
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                $650.00
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                1
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                $650.00
                            </td>
                        </tr>
                        <tr>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                SSL Renewals
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                Yearly renewals of SSL certificates on main domain and several subdomains
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                $75.00
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                3
                            </td>
                            <td valign='top' className='border-r border-b border-border-color p-2'>
                                $225.00
                            </td>
                        </tr>
                        <tr className='print:hidden'>
                            <td colSpan="5" className='border-r border-b border-border-color p-2'>
                                <button className='text-primary transition-all hover:text-secondary'>Add a row</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className='border-r border-border-color p-2'></td>
                            <td colSpan="2" align='right' className='border-r border-b border-border-color p-2'>
                                Subtotal
                            </td>
                            <td className='border-r border-b border-border-color p-2'>
                                $875.00
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className='border-r border-border-color p-2'></td>
                            <td colSpan="2" align='right' className='border-r border-b border-border-color p-2'>
                                Total
                            </td>
                            <td className='border-r border-b border-border-color p-2'>
                                $875.00
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className='border-r border-border-color p-2'></td>
                            <td colSpan="2" align='right' className='border-r border-b border-border-color p-2'>
                                Amount Paid
                            </td>
                            <td className='border-r border-b border-border-color p-2'>
                                $0.00
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className='border-r border-b border-border-color p-2'></td>
                            <td colSpan="2" align='right' className='border-r border-b border-border-color p-2 bg-body-color'>
                                Balance Due
                            </td>
                            <td className='border-r border-b border-border-color p-2 bg-body-color'>
                                $875.00
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='mt-12'>
                <h5 className='mb-2 text-[20px]/[24px] font-medium'>Terms</h5>
                <textarea className="resize-none flex bg-body-color p-2 w-full print:p-0" defaultValue="NET 30 Days. Finance Charge of 1.5% will be made on unpaid balances after 30 days." />
            </div>
        </div>
    </div>

));

export default function CreateInvoice() {

    const componentRef = useRef();

    const breadcrumbItem = [
        {
            name: "Account",
        },
        {
            name: "Create Invoice",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <SectionToPrint ref={componentRef} />
                <div className='flex items-stretch justify-end flex-wrap gap-5 mt-4'>
                    <ReactToPrint
                        trigger={() => <button className='btn btn-primary large'>
                            <IconPrinter className='w-[20px] h-[20px]' />
                            Print Invoice
                        </button>}
                        content={() => componentRef.current}
                    />
                    <button className='btn btn-secondary large'>
                        <IconMailFilled className='w-[20px] h-[20px]' />
                        Send PDF
                    </button>
                </div>
            </div>
        </div>
    )
}
