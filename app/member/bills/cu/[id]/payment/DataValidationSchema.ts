import moment from "moment";
import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {
    amount:0,    
    pay_date:moment().format('YYYY-MM-DD'),
    

};


export const DataLabel = {     
    amount:'Payment Amount',    
    pay_date:'Payment Date',   
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),
  
                pay_date: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date}`)
                .required(`${DataLabel.pay_date} is required`),

                
                /*
                .oneOf([1], `${DataLabel.autopay} must match 1`)
                .required(`${DataLabel.autopay} is required`),*/
                
  
                
                
               
  })
  });
  
  