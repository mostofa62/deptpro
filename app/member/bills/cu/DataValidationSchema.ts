import moment from "moment";
import { object, string, number } from "yup";

interface OptionType{
  label:string;
  value:string|number;
}

export interface DataSchemaType  {
  name:string;
  bill_type:OptionType;
  payor:string;
  default_amount:number;    
  next_due_date:string;
  note:string;
  // repeat:0,
  repeat_count:OptionType;
  repeat_frequency:OptionType;
  reminder_days:OptionType;    
  updated_at:string;
};
export const DataSchema = {
    name:'',
    bill_type:{'label':'','value':''},
    payor:'',
    default_amount:0,    
    next_due_date:moment().format('YYYY-MM-DD'),
    note:'',
    // repeat:0,
    repeat_count:{'label':'None','value':0},
    repeat_frequency:{'label':'None','value':0},
    reminder_days:{'label':'Disabled','value':0},
    updated_at:''    

};

export const DataLabel = {
  name:'Bill Nickname',
  bill_type:'Bill Category',
  payor:'Payor',
  default_amount:'Bill Amount',    
  next_due_date:'Next Due Date',
  note:'Note',
  // repeat:'Repeat?',
  repeat_count:'Every',
  repeat_frequency:'Repeat',
  reminder_days:'Reminder Notifications SMS-Email*'
}


export const DataLabelView = {
  payor:'Payor',
  name:'Bill Nickname',
  bill_type:{
    first:'Bill Category',
    parent:'bill_type_parent'
  },
  default_amount:'Bill Amount',    
  next_due_date_word:'Next Due Date',
  note:'Note',
  // repeat:'Repeat?',
  //repeat_count:'Every',
  repeat_frequency:'Repeat',
  reminder_days:'Reminder Notifications SMS-Email*',
  created_at:'Opening Date',
  updated_at:'Updated Date'
}

export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              name: string()
              .ensure()
              .required(`${DataLabel.name} is required`),

              bill_type:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.bill_type} is required`)
              }),

              default_amount: number().min(1,`${DataLabel.default_amount} least 1`)              
              .required(`${DataLabel.default_amount} is required`),

              next_due_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.next_due_date}`)
              .required(`${DataLabel.next_due_date} is required`),

              
              
             
})
});

