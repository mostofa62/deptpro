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
import Summary from "./Summary";
import SortedAccount from "./SortedAccounts";
import Projection from "./Projection";
import TypeWiseTable from "./TypeWiseTable";

const url = process.env.NEXT_PUBLIC_API_URL;

interface DebtRow {       
    name:string;
    total_payment_sum:number;       
    total_interest_sum: number;    
    months_to_payoff:number;    
    month_debt_free_word:string;
    dept_type_word:string;
}

interface PayOffData{
    total_paid:number;
    total_interest:number;
    paid_off:string;
    max_months_to_payoff:number;
    debt_accounts_list:DebtRow[],
    debt_type_names:{[key:string]:string},
    debt_type_ammortization:any[],
    all_data:any[]
}
const PayoffStrategy =()=>{

    const authCtx = useAuth();
    //const router = useRouter();
    const formRef = useRef<any>(null);

    const [fetchFomrData,setFetchFormData] = useState(DataSchema);

    const [reload, setReload] = useState(true);

    const pay_off_data:PayOffData = {
        total_paid:0,
        total_interest:0,
        paid_off:'',
        max_months_to_payoff:0,
        debt_accounts_list:[],
        debt_type_ammortization:[],
        debt_type_names:{},
        all_data:[]
    }

    const[payoffData, setPayOffData] = useState(pay_off_data)
    

    const user_id = authCtx.userId;

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}get-payoff-strategy/${user_id}`);
        //return response.data.user;
        
        if(response.data.payoff_strategy!=null){
            setFetchFormData(response.data.payoff_strategy);
        }
    },[user_id]);


    const fetchDataPayoff=useCallback(async()=>{
        //setReload(false);
        //console.log(id);
        const response = await axios.get(`${url}get-payoff-strategy-account/${user_id}`);
        //return response.data.user;

        setPayOffData(response.data)
        setReload(false);
                
    },[user_id]);
    
    
    useEffect(()=>{
        fetchDataCallback();
        
    
    },[fetchDataCallback]);

    useEffect(()=>{
        if(reload){        
            fetchDataPayoff();
        }
    },[reload])



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
            setReload(true);
            
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

    const chartData = payoffData.debt_type_ammortization;
    const debt_type_names = payoffData.debt_type_names;
    const all_data = payoffData.all_data;
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
        // Calculate the height of the tallest element after component renders
        const total_length:number = chartData.length;
        if(total_length > 0){
          const heights = itemRefs.current.map(item => item?.getBoundingClientRect().height || 0);
          const tallestHeight = Math.max(...heights);
          if (chartData.length > 0 && tallestHeight < 350){
            setMaxHeight(350)
          }else{ 
            setMaxHeight(tallestHeight);
          }
        }
        
      }, [chartData]);

    return(
        <DefaultLayout>
            

            <div className="flex flex-col gap-5 mt-8">

            <div className="flex flex-row gap-1 items-center justify-center">


            <div className="w-[25%]" ref={el => (itemRefs.current[0] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
            <Formik
            innerRef={formRef}
            
        initialValues={{ fetchdata }}
        enableReinitialize
        validationSchema={ValidationSchema}
        

        onSubmit={handleFormSubmit}

        render={({isValid, handleChange, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
            <FormikFormHolder>

<div className="flex flex-col gap-5">
  
    <div className="">

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
            inputPreix={`$`}        
        />
        
        
    </div>
    
    
    <div className="">

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

    {/* <div className="w-[30%]">

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
        
        
    </div> */}

    

    <div className="flex items-center justify-center">
            <div className="mt-5">
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


            <div className="w-[75%]" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
                <Projection 
                chartData={chartData} 
                debt_type_names={debt_type_names}
                />
            </div>


            </div>

            


            <div className="bg-[#fafafa] rounded-lg flex flex-col gap-4">

                <div className="mt-8">

                    <TypeWiseTable 
                    all_data={all_data} 
                    debt_type_names={debt_type_names}
                    />

                </div>

                <div className="flex gap-2 mt-6">

                        <div className="w-[35%]">

                            <Summary 
                            total_paid={`$${payoffData.total_paid}`} 
                            total_interest={`$${payoffData.total_interest}`} 
                            paid_off={payoffData.paid_off}
                            max_months_to_payoff={payoffData.max_months_to_payoff}
                            
                            />
                        </div>

                        <div className="w-[65%]">

                            <SortedAccount debt_accounts_list={payoffData.debt_accounts_list} />
                        </div>
                </div>

                
                        


            </div>


            </div>




        </DefaultLayout>
    )


}

export default PayoffStrategy;