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
            <div className="flex flex-col md:grid grid-flow-row">
           
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
            
            


            <div className="md:my-5 md:p-2">

              <TotalAllocation userid={userid}/>

            </div>

            <div className="w-full mt-2.5 md:mt-[32px] md:border-[#fafafa] md:border-[2px] md:shadow-1 md:rounded-lg md:p-5">
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