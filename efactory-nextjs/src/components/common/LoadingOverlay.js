import React from 'react'

export default function LoadingOverlay({ text = 'Loading...' }) {
	return (
		<div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]'>
			<div className='flex flex-col items-center gap-3 p-6 rounded-xl bg-card-color border border-dashed border-border-color shadow-shadow-lg'>
				<div className='w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin'></div>
				<div className='text-font-color-100 text-sm'>{text}</div>
			</div>
		</div>
	)
}
