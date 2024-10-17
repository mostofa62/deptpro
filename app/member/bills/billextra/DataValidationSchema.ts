import moment from "moment";
import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {    
    amount:0,
    type:{'value':0, 'label':'None'},        
    pay_date_extra:moment().format('YYYY-MM-DD'),
    //comment:''  

};


export const DataLabel = {    
    amount:'Amount',
    type:'Type',
    pay_date_extra:'Date',
    //comment:'Comment'
    
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({


                
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),

                type:object().shape({
                  value: number().required(`${DataLabel.type} is required`).min(1, `Please select one of ${DataLabel.type}`),
                  label: string().required(`Please select one of ${DataLabel.type}`)                  
                }),
                

                pay_date_extra: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date_extra}`)
                .required(`${DataLabel.pay_date_extra} is required`),
                

                
                
  
                
                
               
  })
  });
  
  