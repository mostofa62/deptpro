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

   
    
    const id = params.id;
    const user_id:any = authCtx.userId;

    const payload ={
        income:{},
      
    }

    const IncomeWithTransactionData:any = useFetchDropDownObjects({
        urlSuffix:`income-boost-all/${id}`,
        payLoads:payload
    })

   

      const description_boost = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>NEXT BOOST DATE</span><span className="ml-4">{IncomeWithTransactionData.income.pay_date_boost}</span></div>          
        </div>
      )

    const datalabel:any = DataLabelView;

    return(
        
        <DefaultLayout>

            <div className="grid grid-flow-row">


            <HolderOne
            title="income boost details"            
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
                link:`/member/income/bst/cu/${id}`,
                title:'update income boost'
              },
            ]}
            />


            


            <div className="mt-[32px] bg-[#fafafa] rounded-lg flex p-5">

                <div className="w-[35%] h-[30%] flex flex-col">
                    
                    {IncomeWithTransactionData.income.pay_date_boost!=null &&
                        <div className="p-1">
                        <BasicCalendar 
                        extraDayData={{[`${IncomeWithTransactionData.income.pay_date_boost
                        }`]:{'title':`Pay date Boost`,'description':description_boost()}}} 
                        currentMonth={IncomeWithTransactionData.income.pay_date_boost
                        }
                        />
                        </div>
                    }
                </div>
            


                <div className="w-[65%] px-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(datalabel).map((key, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow">
                            <strong>{datalabel[key]}</strong>
                            <p className="mt-1">
                            {/*DebtWithTransactionData.debtAccount[key] !== undefined ? DebtWithTransactionData.debtAccount[key].toString() : '-'*/}
                            {key in IncomeWithTransactionData.income ? IncomeWithTransactionData.income[key]?.toString() : '-'}
                            </p>
                        </div>
                        ))}
                    </div>


                </div>

            </div>

            
            
            
            
            
            
            </div>

        

            
        </DefaultLayout>


    
        )
}