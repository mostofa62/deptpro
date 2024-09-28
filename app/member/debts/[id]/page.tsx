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
import DebtAmortization from "../cu/[id]/DebtAmortization";
import DebtTransactions from "../cu/[id]/DebtTransactions";
import HolderOne from "@/app/layout/HolderOne";




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


        <HolderOne
            title="debt details"            
            linkItems={[
              {
                link:'/member/debts/cu',
                title:'add debt'
              },
              {
                link:'/member/debts',
                title:'your debt dashboard'
              },
              {
                link:`/member/debts/cu/${id}`,
                title:'update debt'
              }
            ]}
            />

 
            <div className="mt-[32px]">
            

              <Summary DebtWithTransactionData={DebtWithTransactionData} />

            </div>

            <div className="mt-[32px] bg-[#fafafa] rounded-lg flex p-5">

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

            <div className="mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
              <DebtTransactions debt_acc_id={id} user_id={user_id} tab_number={0} view_mode={1} />
            </div>
            
            <div className="mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
              <DebtAmortization debt_acc_id={id} user_id={user_id} tab_number={0} />
            </div>








        </div>
        </DefaultLayout>
        </>

    )
}