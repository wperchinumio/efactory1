import React from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import Breadcrumb from '../../../components/common/Breadcrumb'
import WelcomeHeader from '../../../components/common/WelcomeHeader'

export default function Calendar() {

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "Calendar",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='card md:p-6 p-4 rounded-xl bg-card-color border border-dashed border-border-color'>
                    <FullCalendar
                        plugins={[interactionPlugin, dayGridPlugin]}
                        initialView="dayGridMonth"
                        editable
                        selectable
                        events="https://fullcalendar.io/demo-events.json"
                    />
                </div>
            </div>
        </div>
    )
}
