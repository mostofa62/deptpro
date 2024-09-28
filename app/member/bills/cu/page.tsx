"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import {Field, Formik} from 'formik';
import { DataSchema,DataLabel,ValidationSchema } from "./DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from 'react-hot-toast';
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import Image from "next/image";
import FormikCheckInput from "@/app/components/form/FormikCheckInput";
import VideoComponent from "@/app/components/utils/VideoComponent";
import HolderOne from "@/app/layout/HolderOne";

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const user_id = authCtx.userId;

    const billTypeData = useFetchDropDownData({urlSuffix:`billtype-dropdown/${user_id}`});

    const fetchdata = fetchFomrData;

    const [repeatFrequency, setRepeatFrequency] = useState([]);
    const [reminderDays, setReminderDays] = useState([]);

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}billutils`);
        //return response.data.user;       
        setRepeatFrequency(response.data.repeat_frequency);
        setReminderDays(response.data.reminder_days);

    },[]);
    useEffect(()=>{
        //if(tab_number){
            fetchDataCallback();
        //}
    
    },[fetchDataCallback]);
    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-bill-account`, 
            {user_id,...values.fetchdata}, {
            
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ) .then(function (response) {
          //console.log(response);

          if(response.data.result > 0){
            setSubmitting(false);
            toast.success(response.data.message);
            //resetForm();
            router.push('/member/bills');
            
          }else{
            setSubmitting(true);
            toast.error(response.data.message);
          }         
          
        })
        .catch(function (error) {
            toast.error(error);
          //console.log(error);
        });

    }

    const handleSubmit = ()=> {
        formRef.current?.handleSubmit();
      }

    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">

        <HolderOne
            title="add bill"            
            linkItems={[
              {
                link:'/member/bills',
                title:'your bill dashboard'
              }
            ]}
            />

        

            

            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="Bill Account Details">

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

            <div className="flex flex-row">
                <div className="w-[50%]">
                    
                    <FormikFieldInput 
                    label={DataLabel.name} 
                    name={`fetchdata.name`}
                    placeHolder={`${DataLabel.name}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.name &&
                        touched.fetchdata &&            
                        touched.fetchdata.name &&  errors.fetchdata.name}
                    onChangeField = {(e:any)=>{
                        const {value, name} = e.target;
                        setFieldValue(
                            name,
                            value
                        );
                    }}
                    />
                    
                    
                    
                </div>
                
                <div className="ml-[24px] w-[50%]">

                <FormikSelectInput
                        label={DataLabel.bill_type}
                        defaultValue={fetchdata.bill_type}
                        placeHolder={`Select ${DataLabel.bill_type}`}
                        isSearchable={true}
                        isClearable={true}
                        name="fetchdata.bill_type"
                        dataOptions={billTypeData}
                        errorMessage={errors.fetchdata &&
                            errors.fetchdata.bill_type &&
                            touched.fetchdata &&
                            touched.fetchdata.bill_type &&
                            errors.fetchdata.bill_type.label
                        }
                    />
                    

                
                    
                    
                </div>
            </div>

            <div className="flex flex-row">
                <div className="w-[50%]">

                <FormikFieldInput 
                    type="number"
                    label={DataLabel.default_amount} 
                    name={`fetchdata.default_amount`}
                    placeHolder={`${DataLabel.default_amount}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.default_amount &&
                        touched.fetchdata &&            
                        touched.fetchdata.default_amount &&  errors.fetchdata.default_amount}        
                    />
                    
                    
                </div>
                
                <div className="ml-[24px] w-[50%]">

                <FormikFieldInput 
                    type="date"
                    label={DataLabel.next_due_date} 
                    name={`fetchdata.next_due_date`}
                    placeHolder={`${DataLabel.next_due_date}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.next_due_date &&
                        touched.fetchdata &&            
                        touched.fetchdata.next_due_date &&  errors.fetchdata.next_due_date}        
                    />
                    
                    
                </div>

            
            </div>

            <div className="flex flex-row">
                <div className="w-[50%]">
                    
                    <FormikFieldInput 
                    label={DataLabel.payor} 
                    name={`fetchdata.payor`}
                    placeHolder={`${DataLabel.payor}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.payor &&
                        touched.fetchdata &&            
                        touched.fetchdata.payor &&  errors.fetchdata.payor}
                    onChangeField = {(e:any)=>{
                        const {value, name} = e.target;
                        setFieldValue(
                            name,
                            value
                        );
                    }}
                    />
                    
                    
                    
                </div>
                
                <div className="ml-[24px] w-[50%]">

                <FormikSelectInput
        label={DataLabel.repeat_frequency}
        defaultValue={fetchdata.repeat_frequency}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.repeat_frequency"
        dataOptions={repeatFrequency}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.repeat_frequency &&
            touched.fetchdata &&
            touched.fetchdata.repeat_frequency &&
            errors.fetchdata.repeat_frequency.label
        }
    />
                    

                
                    
                    
                </div>
            </div>


            <div className="flex flex-row">
                <div className="w-[50%]">
                    
                <Field 
    component={FormikCheckInput}
        name="fetchdata.autopay"
        label={DataLabel.autopay}    
        checked={values.fetchdata.autopay === 1}
        errorClass={errors.fetchdata && 
            errors.fetchdata.autopay && 
            touched.fetchdata && 
            touched.fetchdata.autopay &&
            'font-semibold text-[#B45454]'
        }                                        
        onChange={(e:any) => {
            const {checked, name} = e.target;                        
                    
            if (checked) {
            setFieldTouched(name,true);

            setFieldValue(
                name,
                1
            );
            
            }else{
                setFieldTouched(name,false);
                setFieldValue(
                    name,
                    0
                );

            }
        
        }}
        
        />
                    
                    
                    
                </div>
                
                <div className="ml-[24px] w-[50%]">

                <FormikSelectInput
        label={DataLabel.reminder_days}
        defaultValue={fetchdata.reminder_days}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.reminder_days"
        dataOptions={reminderDays}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.reminder_days &&
            touched.fetchdata &&
            touched.fetchdata.reminder_days &&
            errors.fetchdata.reminder_days.label
        }
    />
                    

                
                    
                    
                </div>
            </div>


            

        </div>


</div>







{/*
<div className="flex flex-row">
    {JSON.stringify(values)}
    {JSON.stringify(errors)}
</div>
*/}

</FormikFormHolder>
        )}
        />
            </div>


            <div className="mt-10">
                <div className="flex flex-row-reverse gap-4">
                    <div className="relative right-5 top-0">
                        <button type="button" className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                    <div className="relative right-[30px] top-[10px]">
                    <Link
                                    href={'/member/bills'}
                                    className={`text-[15px] h-[40px] capitalize text-center px-4 py-2.5  font-semibold bg-[#43ACD6] rounded bg-opacity-5 text-[#43ACD6]`}
                                >                               


                                Cancel
                            </Link>
                    </div>
                    
                    

                </div> 
                
            </div>
            

            

        </div>
        </DefaultLayout>
        </>

    )
}