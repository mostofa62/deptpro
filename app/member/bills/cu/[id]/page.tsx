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
import HolderOne from "@/app/layout/HolderOne";
import { useMediaQuery } from "react-responsive";
import DashGrid from "@/app/images/icon/dash-grid";
import AddPlus from "@/app/images/icon/add-plus";
import DetailsView from "@/app/images/icon/details-view";
import { DataSchema, DataSchemaType } from "../DataValidationSchema";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface ParentData{
  name:string;
  payor:string;
}

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate({
    params,
    searchParams
  }:{
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  
  }) {

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTab = useMediaQuery({ maxWidth: 900 });

    const authCtx = useAuth();
    

    const id = params.id;
    const user_id:any = authCtx.userId;

    const [activeTab, setActiveTab] = useState(0);


    //actual data fetchnow


    const formRef = useRef<any>(null);
    const [fetchFomrData,setFetchFormData] = useState<DataSchemaType>(DataSchema);
    // const [repeatCount, setRepeatCount] = useState([]);
    const [repeatFrequency, setRepeatFrequency] = useState([]);
    const [reminderDays, setReminderDays] = useState([]);
    const [billTypes, setBillTypes] = useState([]);
    const [billSummary, setBillSummary] = useState({
      'currentBalance':0,
      'monthTransaction':[]
    })
    
    

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}bill/${id}`);
        //return response.data.user;
        setFetchFormData(response.data.billaccounts);
        // setRepeatCount(response.data.repeat_count);
        setRepeatFrequency(response.data.repeat_frequency);
        setReminderDays(response.data.reminder_days);

        setBillTypes(response.data.bill_types)

        setBillSummary(response.data.bill_summary)

        

    },[id]);
    useEffect(()=>{
        if (activeTab === 0) {
          fetchDataCallback();
      }
    
    },[fetchDataCallback,activeTab]);
    


    //end actual data fetchnow


    

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

    const [reloadGrid, setReloadGrid] = useState(false);

    const [parentDatas, setParentDatas] =useState<ParentData>({
      name: "",
      payor: "",
    });

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

      if(reloadGrid){
        setReloadGrid(false);
      }else{
        setReloadGrid(true);
      }
    }
    
    

   

    const tabs: Tab[] = [
      
      { label: 'Settings and Info', content: <BillAccountUpdate 
        user_id={user_id} 
        bill_acc_id={id} 
        reminderDays={reminderDays}
        repeatFrequency={repeatFrequency}
        fetchFomrData={fetchFomrData}
        billTypes={billTypes}
       
        /> },
        
      { label: 'Bill History', content: <BillTransactions 

        user_id={user_id} 
        bill_acc_id={id} 
        reloadGrid={reloadGrid}
        onPayment={onPaymentHandler}
        onEdit={onEditHandler}
        />
      }  
    ];
    return(
        <>
        <DefaultLayout>

        <HolderOne
            title={`bill update`}            
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
                link:`/member/bills/${id}`,
                title:'bill details',
                icon:<DetailsView width={15} height={15} />
              }
            ]}
            />
        
        <div className="flex flex-col  md:grid lmd:flex-row md:grid-cols-3 gap-1 mt-4">

        

            <div className="w-full">
              

              <div className="grid grid-row">
                <div className="w-full">
                  <CurrentBillDashboard  
                  bill_title={`${fetchFomrData.name }`} 
                  bill_summary={billSummary}   />
                </div>                
                {/* {transactionData.id =='' &&
                <div className="w-full mt-8">
                                   
                    <BillEntry 
                    bill_acc_id={id} 
                    user_id={user_id} 
                    editData={editData}
                    cleanData={cleanData}                   
                     />                                      
                </div>
                } */}
                
                {transactionData.id !='' && prevTransId==transactionData.id &&
                <div className="w-full mt-2 lmd:mt-4 md:mt-8">
                  <BillPayment
                  bill_acc_id={id}  
                  trans_id={transactionData.id}                  
                  amount={transactionData.amount} 
                  pay_date={transactionData.due_date}
                  cleanData={cleanData}
                  />
                </div>
                }
              </div>

            </div>
            <div className="w-full md:col-span-2">
              
               <TabView tabs={tabs} onChageTab={(index)=>{
                setActiveTab(index)
              }} /> 
            </div>


            
            

        </div>

       

           

           
        </DefaultLayout>
        </>

    )
}