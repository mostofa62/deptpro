"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';

import ExtraEntry from "./ExtraEntry";
 
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { DataSchema } from "./DataValidationSchema";
import ExtraTransactions from "./ExtraTransactions";


interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function BillExtra() {
    const authCtx = useAuth();
  
    const [extraType, setExtraType] = useState([]);

    const fetchDataCallback=useCallback(async()=>{
      //console.log(id);
      const response = await axios.get(`${url}bill-extra-dropdown`);
      //return response.data.user;
      setExtraType(response.data.extra_type)
             

  },[]);

  useEffect(()=>{
    fetchDataCallback();
  },[fetchDataCallback]);

    const edata = {
      'id':'',
      'type':DataSchema.type,      
      'amount':0,
      'pay_date_extra':DataSchema.pay_date_extra,      
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
                                   
                    <ExtraEntry                    
                    user_id={user_id}
                    editData={editData}
                    extraType={extraType}
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

                    <ExtraTransactions
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