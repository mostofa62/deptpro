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
export default function SavingDetail({
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
        saving:{},
      
    }

    const SavingWithTransactionData:any = useFetchDropDownObjects({
        urlSuffix:`saving-boost-all/${id}`,
        payLoads:payload
    })

    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>BOOST DATE</span><span className="ml-4">{SavingWithTransactionData.saving.pay_date_boost_word}</span></div>          
        </div>
      )


      

    const datalabel:any = DataLabelView;

    return(
        
        <DefaultLayout>

            <div className="grid grid-flow-row">


            <HolderOne
            title="saving details"            
            linkItems={[
                {
                    link:'/member/saving/cu',
                    title:'add savings'
                },
                {
                link:'/member/saving',
                title:'your savings dashboard'
                },
                {
                link:`/member/saving/cu/${id}`,
                title:'update savings'
                }
            ]}
            />


            <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[40%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                            SAVING DETails
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/saving'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">Saving Accounts</p>
                        </Link>
                        </div>

                        <div>
                        <Link
                            href={'saving/cu'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Add Saving</p>
                        </Link>
                        </div>

                        <div>
                        <Link
                            href={`/member/saving/cu/${id}`}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Update</p>
                        </Link>
                        </div>
                    </div>

              </div>

            </div>


            <div className="mt-[32px] bg-[#fafafa] rounded-lg flex p-5">

                <div className="w-[35%] h-[30%] flex flex-col">
                    <div className="p-1">  
                    <BasicCalendar 
                    extraDayData={{[`${SavingWithTransactionData.saving.pay_date_boost
                    }`]:{'title':`Pay date`,'description':description()}}} 
                    currentMonth={SavingWithTransactionData.saving.pay_date_boost
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
                            {key in SavingWithTransactionData.saving ? SavingWithTransactionData.saving[key]?.toString() : '-'}
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