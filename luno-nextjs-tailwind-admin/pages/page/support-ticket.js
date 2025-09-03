import React from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import {
    IconCaretUpFilled,
    IconEyeFilled,
    IconMessageCircle2Filled,
} from '@tabler/icons-react'

export default function SupportTicket() {

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "Support Ticket",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='card rounded-xl bg-card-color flex flex-col overflow-hidden md:mb-6 mb-4 border border-dashed border-border-color'>
                    <div className='progress overflow-hidden h-[5px] bg-border-color rounded-full flex'>
                        <div className='progress-bar w-[20%] bg-danger h-full'></div>
                        <div className='progress-bar w-[30%] bg-info h-full'></div>
                        <div className='progress-bar w-[10%] bg-warning h-full'></div>
                        <div className='progress-bar w-[40%] bg-success h-full'></div>
                    </div>
                    <div className='md:p-6 p-4'>
                        <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 md:mb-6 mb-4'>
                            <div className='p-4 rounded-xl border border-dashed border-border-color'>
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
                            <div className='p-4 rounded-xl border border-dashed border-border-color'>
                                <div className='flex gap-2 items-center uppercase text-font-color-100 mb-1'>
                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-info'></span>
                                    IN PROGRASS
                                </div>
                                <div className='flex items-end gap-2'>
                                    <span className="font-bold text-[24px]/[30px]">
                                        55
                                    </span>
                                    <span className='flex items-end'>
                                        8%
                                        <IconCaretUpFilled className='w-[16px] h-[16px] min-w-[16px]' />
                                    </span>
                                </div>
                            </div>
                            <div className='p-4 rounded-xl border border-dashed border-border-color'>
                                <div className='flex gap-2 items-center uppercase text-font-color-100 mb-1'>
                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-warning'></span>
                                    ON HOLD
                                </div>
                                <div className='flex items-end gap-2'>
                                    <span className="font-bold text-[24px]/[30px]">
                                        8
                                    </span>
                                    <span className='flex items-end'>
                                        2%
                                        <IconCaretUpFilled className='w-[16px] h-[16px] min-w-[16px]' />
                                    </span>
                                </div>
                            </div>
                            <div className='p-4 rounded-xl border border-dashed border-border-color'>
                                <div className='flex gap-2 items-center uppercase text-font-color-100 mb-1'>
                                    <span className='inline-block w-[14px] h-[14px] min-w-[14px] rounded-full bg-success'></span>
                                    COMPLETED
                                </div>
                                <div className='flex items-end gap-2'>
                                    <span className="font-bold text-[24px]/[30px]">
                                        105
                                    </span>
                                    <span className='flex items-end'>
                                        18%
                                        <IconCaretUpFilled className='w-[16px] h-[16px] min-w-[16px]' />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-stretch gap-y-2 gap-x-4 sm:flex-row flex-col md:mb-6 mb-4'>
                            <div className='floating-form-control flex-1'>
                                <input type='text' id='findTicket' className='form-input' placeholder="Find Ticket..." />
                                <label htmlFor='findTicket' className='form-label'>Find Ticket...</label>
                            </div>
                            <div className='flex gap-4'>
                                <button className='btn btn-primary'>
                                    Search
                                </button>
                                <button className='btn btn-secondary'>
                                    Add new ticket
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-x-6 gap-y-2 flex-wrap">
                            <div className="form-check">
                                <input type="checkbox" id="findTicketAll" className="form-check-input" />
                                <label for="findTicketAll" className="form-check-label !text-[16px]/[24px]">
                                    All
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="findNewTicket" className="form-check-input" />
                                <label for="findNewTicket" className="form-check-label !text-[16px]/[24px]">
                                    New Ticket
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="findInProgress" className="form-check-input" />
                                <label for="findInProgress" className="form-check-label !text-[16px]/[24px]">
                                    In Prograss
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="findOnHold" className="form-check-input" />
                                <label for="findOnHold" className="form-check-label !text-[16px]/[24px]">
                                    On Hold
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="findCompleted" className="form-check-input" />
                                <label for="findCompleted" className="form-check-label !text-[16px]/[24px]">
                                    Completed
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='md:mb-6 mb-4'>
                    <h5 className='font-medium text-[20px]/[26px]'>
                        Showing 8 Ticket
                    </h5>
                    <p className='text-font-color-100 small'>
                        Based your preferences
                    </p>
                </div>
                <div className='overflow-auto'>
                    <table className='w-full min-w-[1100px]'>
                        <thead>
                            <tr>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold rounded-s-[4px]'>
                                    TICKET ID
                                </td>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold'>
                                    SUBJECT
                                </td>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold'>
                                    STATUS
                                </td>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold'>
                                    LAST UPDATE
                                </td>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold'>
                                    SUPOORT
                                </td>
                                <td className='py-2 px-4 bg-card-color text-[12px]/[18px] font-bold rounded-e-[4px]'>
                                    ACTION
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4512
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Problem starting campaign last week
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-info text-white text-[12px]/[1] font-bold'>
                                        In Prograss
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    11 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Marshall Nichols
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4848
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    There are many variations of passages of Lorem Ipsum available
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-info text-white text-[12px]/[1] font-bold'>
                                        In Prograss
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    13 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Orlando Lentz
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4141
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Contrary to popular belief, not simply random text
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-warning text-font-color text-[12px]/[1] font-bold'>
                                        On Hold
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    14 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Chris Fox
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-1245
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Problem starting campaign last week
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-info text-white text-[12px]/[1] font-bold'>
                                        In Prograss
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    20 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Marshall Nichols
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4679
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Problem starting campaign last week
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-success text-white text-[12px]/[1] font-bold'>
                                        Completed
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    22 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Nellie Maxwell
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4141
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    when an unknown printer took a galley
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-warning text-font-color text-[12px]/[1] font-bold'>
                                        On Hold
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    14 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Chris Fox
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-1245
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Various versions have evolved over the years
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-info text-white text-[12px]/[1] font-bold'>
                                        In Prograss
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    20 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Chris Fox
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className='py-3 px-4 bg-card-color rounded-s-[4px] border-t border-r border-border-color last:border-r-0'>
                                    D-4679
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    The generated Lorem Ipsum is therefore
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    <span className='inline-block py-1 px-2 rounded-md bg-success text-white text-[12px]/[1] font-bold'>
                                        Completed
                                    </span>
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    22 Aug 2021
                                </td>
                                <td className='py-3 px-4 bg-card-color border-t border-r border-border-color last:border-r-0'>
                                    Orlando Lentz
                                </td>
                                <td className='py-3 px-4 bg-card-color rounded-e-[4px] border-t border-r border-border-color last:border-r-0'>
                                    <div className='flex gap-4'>
                                        <button className='text-font-color-100' title="View">
                                            <IconEyeFilled className='w-[16px] h-[16px]' />
                                        </button>
                                        <button className='text-font-color-100' title="Comment">
                                            <IconMessageCircle2Filled className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
