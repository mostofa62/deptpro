"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef } from "react";
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

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    
    const DeptTypeData = useFetchDropDownData({urlSuffix:'debttype-dropdown'});

    const fetchdata = fetchFomrData;

    const user_id = authCtx.userId;

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-debt-account`, 
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

            

            <div className="mt-[40px]">
                <div className="flex flex-row h-[29px]">
                    <div className="h-[21px] pt-[5px] pb-[3px]">
                            <Link
                                    href={'/member/debts'}
                                    className={`text-[21px] capitalize group relative flex items-center gap-2 rounded-sm py-[3px] font-medium duration-300 ease-in-out   text-[#0166FF]`}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={15} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>


                                Back
                            </Link>
                    </div>
                    <div className="ml-[50px] pt-[5px]">
                        <span className="text-[25px] font-medium capitalize text-[#4F4F4F]">ADD NEW BILL ACCOUNT</span>
                    </div>
                </div>
            
            </div>

            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="DEBT Account Details">

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
            label={DataLabel.debt_type}
            defaultValue={fetchdata.debt_type}
            placeHolder={`Select ${DataLabel.debt_type}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.debt_type"
            dataOptions={DeptTypeData}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.debt_type &&
                touched.fetchdata &&
                touched.fetchdata.debt_type &&
                errors.fetchdata.debt_type.label
            }
        />
        

    
        
        
    </div>
</div>


<div className="flex flex-row">
    <div className="w-[50%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.balance} 
        name={`fetchdata.balance`}
        placeHolder={`${DataLabel.balance}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.balance &&
            touched.fetchdata &&            
            touched.fetchdata.balance &&  errors.fetchdata.balance}        
        />
        
        
    </div>
    
    <div className="ml-[24px] w-[50%]">

    

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.highest_balance} 
        name={`fetchdata.highest_balance`}
        placeHolder={`${DataLabel.highest_balance}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.highest_balance &&
            touched.fetchdata &&            
            touched.fetchdata.highest_balance &&  errors.fetchdata.highest_balance}        
        />
        
        
    </div>

   
</div>

<div className="flex flex-row">
    <div className="w-[50%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.monthly_payment} 
        name={`fetchdata.monthly_payment`}
        placeHolder={`${DataLabel.monthly_payment}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.monthly_payment &&
            touched.fetchdata &&            
            touched.fetchdata.monthly_payment &&  errors.fetchdata.monthly_payment}        
        />
        
        
    </div>
    
    <div className="ml-[24px] w-[50%]">

    

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.credit_limit} 
        name={`fetchdata.credit_limit`}
        placeHolder={`${DataLabel.credit_limit}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.credit_limit &&
            touched.fetchdata &&            
            touched.fetchdata.credit_limit &&  errors.fetchdata.credit_limit}        
        />
        
        
    </div>

   
</div>

<div className="flex flex-row">
    <div className="w-[50%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.interest_rate} 
        name={`fetchdata.interest_rate`}
        placeHolder={`${DataLabel.interest_rate}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.interest_rate &&
            touched.fetchdata &&            
            touched.fetchdata.interest_rate &&  errors.fetchdata.interest_rate}        
        />
        
        
    </div>
    
    <div className="ml-[24px] w-[50%]">

    

    <FormikFieldInput 
        type="date"
        label={DataLabel.due_date} 
        name={`fetchdata.due_date`}
        placeHolder={`${DataLabel.due_date}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.due_date &&
            touched.fetchdata &&            
            touched.fetchdata.due_date &&  errors.fetchdata.due_date}        
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
                        <button type="button" className="text-[15px] h-[40px] bg-[#0166FF] rounded text-white px-4  capitalize text-center font-semibold" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                    <div className="relative right-[30px] top-[10px]">
                    <Link
                                    href={'/member/debts'}
                                    className={`text-[15px] h-[40px] capitalize text-center px-4 py-2.5  font-semibold bg-[#0166FF] rounded bg-opacity-5 text-[#0166FF]`}
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