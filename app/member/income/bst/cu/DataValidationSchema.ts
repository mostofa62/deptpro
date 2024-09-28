import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    

    income_boost:0,

    income_boost_source:{'label':'','value':''},

    pay_date_boost:moment().format('YYYY-MM-DD'),

    repeat_boost:{'label':'None','value':0},

    note:''
      

};

export const DataLabel = {
  
  

  income_boost:'Income Boost',

  income_boost_source:'Income Boost Source',


  pay_date_boost:'Pay Day',
 
  repeat_boost:'Repeat Frequency',

  note:'Note',
  
  
  
}


export const DataLabelView = {
  
  

  income_boost:'Income Boost',

  income_boost_source:'Income Boost Source',


  pay_date_boost_word:'Pay Day Boost',
 
  repeat_boost:'Repeat Frequency ( Boost)',

  note:'Note',

  
  
  
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
 

              income_boost: number().min(0,`${DataLabel.income_boost} least 0`)              
              .required(`${DataLabel.income_boost} is required`),

              
              income_boost_source:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.income_boost_source} is required`)
              }),
             

              pay_date_boost: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date_boost}`)
              .required(`${DataLabel.pay_date_boost} is required`),

              
              
             
})
});
