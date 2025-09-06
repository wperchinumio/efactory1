import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css';
import ReactDataTable from 'react-data-table-component';
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import {
    IconArchive,
    IconMail,
    IconPencil,
    IconStarFilled,
    IconTrash,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar8,
    avatar9,
    profile_av,
} from '/public/images'
import Image from 'next/image';

export default function Invoice() {

    const breadcrumbItem = [
        {
            name: "Account",
        },
        {
            name: "Invoice",
        },
    ]

    const columnsInvoice = [
        {
            name: <div className="form-check">
                <input type="checkbox" id='allInvoiceSelecr' className="form-check-input" />
            </div>,
            selector: row => <div className="form-check">
                <input type="checkbox" id='allInvoiceSelecr' className="form-check-input" />
            </div>,
            width: '64px',
        },
        {
            name: 'INVOICE',
            selector: row => row.invoice,
            sortable: true,
        },
        {
            name: 'NAME',
            selector: row => row.name,
            cell: row => <div className='flex items-center gap-2 flex-wrap'>
                <Image src={row.userImage} alt='profile' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-md' />
                <div>
                    {row.name}
                </div>
            </div>,
            sortable: true,
        },
        {
            name: 'TOTAL',
            selector: row => row.total,
            sortable: true,
        },
        {
            name: 'DATE',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'DUE DATE',
            selector: row => row.dueDate,
            sortable: true,
        },
        {
            name: 'Action',
            selector: row =>
                <div className='flex gap-4'>
                    <button title='Edit'>
                        <IconPencil className='w-[18px] h-[18px] text-font-color-100 transition-all hover:text-blue' />
                    </button>
                    <button title='Message'>
                        <IconMail className='w-[18px] h-[18px] text-font-color-100 transition-all hover:text-blue' />
                    </button>
                    <button title='Favourites'>
                        <IconArchive className='w-[18px] h-[18px] text-font-color-100 transition-all hover:text-blue' />
                    </button>
                    <button title='Delete'>
                        <IconTrash className='w-[18px] h-[18px] text-font-color-100 transition-all hover:text-blue' />
                    </button>
                </div>,
        },
    ];

    const dataInvoice = [
        {
            invoice: '#RA0011',
            name: 'Andew Jon',
            userImage: avatar1,
            total: 'USD 12,820',
            date: 'Jan 16 2022',
            dueDate: 'Jan 20 2022',
        },
        {
            invoice: '#RA0012',
            name: 'Orlando Lentz',
            userImage: avatar2,
            total: 'USD 2,000',
            date: 'Jan 15 2022',
            dueDate: 'Jan 15 2022',
        },
        {
            invoice: '#RA0025',
            name: 'Marshall Nichols',
            userImage: avatar3,
            total: 'USD 8,000',
            date: 'Jan 10 2022',
            dueDate: 'Jan 12 2022',
        },
        {
            invoice: '#RA0023',
            name: 'Nellie Maxwell',
            userImage: avatar4,
            total: 'USD 3,500',
            date: 'Jan 07 2022',
            dueDate: 'Jan 08 2022',
        },
        {
            invoice: '#RA0026',
            name: 'Marshall Nichols',
            userImage: avatar5,
            total: 'USD 250',
            date: 'Jan 06 2022',
            dueDate: 'Jan 06 2022',
        },
        {
            invoice: '#RA0065',
            name: 'Issa Bell',
            userImage: avatar6,
            total: 'USD 9,150',
            date: 'Jan 03 2022',
            dueDate: 'Jan 05 2022',
        },
        {
            invoice: '#RA0015',
            name: 'Dean Otto',
            userImage: avatar8,
            total: 'USD 5,000',
            date: 'Jan 03 2022',
            dueDate: 'Jan 05 2022',
        },
        {
            invoice: '#RA0029',
            name: 'Comeren Diaz',
            userImage: avatar9,
            total: 'USD 2,050',
            date: 'Jan 03 2022',
            dueDate: 'Jan 05 2022',
        },
        {
            invoice: '#RA0028',
            name: 'Chris Fox',
            userImage: avatar10,
            total: 'USD 2,000	',
            date: 'Jan 03 2022',
            dueDate: 'Jan 05 2022',
        },
        {
            invoice: '#RA0035',
            name: 'Bucky Barnes',
            userImage: profile_av,
            total: 'USD 1,100',
            date: 'Feb 03 2022',
            dueDate: 'Feb 05 2022',
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader report />
                <div className='relative rounded-xl border border-dashed border-primary p-4'>
                    <span className="bg-body-color text-primary px-5 font-semibold absolute top-[-14px]">Recent Invoices :</span>
                    <Swiper
                        pagination={{
                            el: '.swiper-pagination',
                        }}
                        modules={[Pagination]}
                        slidesPerView="1"
                        spaceBetween={10}
                        grabCursor={true}
                        breakpoints={{
                            1600: {
                                slidesPerView: "5"
                            },
                            992: {
                                slidesPerView: "4"
                            },
                            767: {
                                slidesPerView: "3"
                            },
                            449: {
                                slidesPerView: "2"
                            }
                        }}
                    >
                        <SwiperSlide>
                            <div className='card bg-card-color rounded-xl md:p-6 p-4 relative border border-dashed border-border-color'>
                                <div className='bg-primary p-5 w-[30px] inline-flex items-center justify-center absolute top-0 end-[20px] after:absolute after:end-0 after:top-[calc(100%-10px)] after:border-[15px] after:border-primary after:border-b-[5px] after:border-b-transparent '>
                                    <IconStarFilled className='text-white w-[16px] h-[16px] relative z-[1]' />
                                </div>
                                <div className='w-[56px] h-[56px] min-w-[56px] mb-4 rounded-full overflow-hidden uppercase bg-body-color flex items-center justify-center font-semibold text-[20px]/[30px] text-secondary'>
                                    BB
                                </div>
                                <small className="text-font-color-100">Total</small>
                                <h4 className='text-[24px]/[28px] font-medium mb-2'>USD 2,500</h4>
                                <ul className='list-disc ps-6 leading-8 text-font-color-100'>
                                    <li>
                                        Bucky Barnes
                                    </li>
                                    <li>
                                        #RA0015
                                    </li>
                                    <li>
                                        Jan 01 2022
                                    </li>
                                </ul>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='card bg-card-color rounded-xl md:p-6 p-4 relative border border-dashed border-border-color'>
                                <div className='w-[56px] h-[56px] min-w-[56px] mb-4 rounded-full overflow-hidden uppercase bg-body-color flex items-center justify-center font-semibold text-[20px]/[30px] text-secondary'>
                                    DO
                                </div>
                                <small className="text-font-color-100">Total</small>
                                <h4 className='text-[24px]/[28px] font-medium mb-2'>USD 5,520</h4>
                                <ul className='list-disc ps-6 leading-8 text-font-color-100'>
                                    <li>
                                        Dean Otto
                                    </li>
                                    <li>
                                        #RA0016
                                    </li>
                                    <li>
                                        Jan 03 2022
                                    </li>
                                </ul>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='card bg-card-color rounded-xl md:p-6 p-4 relative border border-dashed border-border-color'>
                                <div className='w-[56px] h-[56px] min-w-[56px] mb-4 rounded-full overflow-hidden uppercase bg-body-color flex items-center justify-center font-semibold text-[20px]/[30px] text-secondary'>
                                    <Image src={avatar1} alt='user' className='w-full h-full object-cover' />
                                </div>
                                <small className="text-font-color-100">Total</small>
                                <h4 className='text-[24px]/[28px] font-medium mb-2'>USD 2,500</h4>
                                <ul className='list-disc ps-6 leading-8 text-font-color-100'>
                                    <li>
                                        Orlando Lentz
                                    </li>
                                    <li>
                                        #RA0017
                                    </li>
                                    <li>
                                        Jan 03 2022
                                    </li>
                                </ul>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='card bg-card-color rounded-xl md:p-6 p-4 relative border border-dashed border-border-color'>
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
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='card bg-card-color rounded-xl md:p-6 p-4 relative border border-dashed border-border-color'>
                                <div className='w-[56px] h-[56px] min-w-[56px] mb-4 rounded-full overflow-hidden uppercase bg-body-color flex items-center justify-center font-semibold text-[20px]/[30px] text-secondary'>
                                    AJ
                                </div>
                                <small className="text-font-color-100">Total</small>
                                <h4 className='text-[24px]/[28px] font-medium mb-2'>USD 7,100</h4>
                                <ul className='list-disc ps-6 leading-8 text-font-color-100'>
                                    <li>
                                        Andew Jon
                                    </li>
                                    <li>
                                        #RA0019
                                    </li>
                                    <li>
                                        Jan 05 2022
                                    </li>
                                </ul>
                            </div>
                        </SwiperSlide>
                        <div className="swiper-pagination !static" />
                    </Swiper>
                </div>
                <div className='relative rounded-xl border border-dashed border-border-color p-4 mt-8'>
                    <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">All Invoices :</span>
                    <div className='overflow-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th className='py-2 px-4'>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='react-data-table striped overflow-auto'>
                        <ReactDataTable
                            columns={columnsInvoice}
                            data={dataInvoice}
                            className='min-w-[1000px]'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
