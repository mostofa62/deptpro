"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';

import ExtraEntry from "./ExtraEntry";
 
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { DataSchema } from "./DataValidationSchema";
import HolderOne from "@/app/layout/HolderOne";
import VideoComponent from "@/app/components/utils/VideoComponent";
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";


interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function BillExtra() {
    const authCtx = useAuth();
    const user_id:any = authCtx.userId;
  
    const [extraType, setExtraType] = useState([]);
    const [billList, setBillList] = useState([]);

    const fetchDataCallback=useCallback(async()=>{
      //console.log(id);
      const response = await axios.get(`${url}bill-extra-dropdownpg/${user_id}`);
      //return response.data.user;
      setExtraType(response.data.extra_type)
      setBillList(response.data.bill_accounts_list)
             

  },[user_id]);

  useEffect(()=>{
    fetchDataCallback();
  },[fetchDataCallback]);

    

    


    
    
        
    

   
    


   
    
    
    return(
        <>
        <DefaultLayout>

        <HolderOne
            title="extra bill"            
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
              }
            ]}
            />

<ExtraEntry                    
                    user_id={user_id}
                    
                    extraType={extraType}
                    billList={billList}
                                                                           
                     />     


        

       

           

           
        </DefaultLayout>
        </>

    )
}