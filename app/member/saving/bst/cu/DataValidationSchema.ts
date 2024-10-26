import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    saving:{'label':'','value':''},
    saver:'',
    saving_boost:0,
    
    saving_boost_source:{'label':'','value':''},
    pay_date_boost:moment().format('YYYY-MM-DD'),
    repeat_boost:{'label':'None','value':0},
    boost_operation_type:{'label':'None','value':0},
    note:''
      

};

export const DataLabel = {
  saving:'Saving Account',
  saver:'Saver',
  repeat:'Repeat Frequency',
  saving_boost:'Saving Boost',
  
  saving_boost_source:'Saving Boost Source',
  pay_date_boost:'Pay Day Boost',
  repeat_boost:'Repeat Frequency',
  boost_operation_type:'Type',
  note:'Note'
  
}


export const DataLabelView = {
  
  saving:'Saving Account',
  saver:'Saver',
  saving_boost:'Saving Boost',
  
  saving_boost_source:'Saving Boost Source',
  pay_date_boost_word:'Pay Day Boost',
  repeat_boost:'Repeat',
  boost_operation_type:'Type',
  note:'Note'
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
              saving:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.saving} is required`)
              }),

              saver: string()
              .ensure()
              .required(`${DataLabel.saver} is required`),

              saving_boost: number().min(0,`${DataLabel.saving_boost} least 0`)              
              .required(`${DataLabel.saving_boost} is required`),

              saving_boost_source:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.saving_boost_source} is required`)
              }),

              boost_operation_type:object().shape({
                value: number().required().min(1,`${DataLabel.boost_operation_type} is required`),
                label: string().required(`${DataLabel.boost_operation_type} is required`)
              }),

             

              pay_date_boost: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date_boost}`)
              .required(`${DataLabel.pay_date_boost} is required`),

              
              
             
})
});
