
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

interface DebtProps{
    debt_acc_id:string;
    user_id:string;
    transaction_data:{
        'transactionType':{}[],
        'transactionMonth':{}[],
        'transactionYear':{}[]
    }
}

const DebtEntry=({debt_acc_id, user_id,transaction_data}:DebtProps)=>{

    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);    

    

    const fetchdata = fetchFomrData;

    const handleFormSubmit = async(values:any,{ resetForm }:any)=>{
        //alert(JSON.stringify(values));

        const link:any = `${url}save-debt-transaction/${debt_acc_id}`;


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
            appCtx.setDebtsAccountsScreen(debtsAccountsScreen < 1? 1:debtsAccountsScreen+1);
            
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

            <p className="text-[16px] uppercase font-medium">{`add a transaction`}</p>

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

                <FormikSelectInput
                    label={DataLabel.type}
                    defaultValue={fetchdata.type}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.type"
                    dataOptions={transaction_data.transactionType}
                    errorMessage={errors.fetchdata &&
                        errors.fetchdata.type &&
                        touched.fetchdata &&
                        touched.fetchdata.type &&
                        errors.fetchdata.type.value
                    }
                />
                    
                    
                </div>
            </div>    

            <div className="flex flex-row">
                <div className="w-full">

                <FormikFieldInput 
                type="date"
                label={DataLabel.trans_date} 
                name={`fetchdata.trans_date`}
                placeHolder={`${DataLabel.trans_date}`}
                errorMessage ={ errors.fetchdata &&                                        
                    errors.fetchdata.trans_date &&
                    touched.fetchdata &&            
                    touched.fetchdata.trans_date &&  errors.fetchdata.trans_date}        
                />
                    
                    
                </div>
            </div>
            
            <div className="flex flex-row">
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


            <div className="flex flex-row mt-2">
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
                                0
                            );

                        }
                    
                    }}
                    
                    />
                    
                    
                </div>
            </div>

            <hr className="mt-8 border-stroke"/>

            <div className="flex flex-row mt-4">
                <div className="w-[40%]">
                        <button  type="submit" className="text-[15px] h-[40px] bg-[#0166FF] rounded text-white px-4  capitalize text-center font-semibold">
                            Save
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

export default DebtEntry;