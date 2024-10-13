"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";


import TabView from "@/app/components/ui/TabView";


import BoostEntry from "./BoostEntry";
import BoostTransactions from "./BoostTransactions";
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { DataSchema } from "./DataValidationSchema";


interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()

    const [activeTab, setActiveTab] = useState(0);

    const edata = {
      'id':'',      
      'amount':0,
      'pay_date_boost':DataSchema.pay_date_boost,      
      'comment':''
    }

    const [editData, setEditData] = useState(edata);

    const [prevEditId, setPrevEditId] = useState<string>('');

    const [reloadGrid, setReloadGrid] = useState(false);

    useEffect(() => {
      setPrevEditId(editData.id);
    }, [editData]);


    const onEditHandler = (edData:any)=>{      
      setEditData(edData);
      
    }

    const cleanData =  ()=>{      
      setEditData(edata);
      if(reloadGrid){
        setReloadGrid(false);
      }else{
        setReloadGrid(true);
      }
      
    }
    
        
    const user_id:any = authCtx.userId;

   
    


   
    
    
    return(
        <>
        <DefaultLayout>
        
        <div className="grid grid-cols-3 gap-1 mt-4">

            <div className="w-full">

              <div className="grid grid-row">                          
               
                <div className="w-full mt-8">
                                   
                    <BoostEntry                    
                    user_id={user_id}
                    editData={editData}
                    cleanData={cleanData}                                                          
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

              <div className="w-full mt-8">

                  <CardHolderDefault>

                    <BoostTransactions
                          user_id={user_id} 
                          reloadGrid={reloadGrid}
                          onEdit={onEditHandler}

                          />

                    </CardHolderDefault>
                </div>            
            </div>


            
            

        </div>

       

           

           
        </DefaultLayout>
        </>

    )
}