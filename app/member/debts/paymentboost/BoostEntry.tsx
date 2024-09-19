
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import CheckComponent from "@/app/components/CheckComponent";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import useApp from "@/app/hooks/useApp";

const url = process.env.NEXT_PUBLIC_API_URL;

interface BoostProps{    
    user_id:string;
    transaction_data:{        
        'transactionMonth':{}[],
        'transactionYear':{}[]
    },
    editData:any;
    cleanData:()=>void    
}

const BoostEntry=({user_id,transaction_data, editData,cleanData}:BoostProps)=>{

    const appCtx = useApp();
    

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);    

    useEffect(()=>{
        setFetchFormData(editData)
    },[editData])
    

    const fetchdata = fetchFomrData;    

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));

        const link:any = editData.id == ''?`${url}save-boost`:`${url}update-boost`;

        


        await axios.post(link, 
            {user_id,...values.fetchdata}, {
            
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ) .then(function (response) {
          //console.log(response);

          if(response.data.result > 0){
            toast.success(response.data.message);
            resetForm();            
            cleanData();
            
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

            <p className="text-[16px] uppercase font-medium">{editData.id!='' ?`update entry AMOUNT: $ ${editData.amount}`:`add a payment boost`}</p>

            <hr className="mt-2 border-stroke"/>

            <div className="grid grid-flow-row">
            <Formik
            
        initialValues={{ fetchdata }}
        enableReinitialize        
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched}:any)=>(
            <Form className="mt-5">

            
           
            
            <div className="flex flex-row mt-[15px]">
                <div className="w-[48%]">

                <FormikSelectInput
                    label={DataLabel.month}
                    defaultValue={fetchdata.month}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.month"
                    dataOptions={transaction_data.transactionMonth}
                    errorMessage={errors.fetchdata &&
                        errors.fetchdata.month &&
                        touched.fetchdata &&
                        touched.fetchdata.month &&
                        errors.fetchdata.month.value
                    }
                />
                    
                    
                </div>

                <div className="ml-[24px] w-[48%]">

                <FormikSelectInput
                    label={DataLabel.year}
                    defaultValue={fetchdata.year}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.year"
                    dataOptions={transaction_data.transactionYear}
                    errorMessage={errors.fetchdata &&
                        errors.fetchdata.year &&
                        touched.fetchdata &&
                        touched.fetchdata.year &&
                        errors.fetchdata.year.value
                    }
                />
                    
                    
                </div>
            </div>    


            <div className="flex flex-row mt-[15px]">
                <div className="w-full">

                <FormikFieldInput 
                    type="number"
                    step={"any"}
                    label={DataLabel.amount} 
                    name={`fetchdata.amount`}
                    placeHolder={`${DataLabel.amount}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.amount &&
                        touched.fetchdata &&            
                        touched.fetchdata.amount &&  errors.fetchdata.amount}        
                    />
                    
                    
                </div>

                
            </div>

            <div className="flex flex-row mt-[15px]">

                <div className="w-full">
                    
                    <FormikFieldInput 
                    label={DataLabel.comment} 
                    name={`fetchdata.comment`}
                    placeHolder={`${DataLabel.comment}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.comment &&
                        touched.fetchdata &&            
                        touched.fetchdata.comment &&  errors.fetchdata.comment}   
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

export default BoostEntry;