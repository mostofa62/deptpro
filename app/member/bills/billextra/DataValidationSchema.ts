import moment from "moment";
import { number, object, string } from "yup";
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
    
  }
  
  export const ValidationSchema =  object().shape({
    fetchdata:object().shape({

                bill:object().shape({
                  value: string().required(),
                  label: string().required(`${DataLabel.bill} is required`)
                }),
                
                             
  
                amount: number().min(1,`${DataLabel.amount} least 1`)              
                .required(`${DataLabel.amount} is required`),

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
  
  