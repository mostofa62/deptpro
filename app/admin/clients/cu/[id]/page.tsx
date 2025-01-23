"use client";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import FormikFormHolder from "@/app/components/form/FormikFormHolder";
import useAuth from '@/app/hooks/useAuth';
import AdminLayout from "@/app/layout/AdminLayout";
import axios from "axios";
import { Formik } from 'formik';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { DataLabel, DataSchema, ValidationSchema } from "../DataValidationSchema";
import HolderOne from "@/app/layout/HolderOne";
import {AdminRoles} from '@/app/data/AdminOptions.json';
const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate({
    params,
    searchParams
  }:{
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  
  }) {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);
    const role:number = AdminRoles[0].value; 

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    //console.log(fetchFomrData)
    
      
    const id = params.id;
    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}users/${id}`);
        //return response.data.user;
        setFetchFormData({id,...response.data.user});
    },[id]);
    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);
    const fetchdata = fetchFomrData;
    fetchdata.password = '';
    //console.log(fetchdata);
    

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));
        
        await axios.post(`${url}user-create/${id}`, 
            values.fetchdata, {
            
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ) .then(function (response) {
          //console.log(response);

          if(response.data.error > 0){
            toast.error(response.data.message);
          }else{
            toast.success(response.data.message);
            router.push('/admin/clients');
            //resetForm();
          }
          /*
          if(response.data.agency_id!=null){

            resetForm();

            
            
            
            //router.push('/admin/agency/cu');
          }*/
          
        })
        .catch(function (error) {
            toast.error(error);
          //console.log(error);
        });
        

    }

    const handleSubmit = ()=> {
        formRef.current?.handleSubmit();
      }


      const linkItems = [
        {
          link: "/admin/clients/cu",
          title: "create client",
        },
        {
          link: "/admin/dashboard",
          title: "dashboard",
        },
        {
          link: "/admin/profile",
          title: "profile",
        },
        ...(role < 2
          ? [
              {
                link: "/admin/admins/cu",
                title: "create admin",
              },
            ]
          : []),
      ];

    return(
        <>
        <AdminLayout>
        <div className="flex flex-col">

           
        <HolderOne
            title="clients"            
            linkItems={linkItems}
            /> 
        

            <div className="mt-8">
            <Formik
            innerRef={formRef}
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

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
    type="password"
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
                        <button type="button" className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                    <div className="relative right-[30px] top-[10px]">
                    <Link
                                    href={'/admin/clients'}
                                    className={`text-[15px] h-[40px] capitalize text-center px-4 py-2.5  font-semibold bg-[#43ACD6] rounded bg-opacity-5 text-[#43ACD6]`}
                                >                               


                                Cancel
                            </Link>
                    </div>
                    
                    

                </div> 
                
            </div>

        </div>
        </AdminLayout>
        </>

    )
}