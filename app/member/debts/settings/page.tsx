"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import {Formik} from 'formik';
import { DataSchema,DataLabel,ValidationSchema } from "./DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from 'react-hot-toast';
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";

import {DeptPayOffMethod} from '@/app/data/DebtOptions.json'
import DebtRocket from "@/app/images/icon/debtrocket";
import DebtChain from "@/app/images/icon/debtchain";

const url = process.env.NEXT_PUBLIC_API_URL;
export default function Setting() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const user_id = authCtx.userId;

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}get-user-settings/${user_id}`);
        //return response.data.user;
        
        if(response.data.user_setting!=null){
            setFetchFormData(response.data.user_setting);
        }
    },[user_id]);
    
    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);
    
    
  

    const fetchdata = fetchFomrData;

    console.log(fetchdata)

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-user-settings`, 
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
            router.push('/member/debts');
            
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

        <div className="flex flex-row mt-2">
            <div className="p-9">
                <DebtRocket width={110} height={92} />

            </div>
            <div className="flex flex-col">
                <div className="py-2 mt-7">
                    <p className="text-[#31c4a2] text-[25px] font-semibold">
                        Blast Debt & Build Wealth
                    </p>
                </div>
                <div className="mt-1">
                    <p className="text-[17px] text-[#4f4f4f]">
                        Ready to tackle your debts and unleash your financial power?
                    </p>
                </div>

            </div>

            <div className="py-2 mx-auto">

                <DebtChain width={340} height={200} />
                
            </div>
            
        </div>

        <div className="flex flex-col px-9">

            <p className="text-[#31c4a2] text-[18px] font-semibold">
                Set Your Monthly Debt Budget & Debt Strategy
            </p>

            <p className="text-[16px] text-[#4f4f4f] w-[70%] mt-1">
            To set your monthly debt budget: Total your minimum payments  + any extra to accelerate paydown debt strategies. 
            If you plan to pay minimum payments only, then re-enter the minimum only amount.  Fill in the total monthly debt budget amount.
            </p>

        </div>    
        <div className="grid grid-flow-row">


        {/* <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[40%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                      DEBT SETTINGS
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/debts'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">DEBTS accounts</p>
                        </Link>
                        </div>
                        <div>
                        <Link
                            href={'/member/debts/cu'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >
                            

                            <p className="text-[18px] font-semibold uppercase">Add Debt</p>
                        </Link>
                        </div>
                    </div>

              </div>

            </div> */}
            


           

            <div className="mt-4">
            <Formik
            innerRef={formRef}
            
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="Debt Setting Details">

<div className="flex flex-row">
  

    
    
    <div className="w-[32%]">

    <FormikSelectInput
            label={DataLabel.debt_payoff_method}
            defaultValue={fetchdata.debt_payoff_method}
            placeHolder={`Select ${DataLabel.debt_payoff_method}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.debt_payoff_method"
            dataOptions={DeptPayOffMethod}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.debt_payoff_method &&
                touched.fetchdata &&
                touched.fetchdata.debt_payoff_method &&
                errors.fetchdata.debt_payoff_method.value
            }
        />
        

    
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.minimum_payments} 
        name={`fetchdata.minimum_payments`}
        placeHolder={`${DataLabel.minimum_payments}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.minimum_payments &&
            touched.fetchdata &&            
            touched.fetchdata.minimum_payments &&  errors.fetchdata.minimum_payments}        
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.monthly_budget} 
        name={`fetchdata.monthly_budget`}
        placeHolder={`${DataLabel.monthly_budget}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.monthly_budget &&
            touched.fetchdata &&            
            touched.fetchdata.monthly_budget &&  errors.fetchdata.monthly_budget}        
        />
        
        
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
                                    href={'/member/debts'}
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