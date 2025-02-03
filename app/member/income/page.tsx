"use client";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import IncomeGrid from "./IncomeGrid";
import TotalAllocation from "./TotalAllocation";
import TabView from '@/app/components/ui/TabView';
import { useState } from 'react';
import AddPlus from '@/app/images/icon/add-plus';
interface Tab {
  label: string;
  content: React.ReactNode;
}

const Income = ()=>{
    

    const authCtx = useAuth();
    const userid:any  = authCtx.userId;

    const [activeTab, setActiveTab] = useState(0);


    const tabs: Tab[] = [
      { 
        label: 'Active Accounts', 
        content: <IncomeGrid />
      } ,   

      { 
        label: 'Closed Accounts', 
        content: <IncomeGrid category={`closed_deleted`}/>
      },

      
      
      
    ];

    

    return(
        
        <DefaultLayout>
            <div className="flex flex-col">
           
            <HolderOne
            title="your income dashboard"            
            linkItems={[
              {
                link:'income/cu',
                title:'add income',
                icon:<AddPlus width={14} height={14} />
              },

              {
                link:'income/bst/cu',
                title:'add income boost',
                icon:<AddPlus width={14} height={14} />
              }
            ]}
            />
            
            


            <div className="lmd:mt-0 md:my-3 md:p-2">

              <TotalAllocation userid={userid}/>

            </div>

            <div className="w-full mt-0 lmd:mt-0 md:mt-5 md:border-[#fafafa] md:border-[2px] md:shadow-1 md:rounded-lg md:p-5">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView  tabs={tabs} align={`left`} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>


            

            

            </div>
        </DefaultLayout>
        
    )

}

export default Income;