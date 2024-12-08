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
  const user_id = authCtx.userId;

  const appCtx = useApp();
  const debtsAccountsScreen = appCtx.debtsAccountsScreen;

  

  const data = {
    debt_balance:'187,200',
    debt_free_date:'MAY 2024',
    financial_frdom_date:'SEPT 2030',
    financial_frdom_target:'1,000,000'
  };

  const [transactioData, setTransactionData] = useState({
    'debt_total_balance':0,
    'month_debt_free':'',
    'financial_frdom_date':'',
    'financial_frdom_target':''
  })

  const fetchDataCallback=useCallback(async()=>{
    //console.log(id);
      const response = await axios.get(`${url}header-summary-data/${user_id}`);
      //return response.data.user;
      setTransactionData(response.data);
            

  },[user_id]);
  useEffect(()=>{
      
      fetchDataCallback();
      

  },[fetchDataCallback,debtsAccountsScreen]);

  

  

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

          {/* <!-- User Area --> */}
          <span className='text-white font-extrabold px-2'>{authCtx.activeMobileNumber}</span>
          {<>

          {/*
          <Link
    href={'/dashboard/profile'}
    className={`text-xs group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
      pathname.slice(-7) =='profile' && 'bg-graydark dark:bg-meta-4'
    }`}
  >
    
    <svg
                className="fill-current"
                width="15"
                height="15"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                  fill=""
                />
                <path
                  d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                  fill=""
                />
              </svg>
              {authCtx.displayName}
  </Link>
  */}
          
  
  </>}
          {authCtx.isLoggedIn && <DropdownUser />}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
