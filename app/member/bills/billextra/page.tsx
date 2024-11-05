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


interface Tab {
  label: string;
  content: React.ReactNode;
}



const url = process.env.NEXT_PUBLIC_API_URL;
export default function BillExtra() {
    const authCtx = useAuth();
  
    const [extraType, setExtraType] = useState([]);
    const [billList, setBillList] = useState([]);

    const fetchDataCallback=useCallback(async()=>{
      //console.log(id);
      const response = await axios.get(`${url}bill-extra-dropdown`);
      //return response.data.user;
      setExtraType(response.data.extra_type)
      setBillList(response.data.bill_accounts_list)
             

  },[]);

  useEffect(()=>{
    fetchDataCallback();
  },[fetchDataCallback]);

    

    


    
    
        
    const user_id:any = authCtx.userId;

   
    


   
    
    
    return(
        <>
        <DefaultLayout>

        <HolderOne
            title="extra bill"            
            linkItems={[
              {
                link:'/member/bills/cu',
                title:'add bill'
              },
              {
                link:'/member/bills',
                title:'your bill dashboard'
              }
            ]}
            />

<div className="flex flex-row">

<div className="w-[35%] flex justify-center items-center">
        <div className="">
                       
            <VideoComponent
                src="/animated/billentry.mp4"
                width={`350`}
                controls={false} // Disable default video controls (optional)
                autoplay={true}
                loop={true}
                showControls={false}
            />
        </div>
        </div>

        <div className="w-[65%]">

        <ExtraEntry                    
                    user_id={user_id}
                    
                    extraType={extraType}
                    billList={billList}
                                                                           
                     />     

        </div>
</div>
        
        

       

           

           
        </DefaultLayout>
        </>

    )
}