"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";

import BillEntry from "./BillEntry";
import TabView from "@/app/components/ui/TabView";
import BillAccountUpdate from "./BillAccountUpdate";
import BillTransactions from "./BillTransactions";
import CurrentBillDashboard from "./CurrentBillDashboard";
import BillPayment from "./payment/BillPayment";
import moment from "moment";

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

    const tdata = {
      'id':'',
      'due_date':moment().format('YYYY-MM-DD'),
      'amount':0
    }

    const edata = {
      'id':'',
      'due_date':moment().format('YYYY-MM-DD'),
      'amount':0,
      'autopay':0
    }
    
    const [transactionData, setTransactionData] = useState(tdata);

    const [editData, setEditData] = useState(edata);

    const [prevTransId, setPrevTransId] = useState<string>('');


    const [prevEditId, setPrevEditId] = useState<string>('');

    useEffect(() => {
      setPrevTransId(transactionData.id);
    }, [transactionData]);


    useEffect(() => {
      setPrevEditId(editData.id);
    }, [editData]);



    const onPaymentHandler = (transData:any)=>{
      setEditData(edata);
      setTransactionData(transData);
      
    }
    
    const onEditHandler = (edData:any)=>{
      setTransactionData(tdata);
      setEditData(edData);
      
    }

    const cleanData =  ()=>{
      setTransactionData(tdata)
      setEditData(edata);
    }
    
    const id = params.id;
    const user_id:any = authCtx.userId;


   

    const tabs: Tab[] = [
      { label: 'Settings and Info', content: <BillAccountUpdate 
        user_id={user_id} 
        bill_acc_id={id} 
        tab_number={activeTab}
        /> },
      { label: 'Bill History', content: <BillTransactions 

        user_id={user_id} 
        bill_acc_id={id} 
        tab_number={activeTab}
        onPayment={onPaymentHandler}
        onEdit={onEditHandler}
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
                  <CurrentBillDashboard  bill_acc_id={id} user_id={user_id} />
                </div>                
                {transactionData.id =='' &&
                <div className="w-full mt-8">
                                   
                    <BillEntry 
                    bill_acc_id={id} 
                    user_id={user_id} 
                    editData={editData}
                    cleanData={cleanData}                   
                     />                                      
                </div>
                }
                
                {transactionData.id !='' && prevTransId==transactionData.id &&
                <div className="w-full mt-8">
                  <BillPayment 
                  trans_id={transactionData.id} 
                  amount={transactionData.amount} 
                  pay_date={transactionData.due_date}
                  cleanData={cleanData}
                  />
                </div>
                }
              </div>

            </div>
            <div className="w-full col-span-2">
              
              <TabView title={`Account Information`} tabs={tabs} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
            </div>


            
            

        </div>

       

           

           
        </DefaultLayout>
        </>

    )
}