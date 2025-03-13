"use client";
import useAuth from '@/app/hooks/useAuth';
import AdminLayout from "@/app/layout/AdminLayout";


import TabView from "@/app/components/ui/TabView";
import HolderOne from "@/app/layout/HolderOne";
import React, { useState } from 'react';
import UserGrid from "./UserGrid";
import {UserRoles, AdminRoles} from '@/app/data/AdminOptions.json';
const url = process.env.NEXT_PUBLIC_API_URL;
import {  useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';

interface Tab {
  label: string;
  content: React.ReactNode;
}




export default function Clients() {
  const authCtx = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  const UserRole:any = UserRoles;
  const role:number = AdminRoles[0].value; 

  const router = useRouter();

  const logAsUser = (user_id:number, user_role:number)=>{
    authCtx.logAsUser(user_id.toString(),user_role.toString())
    setCookie('AUTH_DATA', {
          'token':authCtx.token,
          'role':user_role          
        });
    router.push('/member')
  }

    const tabs: Tab[] = [
        

      { 
        label: 'members', 
        content: <UserGrid role={UserRole[1].value} logAsUser={logAsUser} />
      },

      { 
        label: 'prospect list', 
        content: <UserGrid role={UserRole[0].value} />
      } , 
      /*
      { 
        label: 'client refer', 
        content: <UserGrid role={UserRole[2].value} />
      },

      { 
        label: 'web hook', 
        content: <UserGrid role={UserRole[3].value} />
      },
      */

      
      
      
    ];

    const linkItems = [
      {
        link: "/admin/clients/cu",
        title: "create client",
      },
      {
        link: "/admin/dashboard",
        title: "dashboard",
      },
      {
        link: "/admin/profile",
        title: "profile",
      },
      ...(role < 2
        ? [
            {
              link: "/admin/admins/cu",
              title: "create admin",
            },
          ]
        : []),
    ];

  

    return(
        <>
        <AdminLayout>
        <div className="flex flex-col">

        <HolderOne
            title="clients"            
            linkItems={linkItems}
            />


          <div className="w-full mt-3 border-[#fafafa] border-[2px] shadow-1 rounded-lg ">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView  tabs={tabs} align={`left`} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>

      



        </div>

        </AdminLayout>
        </>

    )
}