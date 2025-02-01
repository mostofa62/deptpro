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


import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from 'react-hot-toast';
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import HolderOne from "@/app/layout/HolderOne";

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
        

    const fetchdata = fetchFomrData;

    const user_id = authCtx.userId;

    const DeptTypeData = useFetchDropDownData({urlSuffix:`debttype-dropdown/${user_id}`});

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
        <div className="flex flex-col">


        <HolderOne
            title="add debt"            
            linkItems={[
                {
                link:'/member/debts',
                title:'your debt dashboard'
                },
                {
                    link:'/member/debts/settings',
                    title:'set debt budget'
                }
            ]}
            />

 

            <div className="mt-2 lg:mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

<div className="flex flex-col  md:flex-row lg:mt-[15px]">
    <div className="w-full md:w-[32%]">
        
    <FormikSelectCreatableInput
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

    <div className="w-full md:ml-[24px] md:w-[32%]">
        
        

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
    
    <div className="w-full md:ml-[24px] md:w-[32%]">

    

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
</div>


<div className="flex flex-col md:flex-row mt-2 md:mt-[15px]">
    <div className="w-full md:w-[24%]">

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
            inputPreix={`$`}        
        />
        
        
    </div>
    
    <div className="w-full md:ml-[24px] md:w-[24%]">

    

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
            inputPreix={`$`}          
        />
        
        
    </div>

    <div className="w-full md:ml-[24px] md:w-[24%]">
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
                inputPreix={`$`}           
            />

    </div>

    <div className="w-full md:ml-[24px] md:w-[24%]">

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
            inputPreix={`$`}          
        />

    </div>

   
</div>



<div className="flex flex-col md:flex-row mt-2 md:mt-[15px]">
    <div className="w-full md:w-[32%]">

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
            inputSuffix={`%`}        
        />
        
        
    </div>

    <div className="w-full md:ml-[24px] md:w-[32%]">

    

    <FormikFieldInput 
        type="date"
        label={DataLabel.start_date} 
        name={`fetchdata.start_date`}
        placeHolder={`${DataLabel.start_date}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.start_date &&
            touched.fetchdata &&            
            touched.fetchdata.start_date &&  errors.fetchdata.start_date}        
        />
        
        
    </div>
    
    <div className="w-full md:ml-[24px] md:w-[32%]">

    

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

<div className="flex flex-col md:flex-row mt-2 md:mt-[15px]">

<div className="w-full md:w-[32%]">
                <FormikFieldInput 
        label={DataLabel.note} 
        name={`fetchdata.note`}
        placeHolder={`${DataLabel.note}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.note &&
            touched.fetchdata &&            
            touched.fetchdata.note &&  errors.fetchdata.note}
      
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


            <div className="mt-2 md:mt-10">
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