import React from 'react'
import { no_data } from '/public/images'
import Image from 'next/image'

export default function Trash() {

    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[26px]'>
                    Favorites
                    <span className='inline-block font-bold ms-1'>
                        (05)
                    </span>
                </h5>
            </div>
            <div className='card rounded-xl bg-card-color md:p-12 p-8 flex flex-col justify-center items-center border border-dashed border-border-color'>
                <Image src={no_data} alt='no data' width="120" height="117" className='w-[120px] mb-6' />
                <div className='text-font-color-100 mb-4'>
                    No data to show
                </div>
                <div className='inline-flex gap-2 items-stretch flex-wrap justify-center'>
                    <button className='btn btn-white !border-border-color'>
                        Get Started
                    </button>
                    <button className='btn btn-primary'>
                        Back to Home
                    </button>
                </div>
            </div>
        </>
    )
}