import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {
    amount:0,    
    due_date:'',
    autopay:0    

};


export const DataLabel = { 
    autopay:'Autopay?',
    amount:'Bill Amount',    
    due_date:'Bill Due Date',   
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),
  
                due_date: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.due_date}`)
                .required(`${DataLabel.due_date} is required`),

                autopay: number()
                /*
                .oneOf([1], `${DataLabel.autopay} must match 1`)
                .required(`${DataLabel.autopay} is required`),*/
                
  
                
                
               
  })
  });
  
  