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
    
    //const IncomeTypeData = useFetchDropDownData({urlSuffix:'incometype-dropdown'});

    //const IncomeSourceTypeData = useFetchDropDownData({urlSuffix:'incomesourcetype-dropdown'});

    const IncomeTypeData = [
        {'label':'job','value':1},
        {'label':'2nd job','value':2},
        {'label':'side gig','value':3},
        {'label':'rental','value':4},
        {'label':'pension','value':5}
    ]

    const IncomeSourceTypeData = [
        {'label':'Bonus','value':1},
        {'label':'Comission','value':2},
        {'label':'Tips','value':3},
        {'label':'Treasure','value':4}        
    ]


    const RepeatFrequency = [
        {'label':'Daily','value':1},
        {'label':'Weekly','value':2},
        {'label':'BiWeekly','value':3},
        {'label':'Monthly','value':4},
        {'label':'Annual','value':5}           
    ]
    

    const fetchdata = fetchFomrData;

    const user_id = authCtx.userId;

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-income-account`, 
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

            

            <div className="mt-[40px]">
                <div className="flex flex-row h-[29px]">
                    <div className="h-[21px] pt-[5px] pb-[3px]">
                            <Link
                                    href={'/member/income'}
                                    className={`text-[21px] capitalize group relative flex items-center gap-2 rounded-sm py-[3px] font-medium duration-300 ease-in-out   text-[#0166FF]`}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={15} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>


                                Back
                            </Link>
                    </div>
                    <div className="ml-[50px] pt-[5px]">
                        <span className="text-[25px] font-medium capitalize text-[#4F4F4F]">ADD NEW INCOME ACCOUNT</span>
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
            <FormikFormHolder legend="INCOME Account Details">

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
        
    <FormikSelectInput
            label={DataLabel.income_source}
            defaultValue={fetchdata.income_source}
            placeHolder={`Select ${DataLabel.income_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income_source"
            dataOptions={IncomeTypeData}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.income_source &&
                touched.fetchdata &&
                touched.fetchdata.income_source &&
                errors.fetchdata.income_source.label
            }
        />
        
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.monthly_gross_income} 
        name={`fetchdata.monthly_gross_income`}
        placeHolder={`${DataLabel.monthly_gross_income}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.monthly_gross_income &&
            touched.fetchdata &&            
            touched.fetchdata.monthly_gross_income &&  errors.fetchdata.monthly_gross_income}        
        />
        

    
        
        
    </div>
</div>




<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.monthly_net_income} 
        name={`fetchdata.monthly_net_income`}
        placeHolder={`${DataLabel.monthly_net_income}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.monthly_net_income &&
            touched.fetchdata &&            
            touched.fetchdata.monthly_net_income &&  errors.fetchdata.monthly_net_income}        
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    

    <FormikFieldInput 
        type="date"
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
        dataOptions={RepeatFrequency}
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
    <div className="w-[50%]">
        
        

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.income_boost} 
        name={`fetchdata.income_boost`}
        placeHolder={`${DataLabel.income_boost}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.income_boost &&
            touched.fetchdata &&            
            touched.fetchdata.income_boost &&  errors.fetchdata.income_boost}        
        />
        
        
        
    </div>

    <div className="ml-[24px] w-[50%]">
        
    <FormikSelectInput
            label={DataLabel.income_boost_source}
            defaultValue={fetchdata.income_boost_source}
            placeHolder={`Select ${DataLabel.income_boost_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income_boost_source"
            dataOptions={IncomeSourceTypeData}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.income_boost_source &&
                touched.fetchdata &&
                touched.fetchdata.income_boost_source &&
                errors.fetchdata.income_boost_source.label
            }
        />
        
        
        
    </div>
    
    
</div>

<div className="flex flex-row mt-[15px]">
    <div className="w-[50%]">
        
        

    <FormikFieldInput 
        type="date"
        label={DataLabel.pay_date_boost} 
        name={`fetchdata.pay_date_boost`}
        placeHolder={`${DataLabel.pay_date_boost}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.pay_date_boost &&
            touched.fetchdata &&            
            touched.fetchdata.pay_date_boost &&  errors.fetchdata.pay_date_boost}        
        />
        
        
        
    </div>

    <div className="ml-[24px] w-[50%]">
        
    <FormikSelectInput
        label={DataLabel.repeat_boost}
        defaultValue={fetchdata.repeat_boost}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.repeat_boost"
        dataOptions={RepeatFrequency}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.repeat_boost &&
            touched.fetchdata &&
            touched.fetchdata.repeat_boost &&
            errors.fetchdata.repeat_boost.label
        }
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