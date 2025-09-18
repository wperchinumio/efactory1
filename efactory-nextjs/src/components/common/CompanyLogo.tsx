// import Image from 'next/image' // Removed to prevent re-requests
import React from 'react';

interface CompanyLogoProps {
	className?: string;
	miniMode?: boolean;
}

const CompanyLogo = React.memo(function CompanyLogo({ className, miniMode = false }: CompanyLogoProps) {
    if (miniMode) {
        // Show only the square DCL symbol from separate SVG file
        return (
            <img 
                src="/images/logo_square.svg" 
                alt="DCL Logo" 
                width={30} 
                height={29} 
                className={className}
                loading="eager"
            />
        )
    }

    // Show full logo with text
    return (
        <svg className={`topbar-logo ${className || ''}`} viewBox="0 0 106 29" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
            <desc>Logo</desc>
            <path d="M18.3,5.1l3.6-3.6c1.3-1.3,2.4-1.3,3.1-1.1c0.9,0.2,1.8,0.7,2.5,1.4c1.4,1.3,2.5,3.3,0.3,5.5 l-3.6,3.6c-1.3,1.3-2.4,1.3-3.1,1.1c-0.4-0.1-0.8-0.2-1.2-0.5l1.7-1.7c0.6-0.6,0.6-1.6,0-2.2l0,0c-0.6-0.6-1.6-0.6-2.2,0l-1.7,1.7 C16.9,8.1,16.7,6.6,18.3,5.1"></path>
            <path d="M10.8,23.9l-3.6,3.6c-1.3,1.3-2.4,1.3-3.1,1.1c-0.9-0.2-1.8-0.7-2.5-1.4c-1.4-1.3-2.5-3.3-0.3-5.5 l3.6-3.6C6.2,16.9,7.3,16.9,8,17c0.4,0.1,0.8,0.2,1.2,0.5l-1.7,1.7c-0.6,0.6-0.6,1.6,0,2.2l0,0c0.6,0.6,1.6,0.6,2.2,0l1.7-1.7 C12.3,20.9,12.4,22.4,10.8,23.9"></path>
            <path d="M2.3,16.7l-2.3,2.2V3c0-0.9,0.8-1.7,1.7-1.7h16.3l-2.5,2.4c-3.7,3.6-2.7,6.8-1.2,8.9l-2.9,2.8 c-0.9-0.6-1.9-1-2.9-1.2C5.5,13.6,3.5,15.5,2.3,16.7"></path>
            <path d="M28,11.2V27c0,0.9-0.8,1.7-1.7,1.7H10.2l2.4-2.4c3.7-3.6,2.7-6.8,1.1-8.8l2.9-2.8 c0.9,0.6,1.9,1,2.9,1.2c3.2,0.6,5.1-1.4,6.3-2.5L28,11.2z"></path>
            <polygon points="86.2,28.6 86.2,0.4 92.5,0.4 92.5,22.5 105.9,22.5 105.9,28.6 "></polygon>
            <path d="M72.2,6.5h10.8V0.3H72.7c-8.8,0-12.3,4.5-13.6,9c-1.3-4.5-4.8-9-13.6-9H34.1v18.9h6.4V6.5h5.5 c5.9,0,7.1,4.3,7.1,8c0,2-0.5,4-1.4,5.5c-0.8,1.2-2.2,2.6-5.7,2.6H34.1v6.1H45c3.2,0,8.7,0,12.3-5.3c0.8-1.2,1.4-2.4,1.9-3.8 c0.4,1.4,1,2.6,1.9,3.8c3.6,5.3,9,5.3,12.3,5.3h9.9v-6.1H72.2c-3.5,0-4.9-1.5-5.7-2.6c-0.9-1.4-1.4-3.4-1.4-5.4 C65.2,10.8,66.4,6.5,72.2,6.5"></path>
        </svg>
    )
});

export default CompanyLogo;
