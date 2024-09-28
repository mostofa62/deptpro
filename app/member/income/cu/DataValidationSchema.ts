import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    income_source:{'label':'','value':''},
    earner:'',
    
    gross_income:0,
    net_income:0,
   
    pay_date:moment().format('YYYY-MM-DD'),
    
    
    repeat:{'label':'None','value':0},


    note:'',
    total_net_income:0,
    total_gross_income:0
      

};

export const DataLabel = {
  
  income_source:'Income Source',
  earner:'Earner',
  
  gross_income:'Gross Income',
  net_income:'Net Income',   
  
  pay_date:'Pay Day',
 
  repeat:'Repeat Frequency',

  

  note:'Note',

  total_gross_income:'Total Monthly Gross Income',
  total_net_income:'Total Monthly Net Income'
  
  
  
}


export const DataLabelView = {
  
  income_source:'Income Source',
  earner:'Earner',
  
  gross_income:'Gross Income',
  net_income:'Net Income',   
  
  pay_date_word:'Pay Day',
 
  repeat:'Repeat Frequency',

  
  note:'Note',

  total_gross_income:'Total Monthly Gross Income',
  total_net_income:'Total Monthly Net Income'
  
  
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              earner: string()
              .ensure()
              .required(`${DataLabel.earner} is required`),

              income_source:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.income_source} is required`)
              }),

             

              gross_income: number().min(0,`${DataLabel.gross_income} least 0`)              
              .required(`${DataLabel.gross_income} is required`),

              net_income: number().min(0,`${DataLabel.net_income} least 0`)              
              .required(`${DataLabel.net_income} is required`),
             
             

              pay_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date}`)
              .required(`${DataLabel.pay_date} is required`),

              
              
             
})
});
