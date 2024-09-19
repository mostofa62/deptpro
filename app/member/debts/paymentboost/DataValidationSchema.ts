import moment from "moment";
import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {    
    amount:0,        
    month:'',
    year:'',
    comment:''  

};


export const DataLabel = {    
    amount:'Boosting Amount',        
    month:'Billing Month',
    year:'Billing Year',
    comment:'Comment'
    
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({


                
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),
                

                month:object().shape({
                  value: number().required(`${DataLabel.month} is required`).min(1, `Please select one of ${DataLabel.month}`),
                  label: string().required(`Please select one of ${DataLabel.month}`)                  
                }),
                

                year:object().shape({
                  value: number().required(`${DataLabel.year} is required`).min(1, `Please select one of ${DataLabel.year}`),
                  label: string().required(`Please select one of ${DataLabel.year}`)                  
                }),
  
                

                
                
  
                
                
               
  })
  });
  
  