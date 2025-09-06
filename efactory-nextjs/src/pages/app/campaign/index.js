import React, { useEffect, useState } from 'react'
import WelcomeHeader from '@/components/common/WelcomeHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import CampaignBody from './CampaignBody'

export default function Campaign() {

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "My Campaigns",
        },
    ]

    const [campaignsModal, setCampaignsModal] = useState(false)
    const openCampaignsModal = () => {
        setCampaignsModal(!campaignsModal)
    }
    useEffect(() => {
        document.body.classList[campaignsModal ? "add" : "remove"]("overflow-hidden")
    }, [campaignsModal])

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <CampaignBody openCampaignsModal={openCampaignsModal} campaignsModal={campaignsModal} />
            </div>
        </div>
    )
}
