import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    income_source:{'label':'','value':''},
    earner:'',
    
    monthly_gross_income:0,
    monthly_net_income:0,
   
    pay_date:moment().format('YYYY-MM-DD'),
    
    
    repeat:{'label':'None','value':0},


    income_boost:0,

    income_boost_source:{'label':'','value':''},

    pay_date_boost:moment().format('YYYY-MM-DD'),

    repeat_boost:{'label':'None','value':0},

    note:''
      

};

export const DataLabel = {
  
  income_source:'Income Source',
  earner:'Earner',
  
  monthly_gross_income:'Monthly Gross Income',
  monthly_net_income:'Monthly Net Income',   
  
  pay_date:'Pay Day',
 
  repeat:'Repeat Frequency',

  income_boost:'Income Boost',

  income_boost_source:'Income Boost Source',


  pay_date_boost:'Pay Day',
 
  repeat_boost:'Repeat Frequency',

  note:'Note'
  
  
  
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

             

              monthly_gross_income: number().min(0,`${DataLabel.monthly_gross_income} least 0`)              
              .required(`${DataLabel.monthly_gross_income} is required`),

              monthly_net_income: number().min(0,`${DataLabel.monthly_net_income} least 0`)              
              .required(`${DataLabel.monthly_net_income} is required`),
             
             

              pay_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date}`)
              .required(`${DataLabel.pay_date} is required`),

              
              
             
})
});
