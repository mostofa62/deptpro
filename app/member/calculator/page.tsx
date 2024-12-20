"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import HolderOne from "@/app/layout/HolderOne";
import MortgageCalculator from "./MortgageCalculator";
import TabViewFlow from "@/app/components/ui/TabViewFlow";
import CreditCardPaymentCalculator from "./CreditCardPaymentCalculator";

interface Tab {
    label: string;
    content: React.ReactNode;
  }
const url = process.env.NEXT_PUBLIC_API_URL;
export default function CalculatorPage() {

    const [activeTab, setActiveTab] = useState(0);

    const tabs: Tab[] = [

       { 
            label: 'Credit Card Payment Calculator', 
            content: <CreditCardPaymentCalculator/>
          } ,
        { 
          label: 'Mortgage Calculator', 
          content: <MortgageCalculator />
        } ,   


          
  
        
  
        
        
        
      ];

    return(
        
        <DefaultLayout>
        <div className="flex flex-col">

        <HolderOne
            title="calculators"            
            linkItems={[
            //   {
            //     link:'/',
            //     title:''
            //   },              
            ]}
            />

            <div className="mt-3 bg-[#fafafa] rounded-lg p-5">

            {
              <TabViewFlow  tabs={tabs} flow="vertical" onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }

            </div>


            </div>

            </DefaultLayout>

        )


}