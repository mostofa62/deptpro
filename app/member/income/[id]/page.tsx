"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";

import BasicCalendar from "@/app/components/BasicCalender";
import { DataLabelView } from "../cu/DataValidationSchema";
import HolderOne from "@/app/layout/HolderOne";
import IncomeTransactions from "./IncomeTransactions";
import Summary from "./Summary";
import IncomeBoostGrid from "../IncomeBoostGrid";
import TabView from "@/app/components/ui/TabView";
import IncomeBoostTransactions from "./IncomeBoostTransactions";

interface Tab {
  label: string;
  content: React.ReactNode;
}


interface DebtRow {
 
  income_source:string,
  earner:string,
  gross_income:number,
  net_income:number,   
  pay_date:string,
  repeat:string,
  note:string,
  total_gross_income:number,
  total_net_income:number,
  
}

const url = process.env.NEXT_PUBLIC_API_URL;
export default function IncomeDetail({
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
        income:{},
      
    }

    const IncomeWithTransactionData:any = useFetchDropDownObjects({
        urlSuffix:`income-all/${id}`,
        payLoads:payload
    })

    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div className="mt-2"><span>{IncomeWithTransactionData.income.pay_date_word}</span></div>          
        </div>
      )


      const descriptionNext = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div className="mt-2"><span>{IncomeWithTransactionData.income.next_pay_date_word}</span></div>          
        </div>
      )


     

    const datalabel:any = DataLabelView;

    const DataPrefix = {
      income_source:'',
      earner:'',
      gross_income:'$',
      net_income:'$',   
      pay_date:'',
      repeat:'',
      note:'',
      total_gross_income:'$',
      total_net_income:'$',
    }

    const tabs: Tab[] = [       

      { 
        label: 'Boost History', 
        content: <IncomeBoostTransactions income_id={id}  />
      },
      
      { 
        label: 'Manage Boosts', 
        content: <IncomeBoostGrid income_id={id}  />
      } 
    ];

    return(
        
        <DefaultLayout>

            <div className="grid grid-flow-row">


            <HolderOne
            title="income details"            
            linkItems={[
              {
                link:'/member/income',
                title:'income dashboard'
              },
              {
                link:'income/cu',
                title:'add income'
              },
              {
                link:`/member/income/cu/${id}`,
                title:'update income'
              },
            ]}
            />

            <div className="mt-[32px] p-5">
              <Summary income_id={id}              
        

              />
            </div>
            


            <div className="mt-[32px] bg-[#fafafa] rounded-lg flex p-5">

                <div className="w-[35%] h-[30%] flex flex-col">
                    {/* <div className="p-1">  
                    <BasicCalendar 
                    extraDayData={{[`${IncomeWithTransactionData.income.pay_date
                    }`]:{'title':`Pay date`,'description':description()}}} 
                    currentMonth={IncomeWithTransactionData.income.pay_date
                    }
                    />
                    </div> */}


                    <div className="p-1">  
                    <BasicCalendar 
                    extraDayData={{[`${IncomeWithTransactionData.income.next_pay_date
                    }`]:{'title':`Next Pay date`,'description':descriptionNext()}}} 
                    currentMonth={IncomeWithTransactionData.income.next_pay_date
                    }
                    />
                    </div>
                    
                </div>
            


                <div className="w-[65%] px-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(datalabel).map((key, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow">
                            <strong>{datalabel[key]}</strong>
                            <p className="mt-1">
                            {/*DebtWithTransactionData.debtAccount[key] !== undefined ? DebtWithTransactionData.debtAccount[key].toString() : '-'*/}
                            {DataPrefix[key as keyof DebtRow]}{key in IncomeWithTransactionData.income ? typeof IncomeWithTransactionData.income[key] == 'number'? IncomeWithTransactionData.income[key]?.toFixed(2) :IncomeWithTransactionData.income[key]?.toString() : '-'}
                            </p>
                        </div>
                        ))}
                    </div>


                </div>

                

            </div>

            <div className="w-full mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
              <IncomeTransactions income_id={id}  />
            </div>


            <div className="w-full mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
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