"use client";
import useAuth from "./useAuth";
import { ReactNode, useEffect, useState } from 'react';
import Link from "next/link";
import axios from "axios";
import Image from 'next/image';
import Logo from '../images/logo/logo.svg';
import { getCookie } from 'cookies-next';

import { useRouter, usePathname } from "next/navigation";

interface DefaultLayoutProps {
    children: ReactNode;
}
const url = process.env.url;
  
//const useProtection = (path:string) => {
const UseAuthRoute = ({ children }: DefaultLayoutProps) => {

        
    const authCtx = useAuth();
    const role:any = authCtx.role;
    const router = useRouter();
    const path = usePathname();
    let redirect:any = '/';
    let showChildren = true;
    const isCookieSet  = !!getCookie('AUTH_DATA');

    const isLoggedIn = authCtx.isLoggedIn;

    
   

   
    if(isLoggedIn && isCookieSet){
        //alert(parseInt(role));
        if(path == "/"){
            //alert(path)
            redirect = parseInt(role) < 10 ?"/admin/dashboard":"/member/dashboard";
            showChildren=false;

        }
        //console.log(path.substring(1,4))
        if(parseInt(role) < 10 && path.includes('member')){
            redirect = "/admin/dashboard";
            showChildren=false;

        }

        if(parseInt(role) >=10 && path.substring(1,6)=='admin'){
            redirect = "/member/dashboard";
            showChildren=false;

        }
    }
    else if(isLoggedIn && !isCookieSet){
            
      authCtx.logout()
    }
    
    

   //router.push(redirect);
    const redirect_dom =<div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidde">
        
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          
          <main>
            <div className="mx-auto">
            <div className="flex flex-col items-center justify-between gap-4 min-h-60 bg-zinc-800 w-full max-w-1xl py-2 px-4 rounded-xl h-fit">
            <Image src={Logo} alt="Logo" />

            </div>
            <div className="flex flex-col items-center justify-between gap-4 min-h-60 bg-zinc-800 w-full max-w-1xl py-2 px-4 rounded-xl h-fit">

            <h2 className="mb-2 text-justify mt-0 text-4xl font-medium leading-tight text-[#f1e56c]">
Please wait , we are automatically taking you there, or you can click the below link</h2>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 min-h-60 bg-zinc-800 w-full max-w-1xl py-2 px-4 rounded-xl h-fit">

<Link   className="inline-block rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-[#f1e56c] transition duration-150 ease-in-out hover:border-[#f1e56c] hover:bg-neutral-500 hover:bg-opacity-10 focus:border-[#f1e56c] focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-[#f1e56c] dark:hover:bg-opacity-10"
 href={redirect} >
Get me there
</Link>
</div>
            </div>
          </main>
        </div>
      </div>
     </div>
    
       
    

    return(
        <>        
        {showChildren ? <>{children}</>:redirect_dom}
        </>
    )
};
  
export default UseAuthRoute;
