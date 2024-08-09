"use client";
import FullPageLayout from "@/app/layout/FullPageLayout"
//import Chat from "./components/Chat";
import { useState,useEffect } from "react";
//import Link from "next/link";
import Image from 'next/image';
import Logo from '@/app/images/logo/logo.svg';
import {Formik, Form, Field, yupToFormErrors, validateYupSchema} from 'formik';
import { useRouter } from "next/navigation";
import axios from "axios";

//import AuthContext from "@/app/context/auth-context";
//import { Metadata, ResolvingMetadata } from 'next';
import useAuth from "@/app/hooks/useAuth";
import { setCookie } from 'cookies-next';
import Link from "next/link";
import { DataSchema, DataLabel,disclosureAck,ValidationSchema } from "./RegistrationSchema";
import CheckComponent from "@/app/components/CheckComponent";
/*
export const metadata = {
  title: 'Registration',
  description: 'Generated by create next app',
}
*/
const url = process.env.NEXT_PUBLIC_API_URL;
const app_name:any = process.env.app_name;
  
const Registration=()=> {
  

  const authContext = useAuth();
  const isLoggedIn = authContext.isLoggedIn;
  const router = useRouter()

/*
  useEffect(()=>{
    if(isLoggedIn){
      router.push('/dashboard');
    }
  },[isLoggedIn,router])
  */

  const [error, setError]=useState(0);
  const [errMessage, setErrMessage]=useState('');  
  const user=DataSchema;
  
  const handleFormSubmit = async(values:any,{ resetForm }:any)=>{

    

    await axios.post(`${url}member-registration`, 
    values.user, {
    
    headers: {
      'Content-Type': 'application/json'
    }
  }
) .then(function (response) {
  //console.log(response);
    
  if(response.data.error > 0){
    setError(response.data.error);
    setErrMessage(response.data.message);
  }else{
    setError(response.data.error);
    setErrMessage(response.data.message);
    resetForm();
  }
  
})
.catch(function (error) {
  //console.log(error);
    setError(0);
    setErrMessage(error);
});


}
  

  return (
    <FullPageLayout>
      <div className="rounded-sm border border-stroke bg-[#f5f5f8] shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/4">
            <div className="py-15 px-10 text-center">
              <a className="mb-5.5 inline-block justify-center " href="/">
              <Image src={Logo} alt={app_name} className="mx-5" height={150}  />
              {/*<span className='text-[#f1e56c]'>{app_name}</span>*/}
              </a>

              

              


              <span className="mt-15 inline-block">
               
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2">
            <div className="w-3/4 ml-[10%] xl:py-4">
              
              
              <h2 className="mb-1 font-bold  text-[#0a4a82] sm:text-[15px]">
                Registration
              </h2>
              

             {
                error < 1 && errMessage.length > 1 ?

                <span className="my-1 py-1 px-3 font-[10px] text-[#ffffff] bg-[#32b332]">
                {errMessage}
                <span className="relative top-0 left-2 p-2 cursor-pointer" onClick={()=>{
                    setErrMessage('');
                    setError(0);
                 }}>x</span>
                </span>:
                <span className="my-1 font-semibold text-[#B45454]">
                {errMessage}
                </span>
              }





              <Formik
        initialValues={{ user }}
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
<Form>

<div className="mb-2">
  <label className="mb-2.5 block font-medium">
    {DataLabel.name}
  </label>
  <div className="relative">
  <Field 
                 className="w-full rounded-sm border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
type="text" name="user.name" placeholder="" />
      {errors.user &&
                                        
                                        errors.user.name &&
                                        touched.user &&
                                        
                                        touched.user.name && ( 
                                            <span className="mt-3 font-semibold text-[#B45454]">
                                                {errors.user.name}
                                            </span>   
                                        )}
    

   
  </div>
</div>

<div className="mb-2">
                  <label className="mb-2.5 block font-medium">
                  {DataLabel.email}
                  </label>
                  <div className="relative">
                  <Field 
                  className="w-full rounded-sm border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"

 name="user.email" placeholder="provide userid or email"  onChange={(event:any)=>{
  //console.log(event.target.value)
  handleChange("user.email")(event)
if(event.target.value.includes('@')){  
  handleChange("user.isEmail")('1')
  //console.log(values.user.isEmail)
}else{
  handleChange("user.isEmail")('0')
}
   }}  />
      {errors.user &&
                                        
                                        errors.user.email &&
                                        touched.user &&
                                        
                                        touched.user.email && ( 
                                            <span className="mt-5 font-semibold text-[#B45454]">
                                                {errors.user.email}
                                            </span>   
                                        )}
                    

                   
                  </div>
</div>


<div className="mb-2">
  <label className="mb-2.5 block font-medium">
  {DataLabel.phone}
  </label>
  <div className="relative">
  <Field 
                 className="w-full rounded-sm border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
type="text" name="user.phone" placeholder="" />
      {errors.user &&
                                        
                                        errors.user.phone &&
                                        touched.user &&
                                        
                                        touched.user.phone && ( 
                                            <span className="mt-3 font-semibold text-[#B45454]">
                                                {errors.user.phone}
                                            </span>   
                                        )}
    

   
  </div>
</div>

<div className="mb-6">
  <label className="mb-2.5 block font-medium">
    {DataLabel.password}
  </label>
  <div className="relative">
  <Field 
                 className="w-full rounded-sm border border-stroke bg-transparent py-1 pl-6 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
type="password" name="user.password" placeholder="" />
      {errors.user &&
                                        
                                        errors.user.password &&
                                        touched.user &&
                                        
                                        touched.user.password && ( 
                                            <span className="mt-3 font-semibold text-[#B45454]">
                                                {errors.user.password}
                                            </span>   
                                        )}
    

   
  </div>
</div>


<div className="mb-6">
  
  <div className="relative">

  <Field 
  component={CheckComponent}
    name="user.disclosure"
    label={DataLabel.disclosure}    
    checked={values.user.disclosure.value === disclosureAck.value}
    errorClass={errors.user && 
        errors.user.disclosure && 
        touched.user && 
        touched.user.disclosure &&
        'font-semibold text-[#B45454]'
    }                                        
    onChange={(e:any) => {
        const {checked, name} = e.target;
                
        if (checked) {
          setFieldTouched(name,true);

          setFieldValue(
              name,
              disclosureAck
          );
          
        }else{
            setFieldTouched(name,false);
            setFieldValue(
                name,
                user.disclosure
            );

        }
    
    }}
    
    />
      {/*errors.user &&
                                        
                                        errors.user.disclosure &&
                                        touched.user &&
                                        
                                        touched.user.disclosure && ( 
                                            <span className="mt-3 font-semibold text-[#B45454]">
                                                {errors.user.disclosure.label}
                                            </span>   
                                        )*/}
    

   
  </div>
</div>

<div className="mb-5 flex flex-row items-center">
                  <input
                    type="submit"
                    value="Register"
                    className="w-[50%] ml-[10%] cursor-pointer rounded-sm border border-primary bg-[#0a4a82] p-1 text-[#f5f5f8] transition hover:bg-opacity-90 md:font-medium"
                  />
                </div>
</Form>
        )}
        />

                
<Link className="top-1 ml-[20%] relative text-md font-bold  text-[#0a4a82]" href='/member'>Already Registerd, Login</Link>

                
              
            </div>
          </div>
        </div>
      </div>
    
    </FullPageLayout>
  )
}
/*
export async function generateMetadata() {
  // read route params then fetch data

  // return an object
  return {
    title: 'Registration',
    //description: '',
  };
}
*/


export default Registration;