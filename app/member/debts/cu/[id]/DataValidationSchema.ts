import { object, array, string, number, StringSchema } from "yup";
export const DataSchema = {
    type:{'label':'None','value':0},
    amount:0,    
    trans_date:'',
    month:'',
    year:'',
    autopay:0  

};


export const DataLabel = {

    type:'Transaction Type',
    amount:'Transaction Amount',    
    trans_date:'Transaction Date',
    month:'Billing Month',
    year:'Billing Year',
    autopay:'Autopay?'     
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({


                type:object().shape({
                  value: number().required(`${DataLabel.type} is required`).min(1, `Please select one of ${DataLabel.type}`),
                  label: string().required(`Please select one of ${DataLabel.type}`)                  
                }),
                             
  
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
  
                trans_date: string()
                .ensure()
                .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.trans_date}`)
                .required(`${DataLabel.trans_date} is required`),

                autopay: number()
                /*
                .oneOf([1], `${DataLabel.autopay} must match 1`)
                .required(`${DataLabel.autopay} is required`),*/
                
  
                
                
               
  })
  });
  
  