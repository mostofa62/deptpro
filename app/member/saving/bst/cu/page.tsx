"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import {Field, Formik} from 'formik';
import { DataSchema,DataLabel,ValidationSchema } from "./DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from 'react-hot-toast';
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import DebtRocket from "@/app/images/icon/debtrocket";
import VideoComponent from "@/app/components/utils/VideoComponent";
import HolderOne from "@/app/layout/HolderOne";
import Tooltip from "@/app/components/ui/Tooltip";
import DashGrid from "@/app/images/icon/dash-grid";
import { removeConfirmAlert } from "@/app/components/utils/Util";
import { AlertBox, DeleteActionGlobal } from "@/app/components/grid/useFetchGridData";
import { confirmAlert } from "react-confirm-alert";


const url = process.env.NEXT_PUBLIC_API_URL;
interface Options{
    value:string;
    label:string;
}
interface PayLoads{
    
    repeat_frequency:Options[],
    saving_boost_source:Options[],
    saving_list:Options[]
    boost_operation_type:Options[],     
}

interface SavingSrcProps{
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
    const [minDate, setMinDate] = useState(null)    

    const [savingSource, setSavingSource] = useState<SavingSrcProps[]>([{
                label:'',
                value:'',
                bysystem:0
            }]);


    const payload: PayLoads ={
          
        repeat_frequency: [],
        saving_boost_source:[],
        saving_list:[],
        boost_operation_type:[]            

    }

    const SavingCategoryData:any = useFetchDropDownObjects({
        urlSuffix:`savingcategory-dropdownpg/${user_id}/boost`,
        payLoads:payload
    })

    const saving_boost_source = SavingCategoryData.saving_boost_source

    const repeatFrequency = [
        DataSchema.repeat_boost,
        ...SavingCategoryData.repeat_frequency
        
    ]

    useEffect(()=>{
        setSavingSource(saving_boost_source)
    },[saving_boost_source])

    

    

    const fetchdata = fetchFomrData;

    

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-saving-boostpg`, 
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

    const deleteAction=useCallback(async(data:SavingSrcProps)=>{
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
                                  action:'delete-savingboost-sourcepg',        
                                  data:{'id':id}
                                }).then((deletedData)=>{
                                    
                                    AlertBox(deletedData.message, deletedData.deleted_done);
                                   
                
                                    if(deletedData.deleted_done > 0){
        
                                        const filterSource:SavingSrcProps[] = savingSource.filter((dt:SavingSrcProps)=>dt.value!==id)
        
                                        
                                        removeConfirmAlert()
                                        setSavingSource(filterSource)
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
        
            },[savingSource])
    

    return(
        <>
        <DefaultLayout>
        <div className="flex flex-col md:grid grid-flow-row">


        <HolderOne
            title="add saving boost"            
            linkItems={[
                {
                link:'/member/saving',
                title:'your savings dashboard',                
                icon:<DashGrid width={16} height={16} />
                }
            ]}
            />


       



            <div className="hidden lmd:hidden md:flex flex-row mt-2">
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

            

            

        <div className="mt-2.5 md:mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

<div className="flex flex-col md:flex-row md:mt-[15px]">
    <div className="w-full md:w-[32%]">


    <FormikSelectInput
            label={DataLabel.saving}
            defaultValue={fetchdata.saving}
            placeHolder={``}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.saving"
            dataOptions={SavingCategoryData.saving_list}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.saving &&
                touched.fetchdata &&
                touched.fetchdata.saving &&
                errors.fetchdata.saving.label
            }
            onParentChangeSelect ={(v:any,n:any)=>{
                setMinDate(v.pay_date_boost) 
                //setRepeatFrequency([DataSchema.repeat_boost,v.repeat_boost])
                //setFieldValue('fetchdata.pay_date_boost',v.pay_date_boost)
                //setFieldValue('fetchdata.repeat_boost',v.repeat_boost)
                
                
            }}
        />
    
        
        


        
        
        
    </div>

    <div className="w-full md:ml-[24px] md:w-[32%]">


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
    
    <div className="w-full md:ml-[24px] md:w-[32%]">


    <FormikSelectInput
            label={DataLabel.boost_operation_type}
            defaultValue={fetchdata.boost_operation_type}
            placeHolder={``}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.boost_operation_type"
            dataOptions={SavingCategoryData.boost_operation_type}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.boost_operation_type &&
                touched.fetchdata &&
                touched.fetchdata.boost_operation_type &&
                errors.fetchdata.boost_operation_type.value
            }
        />


        
        
    </div>
</div>


<div className="flex flex-col md:flex-row md:mt-[15px]">
    <div className="w-full md:w-[32%]">

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
            inputPreix={`$`}         
        />


        
    </div>

    <div className="w-full md:ml-[24px] md:w-[32%]">
    
    <FormikSelectCreatableInput
            label={DataLabel.saving_boost_source}
            defaultValue={fetchdata.saving_boost_source}
            placeHolder={`Select ${DataLabel.saving_boost_source}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.saving_boost_source"
            dataOptions={savingSource}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.saving_boost_source &&
                touched.fetchdata &&
                touched.fetchdata.saving_boost_source &&
                errors.fetchdata.saving_boost_source.label
            }

            deleteSelectedOption={(data:SavingSrcProps) => deleteAction(data)}

            toolTipText={<p className="flex flex-col whitespace-normal leading-normal">
                <span>Bonus, Commissions, Tips, Treasures</span>
                </p>}
        />

    
        
    </div>

    


    <div className="w-full md:ml-[24px] md:w-[32%]">

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

    
    
    
</div>


<div className="flex flex-col md:flex-row md:mt-[15px]">
    <div className="w-full md:w-[32%]">

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

        <div className="w-full md:ml-[24px] md:w-[32%]">

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


{/* <div className="flex flex-row">
    {JSON.stringify(values)}
    {JSON.stringify(errors)}
</div> */}


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