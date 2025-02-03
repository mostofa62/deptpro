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
import HolderOne from "@/app/layout/HolderOne";
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";
import Setting from "@/app/images/icon/setting";
import ProjectionBar from "@/app/images/icon/projection-bar";
import Ordering from "@/app/images/icon/ordering";


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

        <HolderOne
            title="payment boost"            
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
                link:'/member/debts/settings',
                title:'set debt budget',
                icon:<Setting width={15} height={15} />
              },
              {
                link:'debts/payoffstrategy',
                title:'payoff strategy',
                icon:<ProjectionBar width={15} height={15} />
              },
              {
                link:'debts/payoffcustom',
                title:'custom payoff',
                icon:<Ordering width={18} height={18} />
              }
            ]}
            />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-1 md:mt-4">

            <div className="w-full">

              <div className="grid grid-row">                          
               
                <div className="w-full mt-2 md:mt-8">
                                   
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

              <div className="w-full mt-2 md:mt-8">

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