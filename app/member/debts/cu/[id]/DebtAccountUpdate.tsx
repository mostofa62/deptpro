const url = process.env.NEXT_PUBLIC_API_URL;
import { useCallback, useEffect, useRef, useState } from "react";
import { DataSchema,DataLabelUpdate,ValidationSchemaUpdate } from "../DataValidationSchema"
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import { Field, Form, Formik } from "formik";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import axios from "axios";
import toast from "react-hot-toast";
import CheckComponent from "@/app/components/CheckComponent";
import { confirmAlert } from "react-confirm-alert";
import {  AlertBox, DeleteActionGlobal } from "@/app/components/grid/useFetchGridData";
import { useRouter } from "next/navigation";
import useApp from "@/app/hooks/useApp";
interface DebtProps{
    debt_acc_id:string;
    user_id:string;
    tab_number:number;
}

const DebtAccountUpdate = ({debt_acc_id, user_id,tab_number}:DebtProps)=>{

    const router = useRouter();
    const appCtx = useApp();

    const formRef = useRef<any>(null);
    const [fetchFomrData,setFetchFormData] = useState(DataSchema);
    const [payoffOrder, setPayoffOrder] = useState([]);    
    const [reminderDays, setReminderDays] = useState([]);

    const [monthlyInterest, setMonthlyInterest] = useState(0);

    const debtTypeData = useFetchDropDownData({urlSuffix:'debttype-dropdown'});
    

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}debt/${debt_acc_id}`);
        //return response.data.user;
        setFetchFormData(response.data.debtaccounts);
        setPayoffOrder(response.data.payoff_order);        
        setReminderDays(response.data.reminder_days);
        setMonthlyInterest(response.data.debtaccounts.monthly_interest);

    },[debt_acc_id]);
    useEffect(()=>{
        //if(tab_number){
            fetchDataCallback();
        //}
    
    },[fetchDataCallback,tab_number]);

    const fetchdata = fetchFomrData;

    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const handleFormSubmit = async(values:any,{ resetForm,setSubmitting }:any)=>{
        //alert(JSON.stringify(values));

        await axios.post(`${url}update-debt-account/${debt_acc_id}`, 
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
            appCtx.setDebtsAccountsScreen(debtsAccountsScreen < 1? 1:debtsAccountsScreen+1);
            setMonthlyInterest(response.data.monthly_interest)            
            
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


    const deleteAction=async(id:string)=>{


        confirmAlert({
          title: 'Do you want to delete this data?',
          message: 'Are you sure to do this?',
          buttons: [
            {
              label: 'Yes',
              onClick: async()=>{ 
  
                DeleteActionGlobal({        
                  action:'delete-debt',        
                  data:{'id':id}
                }).then((deletedData)=>{
                    //console.log(deletedData)
                    AlertBox(deletedData.message, deletedData.deleted_done);
                    if(deletedData.deleted_done > 0){                                                
                        router.push('/member/debts')
                    }
                    
                })
                
              }
            },
            {
              label: 'No',
              onClick: () => ()=>{                
  
              }
            }
          ],
          closeOnEscape: true,
          closeOnClickOutside: true,
        
        });
               
        
      }


    return(

        <div className="grid grid-flow-row">

        <div className="mt-[10px]">
        <Formik    
        innerRef={formRef}    
    initialValues={{ fetchdata }}
    enableReinitialize
    validationSchema={ValidationSchemaUpdate}
    

    onSubmit={handleFormSubmit}

    render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
        <Form className="mt-1">

<p className="text-[16px] uppercase font-medium">Account Details</p>

<hr className="mt-2 border-stroke"/>

<div className="flex flex-row mt-2">
<div className="w-[48%]">
    
    <FormikFieldInput 
    label={DataLabelUpdate.name} 
    name={`fetchdata.name`}
    placeHolder={`${DataLabelUpdate.name}`}
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

<div className="ml-[24px] w-[48%]">

<FormikSelectInput
        label={DataLabelUpdate.debt_type}
        defaultValue={fetchdata.debt_type}
        placeHolder={`Select ${DataLabelUpdate.debt_type}`}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.debt_type"
        dataOptions={debtTypeData}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.debt_type &&
            touched.fetchdata &&
            touched.fetchdata.debt_type &&
            errors.fetchdata.debt_type.label
        }
    />
    


    
    
</div>
</div>


<div className="flex flex-row">
<div className="w-[34%]">

<FormikFieldInput 
    type="number"
    label={DataLabelUpdate.balance} 
    name={`fetchdata.balance`}
    placeHolder={`${DataLabelUpdate.balance}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.balance &&
        touched.fetchdata &&            
        touched.fetchdata.balance &&  errors.fetchdata.balance}        
    />
    
    
</div>

<div className="w-[34%] ml-[24px]">

<FormikFieldInput 
    type="number"
    label={DataLabelUpdate.highest_balance} 
    name={`fetchdata.highest_balance`}
    placeHolder={`${DataLabelUpdate.highest_balance}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.highest_balance &&
        touched.fetchdata &&            
        touched.fetchdata.highest_balance &&  errors.fetchdata.highest_balance}        
    />
    
    
</div>

<div className="ml-[24px] w-[30%]">

<FormikFieldInput 
    type="date"
    label={DataLabelUpdate.due_date} 
    name={`fetchdata.due_date`}
    placeHolder={`${DataLabelUpdate.due_date}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.due_date &&
        touched.fetchdata &&            
        touched.fetchdata.due_date &&  errors.fetchdata.due_date}        
    />
    
    
</div>



</div>


<div className="flex flex-row">
<div className="w-[34%]">

<FormikFieldInput 
    type="number"
    label={DataLabelUpdate.monthly_payment} 
    name={`fetchdata.monthly_payment`}
    placeHolder={`${DataLabelUpdate.monthly_payment}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.monthly_payment &&
        touched.fetchdata &&            
        touched.fetchdata.monthly_payment &&  errors.fetchdata.monthly_payment}        
    />
    
    
</div>

<div className="ml-[24px] w-[34%]">

<FormikFieldInput 
    type="number"
    label={DataLabelUpdate.interest_rate} 
    name={`fetchdata.interest_rate`}
    placeHolder={`${DataLabelUpdate.interest_rate}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.interest_rate &&
        touched.fetchdata &&            
        touched.fetchdata.interest_rate &&  errors.fetchdata.interest_rate}        
    />
    
    
</div>

<div className="ml-[24px] w-[30%]">

<FormikFieldInput 
    type="number"
    label={DataLabelUpdate.credit_limit} 
    name={`fetchdata.credit_limit`}
    placeHolder={`${DataLabelUpdate.credit_limit}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.credit_limit &&
        touched.fetchdata &&            
        touched.fetchdata.credit_limit &&  errors.fetchdata.credit_limit}        
    />
    
    
</div>



</div>



<div className="flex flex-row border border-gray my-4">
<div className="w-[30%] px-4 py-2">
    <p className="text-[18px] font-semibold">{DataLabelUpdate.monthly_interest}</p>
</div>

<div className="w-[30%] px-4 py-2">
    <p className="text-[18px] font-semibold">{monthlyInterest}</p>
</div>
</div>




<div className="flex flex-row">

<div className="w-full">
    
    <FormikFieldInput 
    label={DataLabelUpdate.notes} 
    name={`fetchdata.notes`}
    placeHolder={`${DataLabelUpdate.notes}`}
    errorMessage ={ errors.fetchdata &&                                        
        errors.fetchdata.notes &&
        touched.fetchdata &&            
        touched.fetchdata.notes &&  errors.fetchdata.notes}   
    />
    
    
    
</div>

</div>


<p className="text-[16px] uppercase font-medium mt-4">Account Settings</p>

<hr className="mt-2 border-stroke"/>


<div className="flex flex-row mt-4">
<div className="w-[48%]">

    

<Field 
component={CheckComponent}
    name="fetchdata.inlclude_payoff"
    label={DataLabelUpdate.inlclude_payoff}    
    checked={values.fetchdata.inlclude_payoff === 1}
    errorClass={errors.fetchdata && 
        errors.fetchdata.inlclude_payoff && 
        touched.fetchdata && 
        touched.fetchdata.inlclude_payoff &&
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
    <div className="ml-[24px] w-[48%]">

    

    <Field 
    component={CheckComponent}
        name="fetchdata.autopay"
        label={DataLabelUpdate.autopay}    
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

<div className="flex flex-row mt-4 gap-1">
<div className="w-[48%]">

<FormikSelectInput
        label={DataLabelUpdate.payoff_order}
        defaultValue={fetchdata.payoff_order}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.payoff_order"
        dataOptions={payoffOrder}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.payoff_order &&
            touched.fetchdata &&
            touched.fetchdata.payoff_order &&
            errors.fetchdata.payoff_order.label
        }
    />

</div>





<div className="ml-[24px] w-[48%]">

<FormikSelectInput
        label={DataLabelUpdate.reminder_days}
        defaultValue={fetchdata.reminder_days}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.reminder_days"
        dataOptions={reminderDays}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.reminder_days &&
            touched.fetchdata &&
            touched.fetchdata.reminder_days &&
            errors.fetchdata.reminder_days.label
        }
    />

</div>

</div>

{/*
<div className="flex flex-row">
{JSON.stringify(values)}
{JSON.stringify(errors)}
</div>
*/}

</Form>
    )}
    />
        </div>



        <div className="mt-[100px]">
                <div className="flex flex-row gap-4">
                    <div className="relative top-0">
                        <button className="flex flex-row text-[15px] h-[40px] bg-[#0166FF] rounded text-white px-2.5 py-2  capitalize text-center font-semibold" onClick={handleSubmit}>
                        <svg className="mt-1" width={15} height={15} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>

                        <span className="ml-1.5">Save Updates</span>
                        </button>
                    </div>
                    <div className="relative left-[30px]">

                    


                        <button className="flex flex-row text-[15px] h-[40px] bg-gray rounded text-black px-2.5 py-2  capitalize text-center font-semibold" onClick={()=>{ deleteAction(debt_acc_id)}}>
                            
                            <svg className="mt-1" width={15} height={15} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round"  d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            <span className="ml-1.5">Delete Accounts</span>
                        </button>
                    
                    </div>
                    
                    

                </div> 
                
            </div>

        </div>
    )
    



}

export default DebtAccountUpdate;