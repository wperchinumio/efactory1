import React, { useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import {
    IconBrandTwitterFilled,
    IconPencil,
} from '@tabler/icons-react';
import {
    profile_av,
} from '/public/images';
import Image from 'next/image';

export default function Setting() {

    const [editUser, setEditUser] = useState(profile_av);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditUser(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const breadcrumbItem = [
        {
            name: "Account",
        },
        {
            name: "Setting",
        },
    ]

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='grid lg:grid-cols-[1fr_2.5fr] grid-cols-1 gap-6 items-start'>
                    <ul className='card bg-card-color md:sticky md:top-100 border border-dashed border-border-color rounded-md'>
                        <li className='border-b border-dashed border-border-color last:border-none'>
                            <a href="#accountSettingProfile" className='block py-3 px-4'>
                                Profile Details
                            </a>
                        </li>
                        <li className='border-b border-dashed border-border-color last:border-none'>
                            <a href="#accountSettingPassword" className='block py-3 px-4'>
                                Change Password
                            </a>
                        </li>
                        <li className='border-b border-dashed border-border-color last:border-none'>
                            <a href="#accountNotificationSetting" className='block py-3 px-4'>
                                Notifications Settings
                            </a>
                        </li>
                        <li className='border-b border-dashed border-border-color last:border-none'>
                            <a href="#socialProfileSetting" className='block py-3 px-4'>
                                Social Profiles
                            </a>
                        </li>
                    </ul>
                    <div className='flex flex-col md:gap-12 gap-6'>
                        <div id='accountSettingProfile' className='relative rounded-xl border border-dashed border-border-color p-4'>
                            <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">Profile Details</span>
                            <div className='card bg-card-color rounded-xl'>
                                <div className='md:p-6 p-4 flex flex-col gap-4'>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Avatar
                                        </label>
                                        <div className='sm:w-[120px] sm:h-[120px] sm:min-w-[120px] w-[100px] h-[100px] min-w-[100px] relative'>
                                            <Image src={editUser} alt='avatar' width="120" height="120" className='w-full h-full object-cover rounded-xl' />
                                            <button className='absolute sm:right-10 sm:bottom-10 right-5 bottom-5 p-5 shadow-lg bg-white rounded-full'>
                                                <input
                                                    type='file'
                                                    id='editProfile'
                                                    onChange={handleFileChange}
                                                    className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer'
                                                />
                                                <label htmlFor='editProfile' className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer' />
                                                <IconPencil className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Full Name *
                                        </label>
                                        <div className='grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2'>
                                            <div className="form-control">
                                                <input type="text" className="form-input" placeholder="Chris" defaultValue="Chris" />
                                            </div>
                                            <div className="form-control">
                                                <input type="text" className="form-input" placeholder="Morise" defaultValue="Morise" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Company *
                                        </label>
                                        <div className="form-control">
                                            <input type="text" className="form-input" placeholder="swtift pro" defaultValue="swtift pro" />
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Contact Phone *
                                        </label>
                                        <div className="form-control">
                                            <input type="text" className="form-input" placeholder="+01 (741) 852 123" defaultValue="+01 (741) 852 123" />
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Company Site
                                        </label>
                                        <div className="form-control">
                                            <input type="text" className="form-input" placeholder="www.swtiftpro.com" defaultValue="www.swtiftpro.com" />
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Country *
                                        </label>
                                        <select className="form-select cursor-pointer rounded-md bg-card-color py-3 ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                            <option value="">-- Select Country --</option>
                                            <option value="AF">Afghanistan</option>
                                            <option value="AX">Åland Islands</option>
                                            <option value="AL">Albania</option>
                                        </select>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            State/Province *
                                        </label>
                                        <select className="form-select cursor-pointer rounded-md bg-card-color py-3 ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                            <option >California</option>
                                            <option >Alaska</option>
                                            <option >Åland Islands</option>
                                            <option >Alabama</option>
                                        </select>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Time Zone *
                                        </label>
                                        <select className="form-select cursor-pointer rounded-md bg-card-color py-3 ps-15 pe-30 text-[14px]/[20px] appearance-none border border-border-color focus:outline-0 focus:border-primary">
                                            <option value="">Select a Timezone..</option>
                                            <option value="International Date Line West">(GMT-11:00) International Date Line West</option>
                                            <option value="Midway Island">(GMT-11:00) Midway Island</option>
                                            <option value="Samoa">(GMT-11:00) Samoa</option>
                                        </select>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Communication *
                                        </label>
                                        <div className='flex gap-6 flex-wrap'>
                                            <div className="form-check">
                                                <input type="checkbox" id='accountSettingPhone' className="form-check-input" />
                                                <label htmlFor='accountSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" id='accountSettingEmail' className="form-check-input" />
                                                <label htmlFor='accountSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-[1fr_3fr] grid-cols-1 gap-2'>
                                        <label>
                                            Available for freelance ?
                                        </label>
                                        <div className="form-check form-switch">
                                            <input type="checkbox" id='accountSettingAvail' className="form-check-input" />
                                            <label htmlFor='accountSettingAvail' className="form-check-label !text-[16px]/[24px]">Yes, advertise my availability on my profile page</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='md:p-6 p-4 flex justify-end flex-wrap gap-4 border-t border-dashed border-border-color'>
                                    <button className='btn btn-white !border-border-color large'>
                                        Discard
                                    </button>
                                    <button className='btn btn-primary large'>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id='accountSettingPassword' className='relative rounded-xl border border-dashed border-border-color p-4'>
                            <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">Change Password</span>
                            <div className='card bg-card-color rounded-xl'>
                                <div className='md:p-6 p-4'>
                                    <div className='grid md:grid-cols-3 grid-cols-1 md:gap-4 gap-2'>
                                        <div className="form-control">
                                            <input type="text" className="form-input" placeholder="louispierce" defaultValue="louispierce" disabled />
                                        </div>
                                        <div className="form-control">
                                            <input type="text" className="form-input" placeholder="louis.info@yourdomain.com" defaultValue="louis.info@yourdomain.com" />
                                        </div>
                                        <div className="form-control">
                                            <input type="number" className="form-input" placeholder="Phone Number" />
                                        </div>
                                    </div>
                                    <div className='md:mt-6 mt-4 border-t border-border-color'>
                                        <p className='py-2'>
                                            Change Password
                                        </p>
                                        <div className="form-control mb-4">
                                            <input type="password" className="form-input" placeholder="Current Password" />
                                        </div>
                                        <div className="form-control mb-1">
                                            <input type="password" className="form-input" placeholder="New Password" />
                                        </div>
                                        <div className="form-control">
                                            <input type="password" className="form-input" placeholder="Confirm New Password" />
                                            <span className="text-font-color-100 small">Minimum 8 characters</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='md:p-6 p-4 flex justify-end flex-wrap gap-4 border-t border-dashed border-border-color'>
                                    <button className='btn btn-white !border-border-color large'>
                                        Discard
                                    </button>
                                    <button className='btn btn-primary large'>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id='accountNotificationSetting' className='relative rounded-xl border border-dashed border-border-color p-4'>
                            <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">Notifications Settings</span>
                            <div className='card bg-card-color rounded-xl'>
                                <div className='md:p-6 p-4'>
                                    <div className='overflow-auto'>
                                        <table className='w-full min-w-[400px]'>
                                            <tbody>
                                                <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-font-color-100'>
                                                        Email Notifications
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='emailNotiSettingEmail' className="form-check-input" defaultChecked />
                                                            <label htmlFor='emailNotiSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='emailNotiSettingPhone' className="form-check-input" defaultChecked />
                                                            <label htmlFor='emailNotiSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-font-color-100'>
                                                        Billing Updates
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='billNotiSettingEmail' className="form-check-input" />
                                                            <label htmlFor='billNotiSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='billNotiSettingPhone' className="form-check-input" />
                                                            <label htmlFor='billNotiSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-font-color-100'>
                                                        New Team Members
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='newMemberNotiSettingEmail' className="form-check-input" />
                                                            <label htmlFor='newMemberNotiSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='newMemberNotiSettingPhone' className="form-check-input" />
                                                            <label htmlFor='newMemberNotiSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-font-color-100'>
                                                        Projects Complete
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='projectNotiSettingEmail' className="form-check-input" />
                                                            <label htmlFor='projectNotiSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='projectNotiSettingPhone' className="form-check-input" defaultChecked />
                                                            <label htmlFor='projectNotiSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-dashed border-border-color last:border-b-0'>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0 text-font-color-100'>
                                                        Newsletters
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='newsletterNotiSettingEmail' className="form-check-input" />
                                                            <label htmlFor='newsletterNotiSettingEmail' className="form-check-label !text-[16px]/[24px]">Email</label>
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4 border-e border-dashed border-border-color last:border-e-0'>
                                                        <div className="form-check">
                                                            <input type="checkbox" id='newsletterNotiSettingPhone' className="form-check-input" defaultChecked />
                                                            <label htmlFor='newsletterNotiSettingPhone' className="form-check-label !text-[16px]/[24px]">Phone</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='md:p-6 p-4 flex justify-end flex-wrap gap-4 border-t border-dashed border-border-color'>
                                    <button className='btn btn-white !border-border-color large'>
                                        Discard
                                    </button>
                                    <button className='btn btn-primary large'>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id='socialProfileSetting' className='relative rounded-xl border border-dashed border-border-color p-4'>
                            <span className="bg-body-color text-font-color-100 px-5 font-semibold absolute top-[-14px]">Social Profiles</span>
                            <div className='card bg-card-color rounded-xl'>
                                <div className='md:p-6 p-4'>
                                    <div className="form-control mb-4">
                                        <label className='mb-2 inline-block'>
                                            Twitter
                                        </label>
                                        <input type="text" className="form-input" />
                                        <button className='btn btn-info my-5'>
                                            <IconBrandTwitterFilled className='w-[16px] h-[16px] min-w-[16px]' />
                                            Connect to Twitter
                                        </button>
                                        <div className='small text-font-color-100'>One-click sign in</div>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className='mb-2 inline-block'>
                                            Facebook
                                        </label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className='mb-2 inline-block'>
                                            Behance
                                        </label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className='mb-2 inline-block'>
                                            LinkedIn
                                        </label>
                                        <input type="text" className="form-input" />
                                    </div>
                                </div>
                                <div className='md:p-6 p-4 flex justify-end flex-wrap gap-4 border-t border-dashed border-border-color'>
                                    <button className='btn btn-white !border-border-color large'>
                                        Discard
                                    </button>
                                    <button className='btn btn-primary large'>
                                        Update Social Profiles
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
