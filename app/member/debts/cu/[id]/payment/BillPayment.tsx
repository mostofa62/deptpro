import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import {  Form, Formik } from "formik";

import {  useState } from "react";
import { DataLabel,  ValidationSchema } from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";


interface paymentProps{
    trans_id:string;
    amount:number;
    pay_date:string;
    cleanData:()=>void
}

const url = process.env.NEXT_PUBLIC_API_URL;
const BillPayment = ({trans_id,amount,pay_date,cleanData}:paymentProps)=>{

    const [fetchFomrData,setFetchFormData] = useState({amount,pay_date});

    //setFetchFormData({amount,pay_date})

    const fetchdata = fetchFomrData;

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}pay-bill`, 
            {trans_id,...values.fetchdata}, {
            
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ) .then(function (response) {
          //console.log(response);

          if(response.data.result > 0){
            toast.success(response.data.message);
            resetForm();
            cleanData()
            
          }else{
            toast.error(response.data.message);
          }         
          
        })
        .catch(function (error) {
            toast.error(error);
          //console.log(error);
        });

    }

    return(
        <CardHolderDefault>

            <p className="text-[16px] uppercase font-medium">Add a Bill Payment</p>

            <hr className="mt-2 border-stroke"/>

            <div className="grid grid-flow-row">
            <Formik
            
        initialValues={{ fetchdata }}        
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <Form className="mt-5">

            <div className="flex flex-row">
                <div className="w-full">

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
            </div>
            <div className="flex flex-row mt-2">
                <div className="w-full">

                <FormikFieldInput 
                    
                    label={DataLabel.amount} 
                    name={`fetchdata.amount`}
                    placeHolder={`${DataLabel.amount}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.amount &&
                        touched.fetchdata &&            
                        touched.fetchdata.amount &&  errors.fetchdata.amount}
                        type="number"
                        max={values.fetchdata.amount}
                        min={0} 
                          
                    />
                    
                    
                </div>
            </div>
            

            <hr className="mt-8 border-stroke"/>

            <div className="flex flex-row-reverse mt-4">
                <div className="w-[40%]">
                        <button  type="submit" className="text-[15px] h-[40px] bg-[#0166FF] rounded text-white px-4  capitalize text-center font-semibold">
                            Save
                        </button>
                </div>
                <div className="w-[40%]">
                        <button type="button" onClick={cleanData} className="text-[15px] h-[40px] bg-[#85878a] rounded text-white px-4  capitalize text-center font-semibold">
                            Cancel
                        </button>
                </div>
            </div>

            
            </Form>
            
        )}
        />
            </div>
        </CardHolderDefault>
    )


}

export default BillPayment;