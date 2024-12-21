
import CheckComponent from "@/app/components/CheckComponent";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import useApp from "@/app/hooks/useApp";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { DataLabel, DataSchema, ValidationSchema } from "./DataValidationSchema";

const url = process.env.NEXT_PUBLIC_API_URL;

interface DebtProps{
    debt_acc_id:string;
    user_id:string;
    transaction_data:{
        'transactionType':{}[],
        'transactionMonth':{}[],
        'transactionYear':{}[]
    },
    currentDate:string
}

const DebtEntry=({debt_acc_id, user_id,transaction_data,currentDate}:DebtProps)=>{

    const appCtx = useApp();
    const router = useRouter()
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);    

    

    const fetchdata = fetchFomrData;
    fetchdata.trans_date = currentDate;

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
            if(response.data.closed_at!=null){
                router.push('/member/debts');
            }else{
                resetForm();
                appCtx.setDebtsAccountsScreen(debtsAccountsScreen < 1? 1:debtsAccountsScreen+1);
            }
            
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

            <div className="flex flex-row mt-[15px]">
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
                        inputPreix={`$`}        
                    />
                    
                    
                </div>
            </div>

            <div className="flex flex-row mt-[15px]">
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
                        <button  type="submit" className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold">
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