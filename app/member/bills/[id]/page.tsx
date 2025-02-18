"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import Summary from "./Summary.";
import BasicCalendar from "@/app/components/BasicCalender";
import { DataLabelView } from "../cu/DataValidationSchema";
import HolderOne from "@/app/layout/HolderOne";
import ExtraTransactions from "./ExtraTransactions";
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";
import EditView from "@/app/images/icon/edit-view";




interface DebtRow{
  default_amount:number;
}




const url = process.env.NEXT_PUBLIC_API_URL;
export default function BillDetails({
    params,
    searchParams    
  }:{
    params: { id: number }
    searchParams: { [key: string]: string | string[] | undefined },    
  
  }) {
    const authCtx = useAuth();
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(0);
   
    
    const id = params.id;
    const user_id:any = authCtx.userId;

    const payload ={
      billaccounts:{},
      billpayments: [],      
    }

    const BillWithPaymentData:any = useFetchDropDownObjects({
        urlSuffix:`bill-allpg/${id}`,
        payLoads:payload
    })

    
    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>DUE DATE</span><span className="ml-4">{BillWithPaymentData.billaccounts.next_due_date_word}</span></div>
          <div><span>Name</span><span className="ml-4">{BillWithPaymentData.billaccounts.name}</span></div>
          <div><span>CURRENT BILL</span><span className="ml-4">$</span><span>{Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,maximumFractionDigits: 2}).format(BillWithPaymentData.billaccounts.current_amount)}</span></div>
        </div>
      )
  
   
    const datalabel:any = DataLabelView;

    const DataPrefix = {
      default_amount:'$'
    }
  
    return(
        <>
        <DefaultLayout>
        <div className="flex flex-col">


        <HolderOne
            title="bill details"            
            linkItems={[
              {
                link:'/member/bills/cu',
                title:'add bill',
                icon:<AddPlus width={14} height={14} />
              },
              {
                link:'/member/bills',
                title:'your bill dashboard',
                icon:<DashGrid width={16} height={16} />
              },
              {
                link:`/member/bills/cu/${id}`,
                title:'update bill',
                icon:<EditView width={15} height={15} />
              }
            ]}
            />




            <div className="mt-2.5 md:mt-[32px]">
            

              <Summary BillWithPaymentData={BillWithPaymentData} />

            </div>

            <div className="md:mt-[32px] bg-[#fafafa] rounded-lg flex flex-col gap-2.5 lmd:gap-1 md:gap-1 lmd:flex-row md:flex-row p-2 md:p-5">

              <div className="w-full lmd:w-[40%] h-[20%] lmd:h-[23%] md:w-[35%] md:h-[30%]">  
                <BasicCalendar 
                extraDayData={{[`${BillWithPaymentData.billaccounts.next_due_date}`]:{'title':`Next due date`,'description':description()}}} 
                currentMonth={BillWithPaymentData.billaccounts.next_due_date}
                />
              </div>


              <div className="w-full lmd:w-[60%] md:w-[65%] px-1 lmd:px-2 md:px-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 lmd:gap-2 md:gap-4">
                {Object.keys(datalabel).map((key, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <strong>{key == 'bill_type' ? datalabel[key]['first']:datalabel[key] }</strong>
                    <p className="mt-1">
                      {/*BillWithPaymentData.debtAccount[key] !== undefined ? BillWithPaymentData.debtAccount[key].toString() : '-'*/}
                      {DataPrefix[key as keyof DebtRow]}{key in BillWithPaymentData.billaccounts ?   ( key == 'bill_type' ? `${BillWithPaymentData.billaccounts[datalabel[key]['parent']] &&  `${BillWithPaymentData.billaccounts[datalabel[key]['parent']]?.toString()} > `}${BillWithPaymentData.billaccounts[key]?.toString()} `: DataPrefix[key as keyof DebtRow] == '$' ?Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(BillWithPaymentData.billaccounts[key]): BillWithPaymentData.billaccounts[key]?.toString()) : '-'}
                    </p>
                  </div>
                ))}
              </div>


              </div>

            </div>

            <div className="w-full md:mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg">
              <ExtraTransactions bill_id={id}  />
            </div>

            








        </div>
        </DefaultLayout>
        </>

    )
}