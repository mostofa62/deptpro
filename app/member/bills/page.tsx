"use client";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import { useState } from 'react';

import TabView from "@/app/components/ui/TabView";
import HolderOne from "@/app/layout/HolderOne";
import BillGrid from "./BillGrid";
import TotalAllocation from "./TotalAllocation";
import AddPlus from '@/app/images/icon/add-plus';

interface Tab {
  label: string;
  content: React.ReactNode;
}


export default function Bill() {
    const authCtx = useAuth();

    const userid:any  = authCtx.userId;

    const [activeTab, setActiveTab] = useState(0);

    
    const tabs: Tab[] = [
      { 
        label: 'Active Accounts', 
        content: <BillGrid />
      } ,   

      { 
        label: 'Closed Accounts', 
        content: <BillGrid category={`closed_deleted`}/>
      },

      
      
      
    ];

          

    return(
        <>
        <DefaultLayout>
        <div className="flex flex-col">


        <HolderOne
            title="your bill dashboard"            
            linkItems={[
              {
                link:'bills/cu',
                title:'add bill',
                icon:<AddPlus width={14} height={14} />
              }
            ]}
            />


       

           

            <div className="md:my-3 p-2">

              <TotalAllocation userid={userid} />

            </div>

            <div className="w-full md:mt-3 border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView  tabs={tabs} align={`left`} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>

       

            
        </div>

        </DefaultLayout>
        </>

    )
}