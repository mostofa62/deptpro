"use client";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import FormikFormHolder from "@/app/components/form/FormikFormHolder";
import useAuth from '@/app/hooks/useAuth';
import axios from "axios";
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";


import AdminLayout from "@/app/layout/AdminLayout";
import toast from 'react-hot-toast';
import HolderOne from "@/app/layout/HolderOne";
import {AdminRoles} from '@/app/data/AdminOptions.json';
const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate() {
    const authCtx = useAuth();
    const router = useRouter()
    const formRef = useRef<any>(null);
    const role:number = AdminRoles[0].value;    

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const fetchdata = fetchFomrData;

    
    

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}member-registrationpg`, 
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
            linkItems={[
              {
                link:'/admin/clients',
                title:'list client'
              },

              {
                link:'/admin/dashboard',
                title:'dashboard'
              },
              {
                link:'/admin/profile',
                title:'profile'
              }
            ]}
            />    

            

        

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