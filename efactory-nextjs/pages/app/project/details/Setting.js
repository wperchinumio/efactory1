import React from 'react'
import { IconBrandGoogleFilled } from '@tabler/icons-react'

export default function Setting() {
    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Setting
            </div>
            <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Project Icon
                    </label>
                    <div className='w-[56px] h-[56px] min-w-[56px] flex items-center justify-center'>
                        {/* <img src={avatar1} alt='Project Icon' width="56" height="56" className='w-full h-full object-cover' /> */}
                        <IconBrandGoogleFilled className='w-full h-full text-primary' />
                    </div>
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Project Name
                    </label>
                    <input type='text' className='form-input' />
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Project Type
                    </label>
                    <input type='text' className='form-input' />
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Project Description
                    </label>
                    <textarea className="form-textarea" rows="3"></textarea>
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Due Date
                    </label>
                    <input type="date" className="form-input max-w-[300px]" />
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Notifications
                    </label>
                    <div className='flex gap-6 flex-wrap'>
                        <div className="form-check">
                            <input type="checkbox" id='projectSettingPhone' className="form-check-input" />
                            <label htmlFor='projectSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                        </div>
                        <div className="form-check">
                            <input type="checkbox" id='projectSettingEmail' className="form-check-input" defaultChecked />
                            <label htmlFor='projectSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                        </div>
                    </div>
                </div>
                <div className='grid md:grid-cols-[1fr_4fr] grid-cols-1 gap-2 form-control md:mb-4 sm:mb-6 mb-4'>
                    <label>
                        Status
                    </label>
                    <div className="form-check form-switch">
                        <input type="checkbox" id='projectSettingStatus' className="form-check-input" defaultChecked />
                        <label htmlFor='projectSettingStatus' className="form-check-label !text-[16px]/[24px]">Active</label>
                    </div>
                </div>
                <div className='flex items-stretch gap-5 justify-end border-t border-dashed border-border-color pt-6 mt-6'>
                    <button className='btn btn-white !border-border-color large'>
                        Discard
                    </button>
                    <button className='btn btn-primary large'>
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    )
}
