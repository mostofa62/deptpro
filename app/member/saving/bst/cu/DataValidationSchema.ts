import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    saver:'',
    saving_boost:0,
    autopay:0,
    saving_boost_source:{'label':'','value':''},
    pay_date_boost:moment().format('YYYY-MM-DD'),
    repeat_boost:{'label':'None','value':0},
    note:''
      

};

export const DataLabel = {
  
  saver:'Saver',
  repeat:'Repeat Frequency',
  saving_boost:'Saving Boost',
  autopay:'Autopay?',
  saving_boost_source:'Saving Boost Source',
  pay_date_boost:'Pay Day Boost',
  repeat_boost:'Repeat Frequency',
  note:'Note'
  
}


export const DataLabelView = {
  

  saver:'Saver',
  saving_boost:'Saving Boost',
  autopay:'Autopay?',
  saving_boost_source:'Saving Boost Source',
  pay_date_boost_word:'Pay Day Boost',
  repeat_boost:'Repeat',
  note:'Note'
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              saver: string()
              .ensure()
              .required(`${DataLabel.saver} is required`),

              saving_boost: number().min(0,`${DataLabel.saving_boost} least 0`)              
              .required(`${DataLabel.saving_boost} is required`),

              saving_boost_source:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.saving_boost_source} is required`)
              }),

             

              pay_date_boost: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date_boost}`)
              .required(`${DataLabel.pay_date_boost} is required`),

              
              
             
})
});
