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
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import VideoComponent from "@/app/components/utils/VideoComponent";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    income_source:Options[],
    income_boost_source:Options[],
    repeat_frequency:Options[],
}

export default function InsuranceCreate() {
    const authCtx = useAuth();
    const user_id = authCtx.userId;
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    
    

    const payload: PayLoads ={
        income_source: [],
        income_boost_source: [],
        repeat_frequency: [],
    }

    const IncomeSourceBoostData:any = useFetchDropDownObjects({
        urlSuffix:`incomesourceboost-dropdown/${user_id}`,
        payLoads:payload
    })

    

    const fetchdata = fetchFomrData;

    

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


        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
              <div className="flex flex-row h-[70px] py-3 px-10">
                    <div className="py-[10px] w-[40%]">                    
                      <p className="text-[25px]  leading-[25px] uppercase  font-medium">
                        ADD INCOME
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/income'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold capitalize">Income Accounts</p>
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
            <FormikFormHolder legend="INCOME Account Details">

<div className="flex flex-row gap-2">

<div className="w-[35%] flex justify-center items-center">
        <div className="">
                       
            <VideoComponent
                src="/animated/incomentry.mp4"
                width={`350`}
                controls={false} // Disable default video controls (optional)
                autoplay={true}
                loop={true}
                showControls={false}
            />
        </div>
        </div>


<div className="w-[65%]">

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
        
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.monthly_gross_income} $`} 
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
        label={`${DataLabel.monthly_net_income} $`} 
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
    <div className="w-[50%]">
        
        

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.income_boost} $`} 
        name={`fetchdata.income_boost`}
        placeHolder={`${DataLabel.income_boost}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.income_boost &&
            touched.fetchdata &&            
            touched.fetchdata.income_boost &&  errors.fetchdata.income_boost}        
        />
        
        
         
    </div>

    <div className="ml-[24px] w-[50%]">
        
    <FormikSelectCreatableInput
            label={DataLabel.income_boost_source}
            defaultValue={fetchdata.income_boost_source}
            placeHolder={`Select ${DataLabel.income_boost_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income_boost_source"
            dataOptions={IncomeSourceBoostData.income_boost_source}
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
        dataOptions={IncomeSourceBoostData.repeat_frequency}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.repeat_boost &&
            touched.fetchdata &&
            touched.fetchdata.repeat_boost &&
            errors.fetchdata.repeat_boost.label
        }
    />
        
        
        
    </div>
    
    
</div>

<div className="flex flex-row mt-[15px]">
<div className="w-[50%]">
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

</div>

</div>

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
                                    href={'/member/income'}
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