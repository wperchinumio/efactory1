import React from 'react'
import { IconFolderFilled } from '@tabler/icons-react'

export default function SharedWithMe() {

    return (
        <>
            <div className='text-[24px]/[30px] font-medium my-2'>
                Shared with Me
            </div>
            <div className='mt-4 grid xxl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2'>
                <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                    <IconFolderFilled className='w-[36px] h-[36px] text-chart-color2' />
                    <h5 className='my-2 text-[20px]/[26px] font-medium'>Birthday Party</h5>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Files :
                        </span>
                        <span>
                            648
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Size :
                        </span>
                        <span>
                            850 MB
                        </span>
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                    <IconFolderFilled className='w-[36px] h-[36px] text-chart-color3' />
                    <h5 className='my-2 text-[20px]/[26px] font-medium'>1 Day Outing</h5>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Files :
                        </span>
                        <span>
                            172
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Size :
                        </span>
                        <span>
                            790 MB
                        </span>
                    </div>
                </div>
                <div className='card bg-card-color rounded-xl p-4 relative border border-dashed border-border-color'>
                    <IconFolderFilled className='w-[36px] h-[36px] text-chart-color5' />
                    <h5 className='my-2 text-[20px]/[26px] font-medium'>Templates</h5>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Files :
                        </span>
                        <span>
                            890
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-between text-font-color-100">
                        <span>
                            Size :
                        </span>
                        <span>
                            506 MB
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}