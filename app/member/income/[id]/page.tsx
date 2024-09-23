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
        urlSuffix:`income-all/${id}`,
        payLoads:payload
    })

    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>NEXT PAY DATE</span><span className="ml-4">{IncomeWithTransactionData.income.next_pay_date}</span></div>          
        </div>
      )


      const description_boost = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>NEXT BOOST DATE</span><span className="ml-4">{IncomeWithTransactionData.income.next_boost_date}</span></div>          
        </div>
      )

    const datalabel:any = DataLabelView;

    return(
        
        <DefaultLayout>

            <div className="grid grid-flow-row">


            <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[40%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                            INCOME DETails
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/income'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">Income Accounts</p>
                        </Link>
                        </div>

                        <div>
                        <Link
                            href={'income/cu'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Add Income</p>
                        </Link>
                        </div>

                        <div>
                        <Link
                            href={`/member/income/cu/${id}`}
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
                    extraDayData={{[`${IncomeWithTransactionData.income.pay_date
                    }`]:{'title':`Pay date`,'description':description()}}} 
                    currentMonth={IncomeWithTransactionData.income.pay_date
                    }
                    />
                    </div>
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