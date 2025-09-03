import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../partial/Header'
import Sidebar from '../partial/Sidebar'
import Footer from '../partial/Footer'

export default function Layout({ children }) {
  const router = useRouter();
  const [container, setContainer] = useState(() => {
    // Initialize state from localStorage
    return typeof localStorage !== "undefined" && localStorage.getItem('container') === 'true';
  });

  useEffect(() => {
    // Update the container class based on state
    const containerElements = document.querySelectorAll('.container, .container-fluid');
    containerElements.forEach(el => {
      if (container) {
        el.classList.add('container');
        el.classList.remove('container-fluid');
      } else {
        el.classList.add('container-fluid');
        el.classList.remove('container');
      }
    });
    localStorage.setItem('container', container);
  }, [container, router.pathname]); // Update on container state or pageUrl change

  const containerToggle = () => {
    setContainer(prev => !prev);
  };

  const [mobileNav, setMobileNav] = useState(false);
  const toggleMobileNav = () => setMobileNav(prev => !prev);

  const [note, setNote] = useState(false);
  const toggleNote = () => setNote(prev => !prev);

  const [chat, setChat] = useState(false);
  const toggleChat = () => setChat(prev => !prev);

  return (
    <div className='admin-wrapper overflow-hidden'>
      <div className='flex h-svh relative'>
        <div className={`sidebar sm:w-[280px] sm:min-w-[280px] w-full px-2 py-4 overflow-y-scroll flex flex-col custom-scrollbar xl:static fixed xl:h-screen md:h-[calc(100vh-74px)] h-[calc(100vh-64px)] md:top-[74px] top-[64px] z-[3] bg-body-color xl:shadow-none transition-all duration-300 ${mobileNav ? 'shadow-shadow-lg left-0' : '-left-full'}`}>
          <Sidebar setMobileNav={setMobileNav} note={note} toggleNote={toggleNote} chat={chat} toggleChat={toggleChat} />
        </div>
        <div className='main flex-1 flex flex-col overflow-auto custom-scrollbar bg-body-color'>
          <Header toggleMobileNav={toggleMobileNav} mobileNav={mobileNav} toggleNote={toggleNote} toggleChat={toggleChat} containerToggle={containerToggle} container={container} />
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}
