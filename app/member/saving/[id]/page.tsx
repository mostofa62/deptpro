"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";

import BasicCalendar from "@/app/components/BasicCalender";
import { DataLabel, DataLabelView } from "../cu/DataValidationSchema";
import HolderOne from "@/app/layout/HolderOne";
import SavingContributions from "./SavingContributions";
import DataProgress from "@/app/components/ui/DataProgress";
import Summary from "./Summary";
import SavingBoostGrid from "../SavingBoostGrid";

import TabView from "@/app/components/ui/TabView";
import SavingBoostContributions from "./SavingBoostContributions";
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";
import EditView from "@/app/images/icon/edit-view";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface DebtSuffix{
  goal_amount:number;
  starting_amount:number;
  contribution:number;
  total_balance:number;
  total_balance_xyz:number;
}

interface DebtPrefix{
  interest:number;
}

const url = process.env.NEXT_PUBLIC_API_URL;
export default function SavingDetail({
    params,
    searchParams    
  }:{
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined },    
  
  }) {


    const authCtx = useAuth();
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(0);
   
    
    const id = params.id;
    const user_id:any = authCtx.userId;

    const payload ={
        saving:{},
      
    }

    const SavingWithTransactionData:any = useFetchDropDownObjects({
        urlSuffix:`saving-all/${id}`,
        payLoads:payload
    })

    const datalabel:any = DataLabelView;


    const DataPrefix = {
      goal_amount:'$',
      starting_amount:'$',
      contribution:'$',
      total_balance:'$',
      total_balance_xyz:'$',
    }

    const DebtPrefix = {
      interest:'%'
    }


    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>STARTING DATE</span><span className="ml-4">{SavingWithTransactionData.saving.starting_date_word}</span></div>          
        </div>
      )


      const description_boost = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>GOAL COMPLETED</span><span className="ml-4">{SavingWithTransactionData.saving.goal_reached_word}</span></div>          
        </div>
      )

      const description_next = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>{datalabel.next_contribution_date_word}</span><span className="ml-4">{SavingWithTransactionData.saving.next_contribution_date_word}</span></div>          
        </div>
      )


    let linkItems =[
      {
          link:'/member/saving/cu',
          title:'add savings',
          icon:<AddPlus width={14} height={14} />
      },
      {
      link:'/member/saving',
      title:'your savings dashboard',
      icon:<DashGrid width={16} height={16} />
      },
    ]

    if(
      SavingWithTransactionData.saving.goal_reached==null && 
      SavingWithTransactionData.saving.closed_at==null
    ){
      linkItems.push(...[
        {
          link:`/member/saving/cu/${id}`,
          title:'update savings',
          icon:<EditView width={15} height={15} />
        }
      ])
    }

    const tabs: Tab[] = [       

      { 
        label: 'Boost History', 
        content: <SavingBoostContributions saving_id={id}  />
      },
      
      { 
        label: 'Manage Boosts', 
        content: <SavingBoostGrid saving_id={id}  />
      } 
    ];

    
    return(
        
        <DefaultLayout>

            <div className="flex flex-col">


            <HolderOne
            title="saving details"            
            linkItems={linkItems}
            />


            <div className="mt-3 md:mt-[32px] md:p-5">
              <Summary saving_id={id}
              ProgressData={ {title:DataLabel.progress,
              progress:SavingWithTransactionData.saving.progress,
              color:'#31c4a2',
              maxProgressLength:DataLabel.progress.length}}
        

              />
            </div>
          

            <div className="mt-3 py-2 md:mt-[32px] bg-[#fafafa] rounded-lg flex flex-col lmd:flex-row md:flex-row md:p-5 gap-2.5">

                  <div className="lmd:w-[45%] md:w-[35%] lmd:h-[25%] md:h-[30%] flex flex-col">
                    {/* <div className="p-1">  
                    <BasicCalendar 
                    extraDayData={{[`${SavingWithTransactionData.saving.starting_date
                    }`]:{'title':datalabel.starting_date_word,'description':description()}}} 
                    currentMonth={SavingWithTransactionData.saving.starting_date
                    }
                    />
                    </div> */}
                    {SavingWithTransactionData.saving.goal_reached!=null &&
                        <div className="p-1">
                        <BasicCalendar 
                        extraDayData={{[`${SavingWithTransactionData.saving.goal_reached
                        }`]:{'title':datalabel.goal_reached_word,'description':description_boost()}}} 
                        currentMonth={SavingWithTransactionData.saving.goal_reached
                        }
                        />
                        </div>
                    }

{SavingWithTransactionData.saving.next_contribution_date!=null &&
                        <div className="p-1">
                        <BasicCalendar 
                        extraDayData={{[`${SavingWithTransactionData.saving.next_contribution_date
                        }`]:{'title':datalabel.next_contribution_date_word,'description':description_next()}}} 
                        currentMonth={SavingWithTransactionData.saving.next_contribution_date
                        }
                        />
                        </div>
                    }
                </div>
            


                <div className="lmd:w-[55%] md:w-[65%] md:px-5">

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(datalabel).map((key, index) => (
                        <div key={index} className="bg-white p-2 md:p-4 rounded shadow">
                            <strong>{datalabel[key]}</strong>
                            <p className="mt-1">
                            {/*DebtWithTransactionData.debtAccount[key] !== undefined ? DebtWithTransactionData.debtAccount[key].toString() : '-'*/}
                            {DataPrefix[key as keyof DebtSuffix]}{key in SavingWithTransactionData.saving ? typeof SavingWithTransactionData.saving[key] == 'number'? Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(SavingWithTransactionData.saving[key]) :SavingWithTransactionData.saving[key]?.toString() : '-'}{DebtPrefix[key as keyof DebtPrefix]}
                            </p>
                        </div>
                        ))}
                      {/* <div  className="bg-white p-4 rounded shadow">
                      <DataProgress 
                        title={DataLabel.progress} 
                        progress={SavingWithTransactionData.saving.progress}
                        color={'#31c4a2'}
                        maxProgressLength={DataLabel.progress.length}
                        />
                        </div> */}
                    </div>
                    


                </div>


                

            </div>

            
            <div className="w-full p-1 mt-3 md:mt-[32px] md:border-[#fafafa] md:border-[2px] shadow-1 rounded-lg md:p-5">
            <SavingContributions saving_id={id}  />
            </div>


            <div className="w-full mt-3 md:mt-[32px] md:border-[#fafafa] md:border-[2px] shadow-1 rounded-lg md:p-5">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView align={`left`}  tabs={tabs} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>
            
            
            
            
            </div>

        

            
        </DefaultLayout>


    
        )
}