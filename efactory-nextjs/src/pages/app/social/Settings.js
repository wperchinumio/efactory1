import { IconDots } from '@tabler/icons-react'
import React from 'react'

export default function Settings() {

    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Settings
            </div>
            <div className='grid xxl:grid-cols-[7fr_5fr] grid-cols-1 gap-4'>
                <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                    <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                        <div className='font-semibold'>
                            User Settings
                        </div>
                        <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                            <IconDots className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                    <div className='form grid grid-cols-12 md:gap-6 gap-4'>
                        <div className="form-control sm:col-span-4 col-span-12">
                            <label htmlFor="userName" className="form-label">
                                User Name <span className='text-danger'>*</span>
                            </label>
                            <input type="text" id="userName" className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-4 col-span-12">
                            <label htmlFor="contactPerson" className="form-label">
                                Contact Person
                            </label>
                            <input type="text" id="contactPerson" defaultValue="Louis Pierce" className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-4 col-span-12">
                            <label htmlFor="mobileNumber" className="form-label">
                                Mobile Number <span className='text-danger'>*</span>
                            </label>
                            <input type="number" id="mobileNumber" className="form-input" />
                        </div>
                        <div className="form-control col-span-12">
                            <label htmlFor="address" className="form-label">
                                Address
                            </label>
                            <textarea rows={3} placeholder='44 Shirley Ave. West Chicago, IL 60185' className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="email" className="form-label">
                                Email <span className='text-danger'>*</span>
                            </label>
                            <div className="relative w-full flex">
                                <div className="flex items-center justify-center gap-4 border border-border-color rounded-s-md mr-[-1px] py-[6px] px-[12px] bg-body-color">
                                    @
                                </div>
                                <input type="email" id="email" defaultValue="LouisPierce@example.com" className="form-input !rounded-s-none" />
                            </div>
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="websiteUrl" className="form-label">
                                Website Url
                            </label>
                            <div className="relative w-full flex">
                                <div className="flex items-center justify-center gap-4 border border-border-color rounded-s-md mr-[-1px] py-[6px] px-[12px] bg-body-color">
                                    http://
                                </div>
                                <input type="text" id="websiteUrl" className="form-input !rounded-s-none" />
                            </div>
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="country" className="form-label">
                                Country
                            </label>
                            <select className="form-select w-full cursor-pointer rounded-md bg-card-color py-[10px] ps-[12px] pe-30 appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                <option defaultValue="">-- Select Country --</option>
                                <option value="1">Afghanistan</option>
                                <option value="2">Åland Islands</option>
                                <option value="3">Albania</option>
                                <option value="4">Algeria</option>
                                <option value="5">American Samoa</option>
                            </select>
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="stateProvince" className="form-label">
                                State/Province
                            </label>
                            <select className="form-select w-full cursor-pointer rounded-md bg-card-color py-[10px] ps-[12px] pe-30 appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                <option defaultValue="">California</option>
                                <option value="1">Alaska</option>
                                <option value="2">Alabama</option>
                            </select>
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                            <input type="text" id="city" defaultValue="New York" className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="postalCode" className="form-label">
                                Postal Code
                            </label>
                            <input type="text" id="postalCode" defaultValue="91403" className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="phoneNumber" className="form-label">
                                Phone Number
                            </label>
                            <input type="number" id="phoneNumber" className="form-input" />
                        </div>
                        <div className="form-control sm:col-span-6 col-span-12">
                            <label htmlFor="Fax" className="form-label">
                                Fax
                            </label>
                            <input type="text" id="Fax" className="form-input" />
                        </div>
                        <div className='col-span-12'>
                            <button className='btn btn-primary'>
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='card bg-card-color rounded-xl overflow-hidden border border-dashed border-border-color'>
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
                                    <input type="checkbox" id="notiSetting1" className="form-check-input" />
                                    <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting1">
                                        Anyone send me a message
                                    </label>
                                </div>
                            </li>
                            <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                <div className='form-check'>
                                    <input type="checkbox" id="notiSetting2" className="form-check-input" />
                                    <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting2">
                                        Anyone seeing my profile page
                                    </label>
                                </div>
                            </li>
                            <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                <div className='form-check'>
                                    <input type="checkbox" id="notiSetting3" className="form-check-input" />
                                    <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting3">
                                        Anyone posts a comment on my post
                                    </label>
                                </div>
                            </li>
                            <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                <div className='form-check'>
                                    <input type="checkbox" id="notiSetting4" className="form-check-input" />
                                    <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting4">
                                        Anyone send me a message
                                    </label>
                                </div>
                            </li>
                            <li className="py-3 px-4 border-b border-dashed last:border-none transition-all hover:bg-primary-10">
                                <div className='form-check'>
                                    <input type="checkbox" id="notiSetting5" className="form-check-input" />
                                    <label className="form-check-label !text-[16px]/[24px]" htmlFor="notiSetting5">
                                        Anyone seeing my profile page
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                            <div className='font-semibold'>
                                Password
                            </div>
                            <button className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                                <IconDots className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                        <div className='form grid grid-cols-12 md:gap-6 gap-4'>
                            <div className="form-control col-span-12">
                                <label htmlFor="currentPassword" className="form-label">
                                    Change Password
                                </label>
                                <input type="number" id="currentPassword" placeholder='Current Password' className="form-input" />
                                <input type="number" id="newPassword" placeholder='New Password' className="form-input mt-2" />
                                <input type="number" id="confirmNewPassword" placeholder='Confirm New Password' className="form-input mt-2" />
                            </div>
                            <div className='col-span-12 flex items-stretch gap-2'>
                                <button className='btn btn-primary'>
                                    SAVE
                                </button>
                                <button className='btn btn-white !border-border-color'>
                                    CANCEL
                                </button>
                            </div>
                            <hr className='col-span-12' />
                            <div className="form-control sm:col-span-4 col-span-12">
                                <input type="text" id="disablePassword" defaultValue="louispierce" className="form-input" disabled />
                            </div>
                            <div className="form-control sm:col-span-4 col-span-12">
                                <input type="text" id="textPassword" defaultValue="louis.info@yourdomain.com" className="form-input" />
                            </div>
                            <div className="form-control sm:col-span-4 col-span-12">
                                <input type="number" id="PhonePassword" placeholder='Phone Number' className="form-input" />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
