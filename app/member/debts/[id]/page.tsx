"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import Summary from "./Summary.";
import BasicCalendar from "@/app/components/BasicCalender";
import { DataLabelUpdate, DataLabelView } from "../cu/DataValidationSchema";




interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate({
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
      debtaccounts:{},
      debttrasactions: [],
      left_to_go: 0,
      paid_off_percentage:0,
    }

    const DebtWithTransactionData:any = useFetchDropDownObjects({
        urlSuffix:`debt-all/${id}`,
        payLoads:payload
    })

    
    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>DUE DATE</span><span className="ml-4">{DebtWithTransactionData.debtaccounts.due_date}</span></div>
          <div><span>Name</span><span className="ml-4">{DebtWithTransactionData.debtaccounts.name}</span></div>
          <div><span>Balance</span><span className="ml-4">$</span><span className="ml-1">{Intl.NumberFormat('en-US').format(DebtWithTransactionData.debtaccounts.balance)}</span></div>
        </div>
      )
  
   
    const datalabel:any = DataLabelView;
  
    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">

        
        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[30%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                      DEBTS DETAILS
                        </p>
                    </div>

                    <div className="py-[15px] px-10 w-[20%]">
                      <p className="text-[16px] leading-[15px]"></p>
                    </div>

                    <div className="px-10 flex justify-end w-[50%]">

                    <div>
                        <Link
                            href={'/member/debts'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">DEBTS accounts</p>
                        </Link>
                      </div>
                        <div>
                        <Link
                            href={'/member/debts/cu'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Add Debt</p>
                        </Link>
                        </div>

                        <div>
                        <Link
                            href={'/member/debts/settings'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Debt settings</p>
                        </Link>
                        </div>
                        
                    </div>

              </div>

            </div>



            <div className="mt-[32px]">
            

              <Summary DebtWithTransactionData={DebtWithTransactionData} />

            </div>

            <div className="mt-[32px] bg-[#fafafa] flex p-5">

              <div className="w-[35%] h-[30%]">  
                <BasicCalendar 
                extraDayData={{[`${DebtWithTransactionData.debtaccounts.due_date}`]:{'title':`Next due date`,'description':description()}}} 
                currentMonth={DebtWithTransactionData.debtaccounts.due_date}
                />
              </div>


              <div className="w-[65%] px-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(datalabel).map((key, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <strong>{datalabel[key]}</strong>
                    <p className="mt-1">
                      {/*DebtWithTransactionData.debtAccount[key] !== undefined ? DebtWithTransactionData.debtAccount[key].toString() : '-'*/}
                      {key in DebtWithTransactionData.debtaccounts ? DebtWithTransactionData.debtaccounts[key]?.toString() : '-'}
                    </p>
                  </div>
                ))}
              </div>


              </div>

            </div>









        </div>
        </DefaultLayout>
        </>

    )
}