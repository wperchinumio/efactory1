import React, { useState } from 'react'
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});
import 'react-quill/dist/quill.snow.css';
import EmailSidebar from './EmailSidebar'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link';

export default function EmailCompose() {

    const [emailSide, setEmailSide] = useState(false)
    const emailSideToggle = () => {
        setEmailSide(!emailSide)
    }

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],

        ['blockquote', 'code-block'],

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],

        [{ 'align': [] }],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        ['link', 'image'],

        [{ 'script': 'sub' }, { 'script': 'super' }],
    ];

    return (
        <div className='flex'>
            <EmailSidebar emailSide={emailSide} />
            <div className='flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar'>
                <div className='container-fluid'>
                    <div className='flex items-center justify-between gap-2 md:mb-6 mb-4'>
                        <Link href="/app/email" title='Back' className='text-primary flex items-center gap-2'>
                            <IconArrowLeft className='stroke-[3] rtl:rotate-180' />
                            Back to Inbox
                        </Link>
                        <button onClick={emailSideToggle} className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${emailSide ? 'opened' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 100 100">
                                <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                <path className="line line2" d="M 20,50 H 80" />
                                <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                            </svg>
                        </button>
                    </div>
                    <div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color'>
                        <p className='mb-10 font-semibold'>
                            New Message
                        </p>
                        <div className='floating-form-control mb-10'>
                            <input type='email' id='composeEmail' className='form-input' placeholder="Email To" />
                            <label htmlFor='composeEmail' className='form-label'>Email To</label>
                        </div>
                        <div className='floating-form-control mb-10'>
                            <input type='text' id='composeSubject' className='form-input' placeholder="Subject" />
                            <label htmlFor='composeSubject' className='form-label'>Subject</label>
                        </div>
                        <div className='mb-30'>
                            <ReactQuill
                                modules={{ toolbar: toolbarOptions }}
                                className='bg-bg-light'
                                defaultValue="
                                <p>
                                    Hello There !
                                </p>
                                <p>
                                    The toolbar can be customized and it also supports various callbacks such as 
                                    <span style='color: red;'>oninit</span>, 
                                    <span style='color: red;'>onfocus</span>, 
                                    <span style='color: red;'>onpaste</span> 
                                    and many more.
                                </p>
                                <br/>
                                <p>
                                    Please try 
                                    <b>paste some texts</b>
                                    here
                                </p>
                            "
                            />
                        </div>
                        <div className='flex items-stretch gap-2'>
                            <button className='btn btn-primary'>
                                Send
                            </button>
                            <button className='btn btn-outline-secondary'>
                                Schedule Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
