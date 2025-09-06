import React from 'react';
import { IconRefresh, IconChartBar } from '@tabler/icons-react';

const LoadingState = ({ 
	message = "Loading analytics data...", 
	submessage = "Please wait while we process your data",
	type = "loading" // "loading" | "generating" 
}) => {
	return (
		<div className='p-8 text-center'>
			<div className='relative mb-6'>
				{/* Animated background circles */}
				<div className='absolute inset-0 flex items-center justify-center'>
					<div className='w-16 h-16 border-2 border-primary/20 rounded-full animate-ping'></div>
					<div className='absolute w-12 h-12 border-2 border-primary/30 rounded-full animate-ping animation-delay-200'></div>
					<div className='absolute w-8 h-8 border-2 border-primary/40 rounded-full animate-ping animation-delay-400'></div>
				</div>
				
				{/* Main icon */}
				<div className='relative z-10 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full'>
					{type === "generating" ? (
						<IconRefresh className='w-8 h-8 text-primary animate-spin' />
					) : (
						<IconChartBar className='w-8 h-8 text-primary animate-pulse' />
					)}
				</div>
			</div>
			
			{/* Text content with fade-in animation */}
			<div className='space-y-2 animate-fade-in'>
				<div className='text-font-color font-medium text-[16px]'>{message}</div>
				{submessage && (
					<div className='text-font-color-100 text-[13px]'>{submessage}</div>
				)}
			</div>
			
			{/* Animated dots */}
			<div className='flex justify-center items-center mt-4 space-x-1'>
				<div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
				<div className='w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100'></div>
				<div className='w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200'></div>
			</div>
		</div>
	);
};

export default LoadingState;
