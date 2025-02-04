
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import CheckComponent from "@/app/components/CheckComponent";

const url = process.env.NEXT_PUBLIC_API_URL;

interface BillProps{
    bill_acc_id:string;
    user_id:string;
    editData:any;
    cleanData:()=>void
}

const BillEntry=({bill_acc_id, user_id,editData,cleanData}:BillProps)=>{

       

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    useEffect(()=>{
        setFetchFormData(editData)
    },[editData])

    const fetchdata = fetchFomrData;

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        const link:any = editData.id == ''? `${url}save-bill/${bill_acc_id}`:
        `${url}update-bill/${bill_acc_id}`;


        await axios.post(link, 
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
            resetForm();
            
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

    return(
        <CardHolderDefault>

            <p className="text-sm md:text-[16px] text-center md:text-left uppercase font-medium">{editData.id!='' ?`update bill entry AMOUNT: $ ${editData.amount}, DUE: ${editData.due_date}`:`add a bill entry`}</p>

            <hr className="mt-2 border-stroke"/>

            <div className="grid grid-flow-row">
            <Formik
            
        initialValues={{ fetchdata }}
        enableReinitialize        
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched}:any)=>(
            <Form className="mt-5">

            <div className="flex flex-row">
                <div className="w-full">

                <FormikFieldInput 
                type="date"
                label={DataLabel.due_date} 
                name={`fetchdata.due_date`}
                placeHolder={`${DataLabel.due_date}`}
                errorMessage ={ errors.fetchdata &&                                        
                    errors.fetchdata.due_date &&
                    touched.fetchdata &&            
                    touched.fetchdata.due_date &&  errors.fetchdata.due_date}        
                />
                    
                    
                </div>
            </div>
            <div className="flex flex-row mt-[15px]">
                <div className="w-full">

                <FormikFieldInput 
                    type="number"
                    label={DataLabel.amount} 
                    name={`fetchdata.amount`}
                    placeHolder={`${DataLabel.amount}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.amount &&
                        touched.fetchdata &&            
                        touched.fetchdata.amount &&  errors.fetchdata.amount}
                        
                        inputPreix={`$`} 
                    />
                    
                    
                </div>
            </div>

            <div className="flex flex-row mt-4">
                <div className="w-full">

                

                <Field 
                component={CheckComponent}
                    name="fetchdata.autopay"
                    label={DataLabel.autopay}    
                    checked={values.fetchdata.autopay === 1}
                    errorClass={errors.fetchdata && 
                        errors.fetchdata.autopay && 
                        touched.fetchdata && 
                        touched.fetchdata.autopay &&
                        'font-semibold text-[#B45454]'
                    }                                        
                    onChange={(e:any) => {
                        const {checked, name} = e.target;                        
                                
                        if (checked) {
                        setFieldTouched(name,true);

                        setFieldValue(
                            name,
                            1
                        );
                        
                        }else{
                            setFieldTouched(name,false);
                            setFieldValue(
                                name,
                                fetchdata.autopay
                            );

                        }
                    
                    }}
                    
                    />
                    
                    
                </div>
            </div>

            <hr className="mt-8 border-stroke"/>

            <div className="flex flex-row mt-4">
                <div className="w-[40%]">
                        <button  type="submit" className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold">
                            Save
                        </button>
                </div>
                {editData.id!='' &&
                        <div className="w-[40%]">
                                <button type="button" onClick={cleanData} className="text-[15px] h-[40px] bg-[#85878a] rounded text-white px-4  capitalize text-center font-semibold">
                                    Cancel
                                </button>
                        </div>
                }
            </div>

            
            </Form>
            
        )}
        />
            </div>
        </CardHolderDefault>
    )

}

export default BillEntry;