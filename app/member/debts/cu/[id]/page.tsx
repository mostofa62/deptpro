"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";


import TabView from "@/app/components/ui/TabView";

import CurrentDebtDashboard from "./CurrentDebtDashboard";
import DebtTransactions from "./DebtTransactions";
import DebtAccountUpdate from "./DebtAccountUpdate";
import DebtEntry from "./DebtEntry";

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
    searchParams: { [key: string]: string | string[] | undefined }
  
  }) {
    const authCtx = useAuth();
    const router = useRouter()

    const [activeTab, setActiveTab] = useState(0);
    
    
    const id = params.id;
    const user_id:any = authCtx.userId;
   
    const [transactioData, setTransactionData] = useState({
      'transactionType':[],
      'transactionMonth':[],
      'transactionYear':[]
    })
    
    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}debt-transaction-dropdown`);
        //return response.data.user;
        setTransactionData({
          'transactionType':response.data.transaction_type,
          'transactionMonth':response.data.transaction_month,
          'transactionYear':response.data.transaction_year,
        });
               

    },[]);
    useEffect(()=>{
        
        fetchDataCallback();
        
    
    },[fetchDataCallback]);


   
    
    const tabs: Tab[] = [
      { label: 'Settings and Info', content: <DebtAccountUpdate 
        user_id={user_id} 
        debt_acc_id={id} 
        tab_number={activeTab}
        /> },
       
      { label: 'Transaction History', content: <DebtTransactions 

        user_id={user_id} 
        debt_acc_id={id} 
        tab_number={activeTab}
        //onPayment={onPaymentHandler}
        //onEdit={onEditHandler}
        />
      }  
    ];
    
    return(
        <>
        <DefaultLayout>
        
        <div className="grid grid-cols-3 gap-1 mt-4">

            <div className="w-full">

              <div className="grid grid-row">
                <div className="w-full">
                  <CurrentDebtDashboard  dept_acc_id={id} user_id={user_id} />
                </div>                
               
                <div className="w-full mt-8">
                                   
                    <DebtEntry
                    debt_acc_id={id} 
                    user_id={user_id}
                    transaction_data={transactioData}                                       
                     />
                                                           
                </div>
                
                
                {/*transactionData.id !='' && prevTransId==transactionData.id &&
                <div className="w-full mt-8">
                  <BillPayment 
                  trans_id={transactionData.id} 
                  amount={transactionData.amount} 
                  pay_date={transactionData.due_date}
                  cleanData={cleanData}
                  />
                </div>
                */}
              </div>

            </div>
            <div className="w-full col-span-2">
              {
              <TabView title={`Account Information`} tabs={tabs} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>


            
            

        </div>

       

           

           
        </DefaultLayout>
        </>

    )
}