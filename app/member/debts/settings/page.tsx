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
        <div className="grid grid-flow-row">


        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
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

            </div>
            

           

            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
            
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="Debt Setting Details">

<div className="flex flex-row">
  

    
    
    <div className="w-[50%]">

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

    <div className="ml-[24px] w-[50%]">

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