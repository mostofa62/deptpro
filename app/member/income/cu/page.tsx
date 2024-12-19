"use client";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import axios from "axios";
import { Formik } from 'formik';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";

import toast from 'react-hot-toast';

import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import VideoComponent from "@/app/components/utils/VideoComponent";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import HolderOne from "@/app/layout/HolderOne";
import { confirmAlert } from 'react-confirm-alert';
import { removeConfirmAlert } from '@/app/components/utils/Util';
import { AlertBox, DeleteActionGlobal } from '@/app/components/grid/useFetchGridData';


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    income_source:Options[],
    repeat_frequency:Options[],
}

interface IncomeSrcProps{
    label:string;
    value:string;
    bysystem:number;
}

export default function InsuranceCreate() {
    const authCtx = useAuth();
    const user_id = authCtx.userId;
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    
    const [incomeSource, setIncomeSource] = useState<IncomeSrcProps[]>([{
        label:'',
        value:'',
        bysystem:0
    }]);

    const payload: PayLoads ={
        income_source: [],        
        repeat_frequency: [],
    }

    const IncomeSourceBoostData:any = useFetchDropDownObjects({
        urlSuffix:`incomesourceboost-dropdown/${user_id}`,
        payLoads:payload
    })

    const IncomeSourceData:IncomeSrcProps[] = IncomeSourceBoostData.income_source;
    
    useEffect(()=>{
        setIncomeSource(IncomeSourceData)
    },[IncomeSourceData])


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

    const deleteAction=useCallback(async(data:IncomeSrcProps)=>{
        //console.log(data)
        const id = data.value;
        const name = data.label;
        const msg = `Do you want to delete this,${name}?`;

        confirmAlert({
                  title: msg,
                  message: 'Are you sure to do this?',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: async()=>{ 

                                                //console.log('filter', filterSource,id)
                        
                        
                        DeleteActionGlobal({        
                          action:'delete-income-source',        
                          data:{'id':id, 'key':1}
                        }).then((deletedData)=>{
                            
                            AlertBox(deletedData.message, deletedData.deleted_done);
                           
        
                            if(deletedData.deleted_done > 0){

                                const filterSource:IncomeSrcProps[] = incomeSource.filter((dt:IncomeSrcProps)=>dt.value!==id)

                                
                                removeConfirmAlert()
                                setIncomeSource(filterSource)
                            }
                        })
                        
                        
                      }
                    },
                    {
                      label: 'No',
                      onClick: () => ()=>{                
                        removeConfirmAlert()
                      }
                    }
                  ],
                  closeOnEscape: true,
                  closeOnClickOutside: true,
                
                });

    },[incomeSource])

    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">


        <HolderOne
            title="add income"            
            linkItems={[
              {
                link:'/member/income',
                title:'income dashboard'
              }
            ]}
            />


            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

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
            placeHolder={`${DataLabel.income_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income_source"
            dataOptions={incomeSource}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.income_source &&
                touched.fetchdata &&
                touched.fetchdata.income_source &&
                errors.fetchdata.income_source.label
            }

            toolTipText={<p className="flex flex-col whitespace-normal leading-tight"><span>ie: Job, 2nd job, side gig, rental,
        pension, social security, annuity, investments</span></p>}

        deleteSelectedOption={(data:IncomeSrcProps) => deleteAction(data)}
        />


        
        
        
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