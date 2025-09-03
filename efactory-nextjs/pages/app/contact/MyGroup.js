import React, { useState } from 'react'
import {
    IconDots,
    IconX,
} from '@tabler/icons-react'
import {
    avatar1,
    avatar10,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
} from '/public/images'
import Image from 'next/image'

export default function MyGroup() {

    const [createGroupSidebar, setCreateGroupSidebar] = useState(false)
    const toggleCreateGroupSidebar = () => {
        setCreateGroupSidebar(!createGroupSidebar)
    }

    return (
        <>
            <div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
                <h5 className='text-[20px]/[26px]'>
                    My Groups
                    <span className='inline-block font-bold ms-1'>
                        (08)
                    </span>
                </h5>
                <div className='flex items-stretch gap-1 flex-wrap'>
                    <select className="form-select cursor-pointer rounded-md bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                        <option defaultValue="">Choose...</option>
                        <option value="1">Designer</option>
                        <option value="2">Developer</option>
                        <option value="3">Office</option>
                        <option value="4">Friends</option>
                        <option value="5">Management</option>
                    </select>
                    <button onClick={toggleCreateGroupSidebar} className={`border border-current text-grey rounded-md text-[14px]/[20px] py-2 px-3 flex items-center gap-4 font-semibold cursor-pointer transition-all duration-300 after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${createGroupSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                        <span>
                            Create Group
                        </span>
                    </button>
                </div>
            </div>
            <div className='grid xxl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar1} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar2} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar3} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar4} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Out Sourcing
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            16 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar5} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar6} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar7} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Management
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            11 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar8} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar9} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar10} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar1} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Sold Properties
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            106 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar1} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <div className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                            RH
                        </div>
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            San Fransisco
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            126 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar2} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar5} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar10} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar6} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Los Angeles
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            84 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar1} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar8} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar3} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar2} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Colleagues
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            245 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar1} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <div className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary'>
                            RH
                        </div>
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            San Fransisco
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            126 Contacts
                        </p>
                    </div>
                </div>
                <div className='card overflow-hidden bg-card-color rounded-xl relative md:p-6 p-4 flex flex-col border border-dashed border-border-color'>
                    <button className='absolute top-10 right-10 z-[1] bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[18px] h-[18px]' />
                    </button>
                    <div className='py-6 flex gap-2 justify-center flex-wrap'>
                        <Image src={avatar2} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar5} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar10} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                        <Image src={avatar6} alt='user profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full bg-body-color flex items-center justify-center font-semibold text-secondary' />
                    </div>
                    <div className='text-center mt-auto'>
                        <p>
                            Los Angeles
                        </p>
                        <p className='text-font-color-100 text-[14px]/[20px]'>
                            84 Contacts
                        </p>
                    </div>
                </div>
            </div>
            <div className={`fixed top-0 bg-card-color z-[5] h-svh w-full max-w-[400px] transition-all duration-200 ${createGroupSidebar ? 'ltr:right-0 rtl:left-0' : 'ltr:-right-full rtl:-left-full'}`}>
                <div className='p-4 flex items-center justify-between gap-15'>
                    <div className='text-[20px]/[30px] font-medium'>
                        Create new Group
                    </div>
                    <button onClick={toggleCreateGroupSidebar}>
                        <IconX />
                    </button>
                </div>
                <div className='p-4 h-[calc(100svh-62px)] overflow-auto custom-scrollbar'>
                    <p className='mb-6'>
                        <strong>Note : </strong>
                        It is a long established fact that a reader will be distracted by the readable.
                    </p>
                    <div className='p-4 rounded-xl border border-dashed border-border-color'>
                        <div className='floating-form-control mb-4'>
                            <input type='text' id='groupName' className='form-input' placeholder="Group Name" />
                            <label htmlFor='groupName' className='form-label'>Group Name</label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>Added : </span>
                            <Image src={avatar1} alt='userProfile' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar2} alt='userProfile' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                            <Image src={avatar3} alt='userProfile' width="26" height="26" className='w-[26px] h-[26px] min-w-[26px] rounded-full' />
                        </div>
                    </div>
                    <div className='flex justify-end mt-4'>
                        <button className='btn btn-primary'>
                            Create New Group
                        </button>
                    </div>
                    <p className='mb-4'>
                        Contact List
                    </p>
                    <div className='flex flex-col gap-1'>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar1} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Chris Fox
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    21 mutual connections
                                </div>
                            </div>
                            <button className='btn btn-success'>
                                Add
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar2} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Marshall Nichols
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    5 mutual connections
                                </div>
                            </div>
                            <button className='bg-danger text-white p-1 rounded-full'>
                                <IconX className='w-[16px] h-[16px] min-w-[16px]' />
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar5} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Marshall Nichols
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    5 mutual connections
                                </div>
                            </div>
                            <button className='btn btn-success'>
                                Add
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar6} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Marshall Nichols
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    5 mutual connections
                                </div>
                            </div>
                            <button className='btn btn-success'>
                                Add
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar7} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Marshall Nichols
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    5 mutual connections
                                </div>
                            </div>
                            <button className='btn btn-success'>
                                Add
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar3} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Orlando Lentz
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    9 mutual connections
                                </div>
                            </div>
                            <button className='bg-danger text-white p-1 rounded-full'>
                                <IconX className='w-[16px] h-[16px] min-w-[16px]' />
                            </button>
                        </li>
                        <li className='flex gap-4 items-start border border-dashed border-border-color p-4 rounded-xl'>
                            <Image src={avatar4} alt='avatar' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-full' />
                            <div className='flex-1'>
                                <p>
                                    Alexander
                                </p>
                                <div className='text-[14px]/[20px] text-font-color-100'>
                                    18 mutual connections
                                </div>
                            </div>
                            <button className='bg-danger text-white p-1 rounded-full'>
                                <IconX className='w-[16px] h-[16px] min-w-[16px]' />
                            </button>
                        </li>
                    </div>
                </div>
            </div>
        </>
    )
}
