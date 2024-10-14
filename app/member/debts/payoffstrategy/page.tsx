"use client";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import useAuth from "@/app/hooks/useAuth";
import DefaultLayout from "@/app/layout/DefaultLayout";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFormHolder from "@/app/components/form/FormikFormHolder";
import {DeptPayOffMethod,PayOffSelectedMonth} from '@/app/data/DebtOptions.json'

const url = process.env.NEXT_PUBLIC_API_URL;
const PayoffStrategy =()=>{

    const authCtx = useAuth();
    //const router = useRouter();
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const user_id = authCtx.userId;

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}get-payoff-strategy/${user_id}`);
        //return response.data.user;
        
        if(response.data.payoff_strategy!=null){
            setFetchFormData(response.data.payoff_strategy);
        }
    },[user_id]);
    
    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);

    const fetchdata = fetchFomrData;

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}save-payoff-strategy`, 
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
            //router.push('/member/debts');
            
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
        <DefaultLayout>
            <div className="flex flex-col gap-1 mt-4">

                

            </div>

            <div className="mt-4">
            <Formik
            innerRef={formRef}
            
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder legend="debt snowBall Table">

<div className="flex flex-row gap-1">
  

    
    
    <div className="w-[30%]">

    <FormikSelectInput
            label={DataLabel.debt_payoff_method}
            defaultValue={fetchdata.debt_payoff_method}
            placeHolder={`Select ${DataLabel.debt_payoff_method}`}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.debt_payoff_method"
            dataOptions={DeptPayOffMethod}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.debt_payoff_method &&
                touched.fetchdata &&
                touched.fetchdata.debt_payoff_method &&
                errors.fetchdata.debt_payoff_method.value
            }
        />
        

    
        
        
    </div>

    <div className="w-[30%]">

    <FormikSelectInput
            label={DataLabel.selected_month}
            defaultValue={fetchdata.selected_month}
            placeHolder={``}
            isSearchable={true}
            isClearable={true}
            name="fetchdata.selected_month"
            dataOptions={PayOffSelectedMonth}
            errorMessage={errors.fetchdata &&
                errors.fetchdata.selected_month &&
                touched.fetchdata &&
                touched.fetchdata.selected_month &&
                errors.fetchdata.selected_month.value
            }
        />
        
        
    </div>

    <div className="w-[30%]">

    <FormikFieldInput 
        type="number"
        step="any"
        min={0}
        label={DataLabel.monthly_budget} 
        name={`fetchdata.monthly_budget`}
        placeHolder={`${DataLabel.monthly_budget}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.monthly_budget &&
            touched.fetchdata &&            
            touched.fetchdata.monthly_budget &&  errors.fetchdata.monthly_budget}        
        />
        
        
    </div>

    <div className="w-[10%] flex items-center justify-center">
            <div className=" relative top-5">
                <button type="submit" className="text-[15px] py-1 bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold">
                    apply
                </button>
            </div>
        
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
        </DefaultLayout>
    )


}

export default PayoffStrategy;