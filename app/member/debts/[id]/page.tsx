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
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";
import EditView from "@/app/images/icon/edit-view";




interface Tab {
  label: string;
  content: React.ReactNode;
}

interface DebtRow{
  name:string;
  debt_type:string;
  balance:number;
  highest_balance:number;   
  monthly_payment:number;
  credit_limit:number;
  interest_rate:string;  
  start_date_word:string;
  due_date_word:string;
  notes:string;
  monthly_interest:number;
  autopay:string;
  inlclude_payoff:string;
  payoff_order:string;
  reminder_days:string;
  monthly_payment_option:string;
  percentage:string;
  lowest_payment:number;
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
          <div><span>Balance</span><span className="ml-4">$</span><span>{Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(DebtWithTransactionData.debtaccounts.balance)}</span></div>
        </div>
      )
  
   
    const datalabel:any = DataLabelView;

    const DataPrefix = {
      name:'',
      debt_type:'',
      balance:'$',
      highest_balance:'$',   
      monthly_payment:'$',
      credit_limit:'$',
      interest_rate:'',  
      start_date_word:'',
      due_date_word:'',
      notes:'',
      monthly_interest:'$',
      autopay:'',
      inlclude_payoff:'',
      payoff_order:'',
      reminder_days:'',
      monthly_payment_option:'',
      percentage:'',
      lowest_payment:'$'
    }

    const DataSuffix = {
      name:'',
      debt_type:'',
      balance:'',
      highest_balance:'',   
      monthly_payment:'',
      credit_limit:'',
      interest_rate:'%',  
      start_date_word:'',
      due_date_word:'',
      notes:'',
      monthly_interest:'',
      autopay:'',
      inlclude_payoff:'',
      payoff_order:'',
      reminder_days:'',
      monthly_payment_option:'',
      percentage:'%',
      lowest_payment:''
    }
  
    return(
        <>
        <DefaultLayout>
        <div className="flex flex-col">


        <HolderOne
            title="debt details"            
            linkItems={[
              {
                link:'/member/debts/cu',
                title:'add debt',
                icon:<AddPlus width={14} height={14} />
              },
              {
                link:'/member/debts',
                title:'your debt dashboard',
                icon:<DashGrid width={16} height={16} />
              },
              {
                link:`/member/debts/cu/${id}`,
                title:'update debt',
                icon:<EditView width={15} height={15} />
              }
            ]}
            />

 
<div className="mt-2.5 md:mt-[32px]">
            

              <Summary DebtWithTransactionData={DebtWithTransactionData} />

            </div>

            <div className="md:mt-[32px] bg-[#fafafa] rounded-lg flex flex-col gap-2.5 lmd:gap-1 md:gap-1 lmd:flex-row md:flex-row p-2 md:p-5">

              <div className="w-full lmd:w-[40%] h-[20%] lmd:h-[23%] md:w-[35%] md:h-[30%]">   
                <BasicCalendar 
                extraDayData={{[`${DebtWithTransactionData.debtaccounts.due_date}`]:{'title':`Next due date`,'description':description()}}} 
                currentMonth={DebtWithTransactionData.debtaccounts.due_date}
                />
              </div>


              <div className="w-full lmd:w-[60%] md:w-[65%] px-1 lmd:px-2 md:px-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 lmd:gap-2 md:gap-4">
                {Object.keys(datalabel).map((key, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <strong>{datalabel[key]}</strong>
                    <p className="mt-1">
                      {/*DebtWithTransactionData.debtAccount[key] !== undefined ? DebtWithTransactionData.debtAccount[key].toString() : '-'*/}
                      {DataPrefix[key as keyof DebtRow]}{key in DebtWithTransactionData.debtaccounts ? typeof DebtWithTransactionData.debtaccounts[key] == 'number'? Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(DebtWithTransactionData.debtaccounts[key]) :DebtWithTransactionData.debtaccounts[key]?.toString() : '-'} {DataSuffix[key as keyof DebtRow]}
                    </p>
                  </div>
                ))}
              </div>


              </div>

            </div>

            <div className="w-full md:mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg">
              <DebtTransactions debt_acc_id={id} user_id={user_id} tab_number={0} view_mode={1} />
            </div>
            
            <div className="w-full md:mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg">
              <DebtAmortization debt_acc_id={id} user_id={user_id} tab_number={0} />
            </div>








        </div>
        </DefaultLayout>
        </>

    )
}