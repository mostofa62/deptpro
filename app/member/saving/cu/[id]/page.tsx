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
import FormikCheckInput from "@/app/components/form/FormikCheckInput";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    category:Options[],    
    repeat_frequency:Options[],
    saving_boost_source:Options[]    
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
        category: [],        
        repeat_frequency: [],
        saving_boost_source:[]        

    }

    const SavingCategoryData:any = useFetchDropDownObjects({
        urlSuffix:`savingcategory-dropdown/${user_id}`,
        payLoads:payload
    })
    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}saving/${id}`);
        //return response.data.user;
        setFetchFormData(response.data.saving);
        
        
    },[id]);
    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);
    const fetchdata = {...DataSchema,...fetchFomrData};

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-saving-account/${id}`, 
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
            router.push('/member/saving');
            
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
                        ADD SAVING
                      </p>
                    </div>

                    

                    <div className="px-10 flex justify-end w-[60%]">
                        <div>
                        <Link
                            href={'/member/saving'}
                            className={`text-[20px] h-[45px] capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-semibold duration-300 ease-in-out`}
                        >                            

                            <p className="text-[20px] font-semibold capitalize">Saving Accounts</p>
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
            <FormikFormHolder legend="SAVING Account Details">

<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">
        
        

<FormikFieldInput 
        label={DataLabel.saver} 
        name={`fetchdata.saver`}
        placeHolder={`${DataLabel.saver}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.saver &&
            touched.fetchdata &&            
            touched.fetchdata.saver &&  errors.fetchdata.saver}
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


    <FormikFieldInput 
        label={DataLabel.nickname} 
        name={`fetchdata.nickname`}
        placeHolder={`${DataLabel.nickname}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.nickname &&
            touched.fetchdata &&            
            touched.fetchdata.nickname &&  errors.fetchdata.nickname}
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
            label={DataLabel.category}
            defaultValue={fetchdata.category}
            placeHolder={`Select ${DataLabel.category}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.category"
            dataOptions={SavingCategoryData.category}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.category &&
                touched.fetchdata &&
                touched.fetchdata.category &&
                errors.fetchdata.category.label
            }
        />

    
        

    
        
        
    </div>
</div>




<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.interest} %`} 
        name={`fetchdata.interest`}
        placeHolder={`${DataLabel.interest}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.interest &&
            touched.fetchdata &&            
            touched.fetchdata.interest &&  errors.fetchdata.interest}        
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.goal_amount} $`} 
        name={`fetchdata.goal_amount`}
        placeHolder={`${DataLabel.goal_amount}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.goal_amount &&
            touched.fetchdata &&            
            touched.fetchdata.goal_amount &&  errors.fetchdata.goal_amount}        
        />

    
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">


    <FormikFieldInput 
        type="date"         
        label={DataLabel.starting_date} 
        name={`fetchdata.starting_date`}
        placeHolder={`${DataLabel.starting_date}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.starting_date &&
            touched.fetchdata &&            
            touched.fetchdata.starting_date &&  errors.fetchdata.starting_date}               
        />

    

    
        
        
    </div>

   
</div>


<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.starting_amount} $`} 
        name={`fetchdata.starting_amount`}
        placeHolder={`${DataLabel.starting_amount}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.starting_amount &&
            touched.fetchdata &&            
            touched.fetchdata.starting_amount &&  errors.fetchdata.starting_amount}        
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.contribution} $`} 
        name={`fetchdata.contribution`}
        placeHolder={`${DataLabel.contribution}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.contribution &&
            touched.fetchdata &&            
            touched.fetchdata.contribution &&  errors.fetchdata.contribution}        
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
        dataOptions={SavingCategoryData.repeat_frequency}
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
    <div className="w-[32%]">
        
        

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.saving_boost} $`} 
        name={`fetchdata.saving_boost`}
        placeHolder={`${DataLabel.saving_boost}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.saving_boost &&
            touched.fetchdata &&            
            touched.fetchdata.saving_boost &&  errors.fetchdata.saving_boost}        
        />
        
        
         
    </div>

    <div className="ml-[24px] w-[32%]">
        
    <FormikSelectCreatableInput
            label={DataLabel.saving_boost_source}
            defaultValue={fetchdata.saving_boost_source}
            placeHolder={`Select ${DataLabel.saving_boost_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.saving_boost_source"
            dataOptions={SavingCategoryData.saving_boost_source}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.saving_boost_source &&
                touched.fetchdata &&
                touched.fetchdata.saving_boost_source &&
                errors.fetchdata.saving_boost_source.label
            }
        />
        
        
        
    </div>


    <div className="ml-[24px] w-[32%]">


    <FormikSelectInput
        label={DataLabel.repeat_boost}
        defaultValue={fetchdata.repeat_boost}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.repeat_boost"
        dataOptions={SavingCategoryData.repeat_frequency}
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
    <div className="w-[32%]">
        
        

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

    <div className="ml-[24px] w-[32%]">

        

     
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

    <div className="ml-[24px] w-[32%]">
        
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


            <div className="mt-10">
                <div className="flex flex-row-reverse gap-4">
                    <div className="relative right-5 top-0">
                        <button type="button" className="text-[15px] h-[40px] bg-[#0166FF] rounded text-white px-4  capitalize text-center font-semibold" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                    <div className="relative right-[30px] top-[10px]">
                    <Link
                                    href={'/member/saving'}
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