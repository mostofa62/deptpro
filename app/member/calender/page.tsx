"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import Script from 'next/script';
import useAuth from '@/app/hooks/useAuth';
import { useEffect, useRef } from "react";
import HolderOne from "@/app/layout/HolderOne";
import BasicCalendar from "@/app/components/BasicCalender";
import moment from "moment";

const url = process.env.NEXT_PUBLIC_API_URL;
export default function CalenderPage() {
    const authCtx = useAuth();

    const next_due_date = moment().format('YYYY-MM-DD');

    const description = ()=>(
        <div className="flex flex-col gap-1 text-[15px]">
          <div><span>DUE DATE</span><span className="ml-4">100</span></div>          
        </div>
      )
  
   

    return(
        
        <DefaultLayout>
        <div className="flex flex-col">

        <HolderOne
            title="calender"            
            linkItems={[
            //   {
            //     link:'/',
            //     title:''
            //   },              
            ]}
            />

            <div className="mt-3 bg-[#fafafa] rounded-lg p-5">


            <BasicCalendar 
                extraDayData={{[`${next_due_date}`]:{'title':`Next due date`,'description':description()}}} 
                currentMonth={next_due_date}
                />

            
          
            </div>


        </div>

        </DefaultLayout>

    )

}