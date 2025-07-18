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

    financial_freedom_target:0,

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

  financial_freedom_target:'Financial Freedom Target',
  
  note:'Note',

  progress:'Progress',

  next_contribution_date:'Next Contribution Date',

  total_balance:'Accumulated Balance',

  monthly_saving_boost:'Savings Boost',
  
  monthly_saving:'Accumulated Monthly Savings',
  total_balance_xyz:'Accumulated Savings',
  
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
  
  //total_balance:'Accumulated Balance',

  total_balance_xyz:'Accumulated Balance',
  
  note:'Note',

  financial_freedom_target:'Financial Freedom Target'
  
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

              repeat:object().shape({
                value: number()
                .moreThan(0, `${DataLabel.repeat} is required`), // use label message here
                label: string().required(`${DataLabel.repeat} is required`)
              }),

             

              goal_amount: number()
              .min(0, `${DataLabel.goal_amount} least 0`)
              .required(`${DataLabel.goal_amount} is required`)
              .test(
                'goal-amount-strategy-logic',
                function (value) {
                  const { starting_amount, savings_strategy } = this.parent;
                  const savings_strategy_value = parseInt(savings_strategy?.value ?? '0', 10);

                  if (savings_strategy_value > 1) {
                    return value > starting_amount || this.createError({
                      message: `${DataLabel.goal_amount} should be greater than ${DataLabel.starting_amount}`,
                    });
                  }

                  // else: savings_strategy_value <= 1
                  return value === 0 || this.createError({
                    message: `${DataLabel.goal_amount} must be 0 for this strategy`,
                  });
                }
              ),


              interest: number().min(0,`${DataLabel.interest} least 0`)              
              .required(`${DataLabel.interest} is required`),
              
              financial_freedom_target: number().min(0,`${DataLabel.interest} least 0`),

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
