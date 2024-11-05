"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef } from "react";
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
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import CheckComponent from "@/app/components/CheckComponent";
import FormikCheckInput from "@/app/components/form/FormikCheckInput";
import DebtRocket from "@/app/images/icon/debtrocket";
import VideoComponent from "@/app/components/utils/VideoComponent";
import HolderOne from "@/app/layout/HolderOne";
import Tooltip from "@/app/components/ui/Tooltip";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    category:Options[],    
    repeat_frequency:Options[],
    saving_interest_type:Options[],
    saving_strategy_type:Options[],    
}

export default function InsuranceCreate() {
    const authCtx = useAuth();
    const user_id = authCtx.userId;
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    
    

    const payload: PayLoads ={
        category: [],        
        repeat_frequency: [],
        saving_interest_type:[],
        saving_strategy_type:[]        

    }

    const SavingCategoryData:any = useFetchDropDownObjects({
        urlSuffix:`savingcategory-dropdown/${user_id}`,
        payLoads:payload
    })

    

    const fetchdata = fetchFomrData;

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-saving-account`, 
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


        <HolderOne
            title="add savings"            
            linkItems={[
                {
                link:'/member/saving',
                title:'your savings dashboard'
                }
            ]}
            />


       



            <div className="flex flex-row mt-2">
            <div className="p-9">
                <DebtRocket width={110} height={92} />

            </div>
            <div className="flex flex-col">
                <div className="py-2 mt-7">
                    <p className="text-[#31c4a2] text-[25px] font-semibold">
                    Build Wealth
                    </p>
                </div>
                <div className="mt-1">
                    <p className="text-[17px] text-[#4f4f4f]">
                    Begin saving and unleash your financial power. 
                    Even small contributions can add quickly!
                    </p>
                </div>

            </div>

            <div className="py-2 mx-auto">


                    <div className="">
                       
                       <VideoComponent
                           src="/animated/savingentry.mp4"
                           width={`380`}
                           controls={false} // Disable default video controls (optional)
                           autoplay={true}
                           loop={true}
                           showControls={false}
                       />
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
            <FormikFormHolder>

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
        label={`${DataLabel.goal_amount}`} 
        name={`fetchdata.goal_amount`}
        placeHolder={`${DataLabel.goal_amount}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.goal_amount &&
            touched.fetchdata &&            
            touched.fetchdata.goal_amount &&  errors.fetchdata.goal_amount}
            inputPreix={`$`}         
        />
        
        
    </div>

    <div className="ml-[24px] w-[32%]">


    <FormikSelectInput
        label={DataLabel.savings_strategy}
        defaultValue={fetchdata.savings_strategy}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.savings_strategy"
        dataOptions={SavingCategoryData.saving_strategy_type}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.savings_strategy &&
            touched.fetchdata &&
            touched.fetchdata.savings_strategy &&
            errors.fetchdata.savings_strategy.value
        }
    />

    

    
        
        
    </div>
    
    <div className="ml-[24px] w-[32%]">


    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.interest}`} 
        name={`fetchdata.interest`}
        placeHolder={`${DataLabel.interest}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.interest &&
            touched.fetchdata &&            
            touched.fetchdata.interest &&  errors.fetchdata.interest}
            inputSuffix={`%`}        
        />

        
        
    </div>

   
</div>


<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">


    <FormikSelectInput
        label={DataLabel.interest_type}
        defaultValue={fetchdata.interest_type}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.interest_type"
        dataOptions={SavingCategoryData.saving_interest_type}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.interest_type &&
            touched.fetchdata &&
            touched.fetchdata.interest_type &&
            errors.fetchdata.interest_type.value
        }
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
    
    <div className="ml-[24px] w-[32%]">

    <Tooltip text={<p className="flex flex-col items-center justify-center">
        <span>You may be jump starting your savings account</span>
        <span>or</span> 
        <span>currrently has funds</span>        
        </p>}> 

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.starting_amount}`} 
        name={`fetchdata.starting_amount`}
        placeHolder={`${DataLabel.starting_amount}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.starting_amount &&
            touched.fetchdata &&            
            touched.fetchdata.starting_amount &&  errors.fetchdata.starting_amount}
            inputPreix={`$`}         
        />
</Tooltip>

    
    

    
        
        
    </div>

   
</div>


<div className="flex flex-row mt-[15px]">
    <div className="w-[32%]">
    <Tooltip text={<div className="flex flex-col items-start justify-center gap-0">
        <p className="whitespace-normal leading-normal">
        This is an amount you choose to regularly fund your savings.
        </p>
        <p className="whitespace-normal leading-normal">The Savings Boost are for one time contributions.</p>
        <p className="whitespace-normal leading-normal">You can add multiple one time contributions here.</p>
        <p className="whitespace-normal leading-normal">IE: Putting your tips into savingsseveral times a month.</p>  
        <p className="whitespace-normal leading-normal">A little adds up quickly!  </p>
        </div>}>        
   
        
    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.contribution}`} 
        name={`fetchdata.contribution`}
        placeHolder={`${DataLabel.contribution}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.contribution &&
            touched.fetchdata &&            
            touched.fetchdata.contribution &&  errors.fetchdata.contribution}
            inputPreix={`$`}         
        />
        </Tooltip>
        
        
        
    </div>

    <div className="ml-[24px] w-[32%]">

    <Tooltip text={<p className="flex flex-col items-center justify-center">
        <span>ie: Add an increasing $1 each week.</span>
        <span>ie: week 1 = $1.  Week 4 would be $4. </span>
        <span>Incremental savings can add up quickly. </span>
        </p>}>

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={`${DataLabel.increase_contribution_by}`} 
        name={`fetchdata.increase_contribution_by`}
        placeHolder={`${DataLabel.increase_contribution_by}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.increase_contribution_by &&
            touched.fetchdata &&            
            touched.fetchdata.increase_contribution_by &&  errors.fetchdata.increase_contribution_by}
            inputPreix={`$`}         
        />

     
   </Tooltip>
        
    
        
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
            errors.fetchdata.repeat.value
        }
    />
        
    
        
        
        
    </div>
    
    
</div>


<div className="flex flex-row mt-[15px]">

<div className="w-[32%]">
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
                        <button type="button" className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                    <div className="relative right-[30px] top-[10px]">
                    <Link
                                    href={'/member/saving'}
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