import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    category:{'label':'','value':''},

    savings_strategy:{'label':'None','value':''},

    saver:'',
    nickname:'',
    
    goal_amount:0,
    interest:0,

    interest_type:{'label':'None','value':''},
   
    starting_date:moment().format('YYYY-MM-DD'),

    starting_amount:0,

    contribution:0,

    increase_contribution_by:0,
    
    repeat:{'label':'None','value':0},

    note:''
      

};

export const DataLabel = {
  
  category:'Category',

  savings_strategy:'Savings Strategy',
  saver:'Saver',
  nickname:'Account Nickname',
  
  goal_amount:'Goal Amount',
  interest:'Interest',   

  interest_type:'Interest Type',
  
  starting_date:'Starting Date',

  starting_amount:'Starting Amount',
  
  contribution:'Contribution Amount',

  increase_contribution_by:'Increase Contribution By',
 
  repeat:'Repeat', 
  
  note:'Note',

  progress:'Progress',

  next_contribution_date:'Next Contribution Date',

  total_balance:'Total Balance',

  monthly_saving_boost:'Savings Boost',
  
  monthly_saving:'Total Monthly Savings'
  
}


export const DataLabelView = {
  
  category:'Category',
  savings_strategy:'Savings Strategy',
  saver:'Saver',
  nickname:'Account Nickname',
  
  goal_amount:'Goal Amount',
  interest:'Interest',
  interest_type:'Interest Type',   
  
  starting_date_word:'Starting Date',

  next_contribution_date_word:'Next Contribution Date',

  goal_reached_word:'Goal Completed',

  starting_amount:'Starting Amount',
  
  contribution:'Contribution',

  increase_contribution_by:'Increase Contribution By',
 
  repeat:'Repeat', 
  
  //progress:'Progress',
  
  total_balance:'Total Balance',

  total_balance_xyz:'Total Balance With Boost',
  
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

              savings_strategy:object().shape({
                value: string().required(`${DataLabel.savings_strategy} is required`),
                label: string().required(`${DataLabel.savings_strategy} is required`)
              }),

              interest_type:object().shape({
                value: string().required(`${DataLabel.interest_type} is required`),
                label: string().required(`${DataLabel.interest_type} is required`)
              }),

             

              goal_amount: number().min(0,`${DataLabel.goal_amount} least 0`)              
              .required(`${DataLabel.goal_amount} is required`).test(
                'is-greater-than-starting',
                `${DataLabel.goal_amount} should greater than ${DataLabel.starting_amount}`,
                function (value) {
                  const { starting_amount } = this.parent;
                  return value > starting_amount;
                }
              ),

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
