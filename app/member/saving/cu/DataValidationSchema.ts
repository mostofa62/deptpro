import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    category:{'label':'','value':''},
    saver:'',
    nickname:'',
    
    goal_amount:0,
    interest:0,
   
    starting_date:moment().format('YYYY-MM-DD'),

    starting_amount:0,

    contribution:0,
    
    
    repeat:{'label':'None','value':0},


    saving_boost:0,


    autopay:0,


    saving_boost_source:{'label':'','value':''},

    pay_date_boost:moment().format('YYYY-MM-DD'),

    repeat_boost:{'label':'None','value':0},

    
    note:''
      

};

export const DataLabel = {
  
  category:'Category',
  saver:'Saver',
  nickname:'Nickname',
  
  goal_amount:'Goal Amount',
  interest:'Interest',   
  
  starting_date:'Starting Date',

  starting_amount:'Starting Amount',
  
  contribution:'Contribution',
 
  repeat:'Repeat Frequency',

  saving_boost:'Saving Boost',

  autopay:'Autopay?',


  saving_boost_source:'Saving Boost Source',

  pay_date_boost:'Pay Day',

  repeat_boost:'Repeat Frequency',
  
  note:'Note'
  
}


export const DataLabelView = {
  
  category:'Category',
  saver:'Saver',
  nickname:'Nickname',
  
  goal_amount:'Goal Amount',
  interest:'Interest',   
  
  starting_date_word:'Starting Date',

  starting_amount:'Starting Amount',
  
  contribution:'Contribution',
 
  repeat:'Repeat Frequency',

  saving_boost:'Saving Boost',

  autopay:'Autopay?',


  saving_boost_source:'Saving Boost Source',

  pay_date_boost_word:'Pay Day',

  repeat_boost:'Repeat Frequency (Boost)',
  
  note:'Note'
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              saver: string()
              .ensure()
              .required(`${DataLabel.saver} is required`),

              category:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.category} is required`)
              }),

             

              goal_amount: number().min(0,`${DataLabel.goal_amount} least 0`)              
              .required(`${DataLabel.goal_amount} is required`),

              interest: number().min(0,`${DataLabel.interest} least 0`)              
              .required(`${DataLabel.interest} is required`),

              starting_amount: number().min(0,`${DataLabel.starting_amount} least 0`)              
              .required(`${DataLabel.starting_amount} is required`),

              contribution: number().min(0,`${DataLabel.contribution} least 0`)              
              .required(`${DataLabel.contribution} is required`),
             
             

              starting_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.starting_date}`)
              .required(`${DataLabel.starting_date} is required`),

              
              
             
})
});
