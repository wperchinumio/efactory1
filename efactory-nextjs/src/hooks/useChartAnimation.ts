import { useState } from 'react';

interface AnimationSettings {
	animation: boolean;
	animationDuration: number;
	animationEasing: string;
}

/**
 * Custom hook to manage chart animations
 * Only animates when data is actually loaded, not on filter changes
 */
export const useChartAnimation = () => {
	const [dataJustLoaded, setDataJustLoaded] = useState<boolean>(false);

	// Call this when new data is loaded from API
	const triggerDataLoadAnimation = (): void => {
		setDataJustLoaded(true);
		// Reset the flag after a short delay to allow animation
		setTimeout(() => setDataJustLoaded(false), 1500);
	};

	// Call this when dataset selection changes (Orders, Lines, etc.)
	const triggerDatasetChangeAnimation = (): void => {
		setDataJustLoaded(true);
		setTimeout(() => setDataJustLoaded(false), 1000);
	};

	// Get animation settings for chart options
	const getAnimationSettings = (): AnimationSettings => ({
		animation: dataJustLoaded,
		animationDuration: dataJustLoaded ? 1000 : 0,
		animationEasing: 'cubicOut'
	});

	return {
		triggerDataLoadAnimation,
		triggerDatasetChangeAnimation,
		getAnimationSettings
	};
};
