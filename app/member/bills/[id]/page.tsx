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
import { DataLabelView } from "../cu/DataValidationSchema";





interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function BillDetails({
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
      billaccounts:{},
      billpayments: [],      
    }

    const BillWithPaymentData:any = useFetchDropDownObjects({
        urlSuffix:`bill-all/${id}`,
        payLoads:payload
    })

    
    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>DUE DATE</span><span className="ml-4">{BillWithPaymentData.billaccounts.next_due_date_word}</span></div>
          <div><span>Name</span><span className="ml-4">{BillWithPaymentData.billaccounts.name}</span></div>
          <div><span>CURRENT BILL</span><span className="ml-4">$</span><span className="ml-1">{Intl.NumberFormat('en-US').format(BillWithPaymentData.billaccounts.current_amount)}</span></div>
        </div>
      )
  
   
    const datalabel:any = DataLabelView;
  
    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">

        
        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[20%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                      BILL DETAILS
                        </p>
                    </div>

                    

                    <div className="flex justify-end items-end w-[80%]">

                      <div>
                        <Link
                            href={'/member/bills'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">BILL accounts</p>
                        </Link>
                      </div>
                        <div>
                        <Link
                            href={'/member/bills/cu'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Add Bill</p>
                        </Link>
                        </div>
                       

                        <div>
                        <Link
                            href={`/member/bills/cu/${id}`}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Update</p>
                        </Link>
                        </div>
                        
                    </div>

              </div>

            </div>



            <div className="mt-[32px]">
            

              <Summary BillWithPaymentData={BillWithPaymentData} />

            </div>

            <div className="mt-[32px] bg-[#fafafa] rounded-lg flex p-5">

              <div className="w-[35%] h-[30%]">  
                <BasicCalendar 
                extraDayData={{[`${BillWithPaymentData.billaccounts.next_due_date}`]:{'title':`Next due date`,'description':description()}}} 
                currentMonth={BillWithPaymentData.billaccounts.next_due_date}
                />
              </div>


              <div className="w-[65%] px-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(datalabel).map((key, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <strong>{datalabel[key]}</strong>
                    <p className="mt-1">
                      {/*BillWithPaymentData.debtAccount[key] !== undefined ? BillWithPaymentData.debtAccount[key].toString() : '-'*/}
                      {key in BillWithPaymentData.billaccounts ? BillWithPaymentData.billaccounts[key]?.toString() : '-'}
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