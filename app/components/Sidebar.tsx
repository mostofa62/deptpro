'use client';

import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/app/images/logo/logo.svg';

import useAuth from '@/app/hooks/useAuth';
import SidebarLinkGroup from './SidebarLinkGroup';

const url = process.env.NEXT_PUBLIC_API_URL;

const app_name:any = process.env.app_name;
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  
  const pathname  = usePathname();
  const authCtx = useAuth();
  const router = useRouter();

  
  const [callStatus, setCallStatus] =  useState(false);
  let Loguser:any = authCtx.role;

  

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  let storedSidebarExpanded:any= null;
    

  


   const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleClickReload = (e:any, href:string) => {
    e.preventDefault();

    // Force a reload by navigating to the current URL
    router.replace(href);
  };


  

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-65 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6">
        
        {/*
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
        */}
        <Image src={Logo} alt={app_name} className="" height={50}  />
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6 min-h-screen">
          {/* <!-- Menu Group --> */}
          <div>
            {/*
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
    */}
    
            <ul className="mb-6 flex flex-col gap-1.5">

              {/* <!-- Menu Item Calendar --> */}
              


<li key={1}>
  <Link
    href={(Loguser && parseInt(Loguser) < 10 )?'/admin/dashboard':'/member/dashboard'}
    className={`uppercase text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#0a4a82] duration-300 ease-in-out hover:bg-[#0a4a82] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
      pathname.substring(1,pathname.length)=='dashboard' && 'bg-[#0a4a82] text-[#f5f5f8]'
    }`}
  >
    
    Dashboard
  </Link>
</li>

{(Loguser && parseInt(Loguser) < 10 ) &&
<>
<li key={20}>
  <Link
    href={'/admin/clients'}
    className={`uppercase text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#0a4a82] duration-300 ease-in-out hover:bg-[#0a4a82] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
      pathname.includes('clients') && 'bg-[#0a4a82] text-[#f5f5f8]'
    }`}
  >
  Clients
  </Link>
</li>
</>
}

{(Loguser && parseInt(Loguser) >= 10 ) &&
<>


<SidebarLinkGroup
                activeCondition={
                  pathname === '/debts' || pathname.includes('debts')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                       

                        className={`uppercase text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#0a4a82] duration-300 ease-in-out hover:bg-[#0a4a82] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                          (pathname === '/debts' ||
                            pathname.includes('debts')) && 'bg-[#0a4a82] text-[#f5f5f8]'
                        }`}

                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        
                                              
                        <span className=''>DEBTS</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                        

<li key={101}>
  <Link
    href={'/member/debts'}
    className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#0166FF] ${
      pathname.slice(-5) =='debts' ?'text-[#0166FF]':'text-[#4F4F4F]'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

      <p>DEBT Accounts</p>
  </Link>
</li>





<li key={102}>
  <Link
    href={'/member/debts/cu'}
    className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#0166FF] ${
      pathname.slice(-2) =='cu' ? 'text-[#0166FF]':'text-[#4F4F4F]'
    }`}
  >
    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

      <p>Add Debts</p>
  </Link>
</li>


<li key={103}>
  <Link
    href={'/member/debts/settings'}
    className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#0166FF] ${
      pathname.slice(-8) =='settings' ? 'text-[#0166FF]':'text-[#4F4F4F]'
    }`}
  >
    

<svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
</svg>


      <p>Settings</p>
  </Link>
</li>




                          
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>



<SidebarLinkGroup
                activeCondition={
                  pathname === '/bills' || pathname.includes('bills')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                       

                        className={`uppercase text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#0a4a82] duration-300 ease-in-out hover:bg-[#0a4a82] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                          (pathname === '/bills' ||
                            pathname.includes('bills')) && 'bg-[#0a4a82] text-[#f5f5f8]'
                        }`}

                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        
                                              
                        <span className=''>Bills</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                        

<li key={211}>
  <Link
    href={'/member/bills'}
    className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#0166FF] ${
      pathname.slice(-5) =='bills' ?'text-[#0166FF]':'text-[#4F4F4F]'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

      <p>Bill Accounts</p>
  </Link>
</li>





<li key={222}>
  <Link
    href={'/member/bills/cu'}
    className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#0166FF] ${
      pathname.slice(-2) =='cu' ? 'text-[#0166FF]':'text-[#4F4F4F]'
    }`}
  >
    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

      <p>Add Bill</p>
  </Link>
</li>




                          
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>


</>
}

            
            </ul>

          

 

    
          </div>

                    
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
