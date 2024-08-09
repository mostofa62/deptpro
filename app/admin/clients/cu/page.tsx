"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState, useRef } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import { useRouter } from "next/navigation";
import {Formik,yupToFormErrors, validateYupSchema} from 'formik';
import { DataSchema,DataLabel,ValidationSchema } from "./DataValidationSchema";
import FormikFormHolder from "@/app/components/form/FormikFormHolder";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";


import toast from 'react-hot-toast';

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);    

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const fetchdata = fetchFomrData;

    
    

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}member-registration`, 
            values.fetchdata, {
            
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ) .then(function (response) {
          //console.log(response);

          if(response.data.error > 0){
            toast.error(response.data.message);
          }else{
            toast.success(response.data.message);
            resetForm();
            router.push('/admin/clients')
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
                                    href={'/admin/clients'}
                                    className={`text-[21px] capitalize group relative flex items-center gap-2 rounded-sm py-[3px] font-medium duration-300 ease-in-out   text-[#0166FF]`}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={15} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>


                                Back
                            </Link>
                    </div>
                    <div className="ml-[50px] pt-[5px]">
                        <span className="text-[25px] font-medium capitalize text-[#4F4F4F]">Add Clients</span>
                    </div>
                </div>
            
            </div>

            <div className="mt-[32px]">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        /*validationSchema={ValidationSchema}*/
        validateOnChange={false}
        /*validateOnBlur={false}*/
        validate={async (value) => {
            try {
              await validateYupSchema(value, ValidationSchema, false, {'newentry':'1'});
            } catch (err) {
              return yupToFormErrors(err); //for rendering validation errors
            }
          
            return {};
          }}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="Client Details">

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

    <FormikFieldInput 
        label={DataLabel.email} 
        name={`fetchdata.email`}
        placeHolder={`${DataLabel.email}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.email &&
            touched.fetchdata &&            
            touched.fetchdata.email &&  errors.fetchdata.email}        
        />
        
        
    </div>
</div>


<div className="flex flex-row">
    <div className="w-[50%]">

    <FormikFieldInput 
        label={DataLabel.phone} 
        name={`fetchdata.phone`}
        placeHolder={`${DataLabel.phone}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.phone &&
            touched.fetchdata &&            
            touched.fetchdata.phone &&  errors.fetchdata.phone}        
        />
        
        
    </div>
    
    <div className="ml-[24px] w-[50%]">

    <FormikFieldInput 
        label={DataLabel.password} 
        name={`fetchdata.password`}
        placeHolder={`${DataLabel.password}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.password &&
            touched.fetchdata &&            
            touched.fetchdata.password &&  errors.fetchdata.password}        
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
                                    href={'/admin/clients'}
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