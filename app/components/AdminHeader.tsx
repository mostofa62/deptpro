import Link from 'next/link';
import LogoIcon from '@/app/images/logo/logo-icon.svg';
import Logo from '@/app/images/logo/logo.svg';
import DropdownUser from './DropdownUser';
import Image from 'next/image';
import useAuth from '@/app/hooks/useAuth';
import axios from 'axios';
import { useRouter,usePathname } from 'next/navigation';
import { useEffect,useCallback, useState } from 'react';
import useApp from '../hooks/useApp';
import CoinSvg from '../images/icon/coin';
import ArrowGraph from '../images/icon/arrowgraph';
import DropdownAdmin from './DropdownAdmin';

//const APP_KEY:any = process.env.pusher_app_key;
//const APP_CLUSTER:any = process.env.pusher_app_cluster;


const app_name:any = process.env.app_name;
const url = process.env.NEXT_PUBLIC_API_URL;




const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {

  
  const location = useRouter();
  const pathname  = usePathname();

  const authCtx = useAuth();
  const user_id = authCtx.adminId;

  const appCtx = useApp();


  

  

  

  

  return (
    <header className="sticky top-0 z-999 flex w-full bg-[#43ACD6]">
      <div className="flex flex-grow items-center justify-between py-2 px-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden mx-28 text-white" href={'/dashboard'}>
            <Image  src={LogoIcon} alt={app_name} height={50} />
          </Link>
        </div>

        <div className="hidden sm:block">

        <div className="grid grid-cols-2 gap-4 h-auto">
  
  <div className="grid grid-rows-3 grid-flow-col h-[50px] uppercase text-center">
    <div className="row-span-3">
      
    </div>
    <div className="col-span-2 ml-[8px]">
      
    </div>
    <div className="row-span-2 col-span-2 ml-[8px] mt-[8px]">
     
    </div>
  </div>

  
  <div className="grid grid-rows-2 h-[50px] uppercase text-center">
    <div className='ml-[5px] mt-[-1px]'>
      
    </div>
    <div className='ml-[5px] mt-[-2px]'>
     
    </div>
  </div>

  
</div>

    
        </div>

        <div className="flex items-center">
          <ul className="flex items-center uppercase">
    

          <li className="relative left-2">

          <div className="grid grid-rows-3 grid-flow-col h-[50px] uppercase text-center">

            <div className="row-span-3">

              

            </div>

            <div className="col-span-2 ml-[8px]">
               

            </div>
            <div className="row-span-2 col-span-2 ml-[5px] mt-[8px]">

             

            </div>
          </div>

            
            
            
          </li>


          <li className="relative left-6">

            <div className="grid grid-flow-row text-center">
              <div className='mt-[-6px]'>
                
              </div>
              <div className='mt-[-5px]'>

             

              </div> 

            </div>
            
            
          </li>

            {/* <!-- Dark Mode Toggler --> */}
            {/*
            <DarkModeSwitcher />
              */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/*
            <DropdownNotification />
            */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/*
            <DropdownMessage />
          */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          
          {authCtx.isLoggedIn && <DropdownAdmin />}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
