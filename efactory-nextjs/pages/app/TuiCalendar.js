import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Breadcrumb from '../../components/common/Breadcrumb';
import WelcomeHeader from '../../components/common/WelcomeHeader';

// Dynamically import Calendar with ssr: false
const Calendar = dynamic(() => import('@toast-ui/calendar'), { ssr: false });

import '@toast-ui/calendar/dist/toastui-calendar.min.css';

export default function TuiCalendar() {
    const breadcrumbItem = [
        { name: "App" },
        { name: "tui Calendar" },
    ];

    useEffect(() => {
        // Check if window is defined (this will be true only on the client-side)
        if (typeof window !== 'undefined') {
            const calendarEl = document.getElementById('calendar');

            const calendar = new Calendar(calendarEl, {
                defaultView: 'month',
                template: {
                    time(event) {
                        const { start, end, title } = event;
                        return `<span style="color: red;">${formatTime(start)}~${formatTime(end)} ${title}</span>`;
                    },
                    allday(event) {
                        return `<span style="color: gray;">${event.title}</span>`;
                    },
                },
                calendars: [
                    { id: 'cal1', name: 'Personal', backgroundColor: '#03bd9e' },
                    { id: 'cal2', name: 'Work', backgroundColor: '#00a9ff' },
                ],
            });

            calendar.render();

            // Clean up on component unmount
            return () => {
                calendar.destroy();
            };
        }
    }, []); // Empty dependency array to run the effect only once on mount

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <Breadcrumb breadcrumbItem={breadcrumbItem} />
            <WelcomeHeader income />
            <div id="calendar" style={{ height: '800px' }} />
        </div>
    );
}
