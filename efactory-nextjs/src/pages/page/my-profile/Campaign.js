import React, { useEffect, useState } from 'react'
import CampaignBody from '@/pages/app/campaign/CampaignBody'

export default function Campaign() {

    const [campaignsModal, setCampaignsModal] = useState(false)
    const openCampaignsModal = () => {
        setCampaignsModal(!campaignsModal)
    }
    useEffect(() => {
        document.body.classList[campaignsModal ? "add" : "remove"]("overflow-hidden")
    }, [campaignsModal])

    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[24px] font-medium'>
                    Campaigns
                </h5>
                <button onClick={openCampaignsModal} className="btn btn-black">
                    Create new campaign
                </button>
            </div>
            <CampaignBody openCampaignsModal={openCampaignsModal} campaignsModal={campaignsModal} />
        </>
    )
}
