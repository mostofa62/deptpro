import axios from 'axios';
import moment from "moment";
import { number, object, string } from "yup";
const url = process.env.NEXT_PUBLIC_API_URL;
export const DataSchema = {
    payor:'',   
    bill:{'label':'','value':''}, 
    amount:0,
    type:{'value':0, 'label':'None'},        
    due_date:moment().format('YYYY-MM-DD'),
    //comment:''
    note:'',
      

};


export const DataLabel = {
    payor:'Payor',  
    bill:'Bill Account',  
    amount:'Bill Amount',
    type:'Type',
    due_date:'Due Date',
    //comment:'Comment'
    note:'Note',
    current_amount:'Current Balance'
    
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({

                bill:object().shape({
                  value: string().required(),
                  label: string().required(`${DataLabel.bill} is required`)
                }),
                
                             
  
                // amount: number().min(1,`${DataLabel.amount} least 1`)              
                // .required(`${DataLabel.amount} is required`),

                // Updated test method with dynamic error message
                amount: number()
                .min(1, `${DataLabel.amount} must be at least 1`)
                .required(`${DataLabel.amount} is required`)
                .test(
                  'validate-bill-amount',
                  async function (value) {
                    const { bill, type } = this.parent;
                    if (!bill || !bill.value || !value || !type || !type.value ) return true; // Skip validation if fields are not set

                    try {
                      const response = await axios.post(`${url}bill-amount-validation`, {
                        bill_acc_id: bill.value,
                        op_type:type.value,
                        amount: value
                      });
                      return response.data.isValid; // Assuming the API responds with an object like { isValid: true/false }
                    } catch (error: unknown) {
                      if (axios.isAxiosError(error)) {
                        // Set the custom error message if provided in the response
                        ///const serverMessage = error.response?.data?.message;
                        const current_amount_data = error.response?.data?.current_amount;
                        
                        const message = current_amount_data ? 
                        `The ${DataLabel.amount} should less then ${DataLabel.current_amount}, which is ${current_amount_data}`:
                        `The ${DataLabel.amount} should less then ${DataLabel.current_amount}`;
                        return this.createError({
                          message: message
                        });
                      } else {
                        return this.createError({
                          message: `Unexpected error: ${String(error)}`
                        });
                      }
                    }
                  }
                ),

                

                
                type:object().shape({
                  value: number().required(`${DataLabel.type} is required`).min(1, `Please select one of ${DataLabel.type}`),
                  label: string().required(`Please select one of ${DataLabel.type}`)                  
                }),
                

                due_date: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.due_date}`)
                .required(`${DataLabel.due_date} is required`),
                

                
                
  
                
                
               
  })
  });
  
  