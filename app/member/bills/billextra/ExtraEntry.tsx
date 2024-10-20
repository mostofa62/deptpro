
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

interface ExtraProps{    
    user_id:string;
    editData:any;
    extraType:any[];
    cleanData:()=>void    
}

const ExtraEntry=({user_id, editData,extraType,cleanData}:ExtraProps)=>{

    const appCtx = useApp();
    

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);    

    useEffect(()=>{
        setFetchFormData(editData)
    },[editData])
    

    const fetchdata = fetchFomrData;    

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        // alert(JSON.stringify(values));

        const link:any = editData.id == ''?`${url}save-bill-extra`:`${url}update-bill-extra`;

        


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

            <p className="text-[16px] uppercase font-medium">{editData.id!='' ?`update entry AMOUNT: $ ${editData.amount}`:`add extra bill payment`}</p>

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

            <div className="w-full">
                    <FormikSelectInput
                        label={DataLabel.type}
                        defaultValue={fetchdata.type}
                        placeHolder={``}
                        isSearchable={true}
                        isClearable={true}
                        name="fetchdata.type"
                        dataOptions={extraType}
                        errorMessage={errors.fetchdata &&
                            errors.fetchdata.type &&
                            touched.fetchdata &&
                            touched.fetchdata.type &&
                            errors.fetchdata.type.value
                        }
                    />
                    </div>


            </div>
                
            
            <div className="flex flex-row mt-[15px]">

               
                <div className="w-full">

                <FormikFieldInput 
        type="date"          
        label={DataLabel.pay_date_extra} 
        name={`fetchdata.pay_date_extra`}
        placeHolder={`${DataLabel.pay_date_extra}`}
        errorMessage ={ errors.fetchdata &&                                        
            errors.fetchdata.pay_date_extra &&
            touched.fetchdata &&            
            touched.fetchdata.pay_date_extra &&  errors.fetchdata.pay_date_extra}
                   
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
                        inputPreix={`$`}        
                    />
                    
                    
                </div>

                
            </div>

            {/* <div className="flex flex-row mt-[15px]">

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

            </div> */}

            
           

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

export default ExtraEntry;