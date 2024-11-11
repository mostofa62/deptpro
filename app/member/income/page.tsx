"use client";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import IncomeGrid from "./IncomeGrid";
import TotalAllocation from "./TotalAllocation";
import TabView from '@/app/components/ui/TabView';
import { useState } from 'react';
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
            <div className="grid grid-flow-row">
           
            <HolderOne
            title="your income dashboard"            
            linkItems={[
              {
                link:'income/cu',
                title:'add income'
              },

              {
                link:'income/bst/cu',
                title:'add income boost'
              }
            ]}
            />
            
            


            <div className="mt-5 p-2 mb-5">

              <TotalAllocation userid={userid}/>

            </div>

            <div className="w-full mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
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