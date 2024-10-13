import moment from "moment";
import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {    
    amount:0,        
    pay_date_boost:moment().format('YYYY-MM-DD'),
    comment:''  

};


export const DataLabel = {    
    amount:'Boosting Amount',        
    pay_date_boost:'Pay date',
    comment:'Comment'
    
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({


                
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),
                

                pay_date_boost: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date_boost}`)
                .required(`${DataLabel.pay_date_boost} is required`),
                

                
                
  
                
                
               
  })
  });
  
  