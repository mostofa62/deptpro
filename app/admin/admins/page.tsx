"use client";
import useAuth from '@/app/hooks/useAuth';
import AdminLayout from "@/app/layout/AdminLayout";


import TabView from "@/app/components/ui/TabView";
import HolderOne from "@/app/layout/HolderOne";
import React, { useState } from 'react';
import UserGrid from "./UserGrid";
import {AdminRoles} from '@/app/data/AdminOptions.json';
const url = process.env.NEXT_PUBLIC_API_URL;


interface Tab {
  label: string;
  content: React.ReactNode;
}




export default function Admins() {
  const authCtx = useAuth();
  const role:any  = authCtx.role;

  const [activeTab, setActiveTab] = useState(0);

  const AdminRole:any = AdminRoles;


    const tabs: Tab[] = [
        

      { 
        label: 'admins', 
        content: <UserGrid role={AdminRole[0].value} />
      },

      // { 
      //   label: 'prospect list', 
      //   content: <UserGrid role={UserRole[0].value} />
      // } , 
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
            title="admins"            
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