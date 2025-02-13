"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
//import Chat from "./components/Chat";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {Formik, Form, Field} from 'formik';
import userSchema from "./userSchema";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";
import HolderOne from "@/app/layout/HolderOne";

const url = process.env.NEXT_PUBLIC_API_URL;

  
const PdfProcessList=()=> {
  
  const authCtx = useAuth();
  const router = useRouter();

  const [userdata,setUserdata] = useState({
    name:'',    
    email:'',
    phone:'',
    password:'',
  });

  
  const id = authCtx.userId;
  const fetchUser=useCallback(async()=>{
    //console.log(id);
    const response = await axios.get(`${url}userspg/${id}`);
    //return response.data.user;
    setUserdata({id,...response.data.user});
  },[id]);
  useEffect(()=>{
    fetchUser();
  
  },[fetchUser]);
  const user =userdata;
  user.password = '';
  //console.log(user)

  const handleFormSubmit = async(values:any)=>{

    //console.log(values);

    await axios.post(`${url}user-createpg/${id}`, 
    values.user, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
) .then(function (response) {
  //console.log(response);
  if(response.data.user){
      
      authCtx.selectedName(response.data.user.name);

      toast.success('Profile updated succssfully!')
      //router.push('/member/profile');
  }
})
.catch(function (error) {
  //console.log(error);
});

}
 
  return (
    <DefaultLayout>
<div className="flex flex-col">
<HolderOne
            title="profile"            
            linkItems={[
            //   {
            //     link:'/',
            //     title:''
            //   },              
            ]}
            />

<div className="mt-3 bg-[#fafafa] rounded-lg p-5">
        <Formik
        initialValues={{ user }}
        enableReinitialize
        validationSchema={userSchema}
        validateOnChange={false}
        validateOnBlur={false}


        onSubmit={handleFormSubmit}

        render={({isValid, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(

      <Form className="flex justify-center">
        <div className="md:w-8/12 xl:w-8/12 2xl:w-8/12 w-full p-2">
        <div className="my-3">
                <label className="mb-3 block  text-black dark:text-white">
                  Name
                </label>
      <Field 
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"

      name="user.name" placeholder="name of person" />
      {errors.user &&
                                        
                                        errors.user.name &&
                                        touched.user &&
                                        
                                        touched.user.name && ( 
                                            <span className="mb-3 font-semibold text-[#B45454]">
                                                {errors.user.name}
                                            </span>   
                                        )}
</div>



<div className="my-3">
                <label className="mb-3 block text-black dark:text-white">
                  Email
                </label>
<Field 
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"

type="email" name="user.email" placeholder="email of person" />
      {errors.user &&
                                        
                                        errors.user.email &&
                                        touched.user &&
                                        
                                        touched.user.email && ( 
                                            <span className="mb-3 font-semibold text-[#B45454]">
                                                {errors.user.email}
                                            </span>   
                                        )}
</div>

<div className="my-3">
                <label className="mb-3 block text-black dark:text-white">
                  Phone
                </label>
<Field 
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"

type="text" name="user.phone" placeholder="phone of person" />
      {errors.user &&
                                        
                                        errors.user.phone &&
                                        touched.user &&
                                        
                                        touched.user.phone && ( 
                                            <span className="mb-3 font-semibold text-[#B45454]">
                                                {errors.user.phone}
                                            </span>   
                                        )}
</div>

<div className="my-3">
                <label className="mb-3 block text-black dark:text-white">
                  Password
                </label>
<Field 
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"

type="password" name="user.password" placeholder="password" />
      {errors.user &&
                                        
                                        errors.user.password &&
                                        touched.user &&
                                        
                                        touched.user.password && ( 
                                            <span className="mb-3 font-semibold text-[#B45454]">
                                                {errors.user.password}
                                            </span>   
                                        )}                                        
</div>
<div className="w-full my-5">
<button 
disabled={isSubmitting} type="submit"
 className="flex w-full justify-center rounded border-primary bg-[#43acd6] p-3 font-medium text-white">
  Save
</button>
                    </div>
                    {/*
                    <code>
                        <pre>Values: {JSON.stringify(values, null, 2)}</pre>
                    </code>
                    <code>
                        <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                    </code>
                                        */}
                                        </div>
      </Form>
        )}
      />
</div>
</div>
    </DefaultLayout>
  )
}

export default PdfProcessList;