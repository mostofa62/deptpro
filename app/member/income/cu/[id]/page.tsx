"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import {Field, Formik} from 'formik';
import { DataSchema,DataLabel,ValidationSchema } from "../DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from 'react-hot-toast';
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import HolderOne from "@/app/layout/HolderOne";
import CheckComponent from "@/app/components/CheckComponent";
import FormikCheckInput from "@/app/components/form/FormikCheckInput";
import Tooltip from "@/app/components/ui/Tooltip";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    income_source:Options[],
    repeat_frequency:Options[],
}

export default function InsuranceCreate({
    params,
    searchParams
  }:{
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  
  }) {
    const authCtx = useAuth();
    const user_id = authCtx.userId;
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    
    const id = params.id;

    const payload: PayLoads ={
        income_source: [],
        repeat_frequency: [],
    }

    const IncomeSourceBoostData:any = useFetchDropDownObjects({
        urlSuffix:`incomesourceboost-dropdown/${user_id}`,
        payLoads:payload
    })
    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}income/${id}`);
        //return response.data.user;
        setFetchFormData(response.data.income);
        
        
    },[id]);
    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);
    const fetchdata = {...DataSchema,...fetchFomrData};

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-income-account/${id}`, 
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
            router.push('/member/income');
            
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
            title="update income"            
            linkItems={[
              {
                link:'/member/income',
                title:'income dashboard'
              },
              {
                link:'income/cu',
                title:'add income'
              },
              {
                link:`/member/income/${id}`,
                title:'income details'
              },
            ]}
            />


        

            

            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">
        
        

<FormikFieldInput 
        label={DataLabel.earner} 
        name={`fetchdata.earner`}
        placeHolder={`${DataLabel.earner}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.earner &&
            touched.fetchdata &&            
            touched.fetchdata.earner &&  errors.fetchdata.earner}
        onChangeField = {(e:any)=>{
            const {value, name} = e.target;
            setFieldValue(
                name,
                value
              );
        }}
        />
        
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <Tooltip text={<p className="flex flex-col items-center justify-center"><span>ie: Job, 2nd job, side gig, rental,</span>
        <span>pension, social security, annuity, investments</span></p>}>
        
    <FormikSelectCreatableInput
            label={DataLabel.income_source}
            defaultValue={fetchdata.income_source}
            placeHolder={`Select ${DataLabel.income_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income_source"
            dataOptions={IncomeSourceBoostData.income_source}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.income_source &&
                touched.fetchdata &&
                touched.fetchdata.income_source &&
                errors.fetchdata.income_source.label
            }
        />
     </Tooltip>   
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.gross_income} $`} 
        name={`fetchdata.gross_income`}
        placeHolder={`${DataLabel.gross_income}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.gross_income &&
            touched.fetchdata &&            
            touched.fetchdata.gross_income &&  errors.fetchdata.gross_income}
            inputPreix={`$`}         
        />
        

    
        
        
    </div>
</div>




<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.net_income} $`} 
        name={`fetchdata.net_income`}
        placeHolder={`${DataLabel.net_income}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.net_income &&
            touched.fetchdata &&            
            touched.fetchdata.net_income &&  errors.fetchdata.net_income}
            inputPreix={`$`}         
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    

    <FormikFieldInput 
        type="date"
        readOnly
        disabled        
        label={DataLabel.pay_date} 
        name={`fetchdata.pay_date`}
        placeHolder={`${DataLabel.pay_date}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.pay_date &&
            touched.fetchdata &&            
            touched.fetchdata.pay_date &&  errors.fetchdata.pay_date}               
        />
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">

    

    <FormikSelectInput
        label={DataLabel.repeat}
        defaultValue={fetchdata.repeat}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.repeat"
        dataOptions={IncomeSourceBoostData.repeat_frequency}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.repeat &&
            touched.fetchdata &&
            touched.fetchdata.repeat &&
            errors.fetchdata.repeat.label
        }
    />
        
        
    </div>

   
</div>



<div className="flex flex-row mt-[15px]">
<div className="w-[48%]">
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

{/* <div className="ml-[24px] w-[48%] items-end justify-end flex">


<Field 
    component={FormikCheckInput}
        name="fetchdata.close"
        label={DataLabel.close}    
        checked={values.fetchdata.close === 1}
        errorClass={errors.fetchdata && 
            errors.fetchdata.close && 
            touched.fetchdata && 
            touched.fetchdata.close &&
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
</div> */}
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
                                    href={'/member/income'}
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