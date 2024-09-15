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

    const user_id = authCtx.userId;

    const billTypeData = useFetchDropDownData({urlSuffix:`billtype-dropdown/${user_id}`});

    const fetchdata = fetchFomrData;
    

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

        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[40%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                      ADD Bill ACCOUNT
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/bills'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold uppercase">Bill accounts</p>
                        </Link>
                        </div>
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
            <FormikFormHolder legend="Bill Account Details">

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