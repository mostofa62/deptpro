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
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import VideoComponent from "@/app/components/utils/VideoComponent";
import HolderOne from "@/app/layout/HolderOne";
import Tooltip from "@/app/components/ui/Tooltip";
import DashGrid from "@/app/images/icon/dash-grid";
import { confirmAlert } from "react-confirm-alert";
import { AlertBox, DeleteActionGlobal } from "@/app/components/grid/useFetchGridData";
import { removeConfirmAlert } from "@/app/components/utils/Util";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    
    income_boost_source:Options[],
    repeat_frequency:Options[],
    income_list:Options[],
}

interface IncomeSrcProps{
    label:string;
    value:string;
    bysystem:number;
}

export default function InsuranceCreate() {
    const authCtx = useAuth();
    const user_id = authCtx.userId;
    const admin_id = authCtx.adminId;
    const router = useRouter()
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    const [minDate, setMinDate] = useState(null)

    const [incomeBoostSource, setIncomeBoostSource] = useState<IncomeSrcProps[]>([{
            label:'',
            value:'',
            bysystem:0
        }]);

    // const [repeatFrequency, setRepeatFrequency] = useState([
    //     DataSchema.repeat_boost
    // ])

    
    
    

    const payload: PayLoads ={
        income_boost_source: [],
        repeat_frequency: [],
        income_list:[]
    }

    const IncomeSourceBoostData:any = useFetchDropDownObjects({
        urlSuffix:`incomesourceboostpg-dropdown/${user_id}/boost`,
        payLoads:payload
    })

    const IncomeBouseSourceData:IncomeSrcProps[] = IncomeSourceBoostData.income_boost_source;

    useEffect(()=>{
        setIncomeBoostSource(IncomeBouseSourceData)
    },[IncomeBouseSourceData])

    const repeatFrequency = [
        DataSchema.repeat_boost,
        ...IncomeSourceBoostData.repeat_frequency
        
    ]
    

    

    const fetchdata = fetchFomrData;

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-income-boostpg`, 
            {user_id,admin_id,...values.fetchdata}, {
            
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
                              action:'delete-incomeboost-sourcepg',        
                              data:{'id':id}
                            }).then((deletedData)=>{
                                
                                AlertBox(deletedData.message, deletedData.deleted_done);
                               
            
                                if(deletedData.deleted_done > 0){
    
                                    const filterSource:IncomeSrcProps[] = incomeBoostSource.filter((dt:IncomeSrcProps)=>dt.value!==id)
    
                                    
                                    removeConfirmAlert()
                                    setIncomeBoostSource(filterSource)
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
    
        },[incomeBoostSource])

    return(
        <>
        <DefaultLayout>
        <div className="flex flex-col md:grid grid-flow-row">


        <HolderOne
            title="add income boost"            
            linkItems={[
              {
                link:'/member/income',
                title:'income dashboard',
                icon:<DashGrid width={16} height={16} />
              }
            ]}
            />



      

            

            

<div className="mt-2.5 md:mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

<div className="flex flex-col md:flex-row gap-2">

<div className="w-full md:w-[35%] flex justify-center items-center">
<div className="hidden md:block">
                       
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


<div className="w-full md:w-[65%]">

<div className="flex flex-col md:flex-row md:mt-[15px] gap-2">

<div className="w-full md:w-[50%]">

<FormikSelectInput
            label={DataLabel.income}
            defaultValue={fetchdata.income}
            placeHolder={``}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.income"
            dataOptions={IncomeSourceBoostData.income_list}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.income &&
                touched.fetchdata &&
                touched.fetchdata.income &&
                errors.fetchdata.income.label
            }
            onParentChangeSelect ={(v:any,n:any)=>{
                setMinDate(v.pay_date_boost) 
                //setRepeatFrequency([DataSchema.repeat_boost,v.repeat_boost])
                //setFieldValue('fetchdata.pay_date_boost',v.pay_date_boost)
                //setFieldValue('fetchdata.repeat_boost',v.repeat_boost)
                
                
            }}
        />



        </div>
        <div className="md:ml-[24px] md:w-[50%]">


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

    
    
    
</div>

<div className="flex flex-col md:flex-row md:mt-[15px] gap-2">

<div className="md:w-[50%]">

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
            inputPreix={`$`}        
        />
        
        
        
            
            
            
        </div>
        <div className="md:ml-[24px] md:w-[50%]">
    
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

                toolTipText={<p className="flex flex-col whitespace-normal leading-tight"><span>Bonus, Commissions, Tips, Treasures</span></p>}
                deleteSelectedOption={(data:IncomeSrcProps) => deleteAction(data)}
            />

   

    
        
        
        
    </div>

    
    
    
</div>

<div className="flex flex-col md:flex-row md:mt-[15px] py-1">

<div className="md:w-[50%] w-full">

<FormikFieldInput 
        type="date"
        min={minDate ? minDate : ''}            
        label={DataLabel.pay_date_boost} 
        name={`fetchdata.pay_date_boost`}
        placeHolder={`${DataLabel.pay_date_boost}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.pay_date_boost &&
            touched.fetchdata &&            
            touched.fetchdata.pay_date_boost &&  errors.fetchdata.pay_date_boost}
                   
        />
        
            
            
            
        </div>
<div className="md:ml-[24px]  md:w-[50%]">

<FormikSelectInput
            label={DataLabel.repeat_boost}
            defaultValue={fetchdata.repeat_boost}
            placeHolder={``}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.repeat_boost"
            dataOptions={repeatFrequency}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.repeat_boost &&
                touched.fetchdata &&
                touched.fetchdata.repeat_boost &&
                errors.fetchdata.repeat_boost.label
            }
        />

</div>
</div>

<div className="flex flex-col md:flex-row md:mt-[15px] py-1">
<div className="md:w-[50%] w-full">
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


            <div className="mt-2 md:mt-10">
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