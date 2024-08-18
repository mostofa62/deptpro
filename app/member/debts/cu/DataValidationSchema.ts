import { object, string, number } from "yup";
export const DataSchema = {
    name:'',
    debt_type:{'label':'','value':''},
    balance:0,
    highest_balance:0,
    monthly_payment:0,
    credit_limit:0,
    interest_rate:0,    
    due_date:'',
    notes:'',
    //Promotional Interest Rate
    promo_rate:0,
    deffered_interest:0,
    promo_interest_rate:0,
    promo_good_through_month:{'label':'None','value':0},
    promo_good_through_year:{'label':'None','value':0},
    promo_monthly_interest:0,
    
    //Account Settings
    autopay:0,
    inlclude_payoff:0,
    payoff_order:{'label':'0','value':0},
    reminder_days:{'label':'Disabled','value':0},

    //Monthly Minimum Payment Adjustment
    monthly_payment_option:{'label':'Disabled','value':0},
    percentage:0,
    lowest_payment:0
      

};

export const DataLabel = {
  name:'Debt Account Name',
  debt_type:'Type of Dept',
  balance:'Current Balance',
  highest_balance:'Beginning / Highest Balance',   
  monthly_payment:'Minimum Payment',
  credit_limit:'Credit Limit',
  interest_rate:'Interest Rate (%)',  
  due_date:'Next Due Date',
  notes:'Note',

  
  
  
}

export const DataLabelUpdate = {
  name:'Name',
  debt_type:'Account Type',
  balance:'Balance',
  highest_balance:'Highest Balance',   
  monthly_payment:'Monthly Payment',
  credit_limit:'Credit Limit',
  interest_rate:'Interest Rate (%)',  
  due_date:'Next Due Date',
  notes:'Note',

  //not in form
  monthly_interest:'Monthly Interest',

  //Promotional Interest Rate
  promo_rate:'Use Promo Rate?',
  deffered_interest:'Deferred Interest?',
  promo_interest_rate:'Promo Int. Rate',
  promo_good_through_month:'Promo Good Through',  
  promo_monthly_interest:'Promo Monthly Interest',
  

  //Account Settings
  autopay:'Autopay?',
  inlclude_payoff:'Include in Payoff Plan?',
  payoff_order:'Payoff Order',
  reminder_days:'Reminder Days (for sms/txt reminders)',

  //Monthly Minimum Payment Adjustment
  monthly_payment_option:'Monthly Payment Options',
  percentage:'Percentage',
  lowest_payment:'Lowest Payment'

}

export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              name: string()
              .ensure()
              .required(`${DataLabel.name} is required`),

              debt_type:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.debt_type} is required`)
              }),

              balance: number().min(0,`${DataLabel.balance} least 0`)              
              .required(`${DataLabel.balance} is required`),/*
              .test(
                'is-less-than-limits',
                `${DataLabel.current_balance} cannot exceed ${DataLabel.credit_limit} or ${DataLabel.beginning_balance}`,
                function (value) {
                  const { credit_limit, beginning_balance } = this.parent;
                  return value <= credit_limit && value <= beginning_balance;
                }
              ),*/

              highest_balance: number().min(0,`${DataLabel.highest_balance} least 0`)              
              .required(`${DataLabel.highest_balance} is required`),

              monthly_payment: number().min(0,`${DataLabel.monthly_payment} least 0`)              
              .required(`${DataLabel.monthly_payment} is required`),

              credit_limit: number().min(0,`${DataLabel.credit_limit} least 0`)              
              .required(`${DataLabel.credit_limit} is required`),

              interest_rate: number().min(0,`${DataLabel.interest_rate} least 0`)              
              .required(`${DataLabel.interest_rate} is required`),

              due_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.due_date}`)
              .required(`${DataLabel.due_date} is required`),

              
              
             
})
});


export const ValidationSchemaUpdate =  object().shape({
  fetchdata:object().shape({
            
            

              name: string()
              .ensure()
              .required(`${DataLabelUpdate.name} is required`),

              debt_type:object().shape({
                value: string().required(),
                label: string().required(`${DataLabelUpdate.debt_type} is required`)
              }),

              balance: number().min(0,`${DataLabelUpdate.balance} least 0`)              
              .required(`${DataLabelUpdate.balance} is required`),/*
              .test(
                'is-less-than-limits',
                `${DataLabel.current_balance} cannot exceed ${DataLabel.credit_limit} or ${DataLabel.beginning_balance}`,
                function (value) {
                  const { credit_limit, beginning_balance } = this.parent;
                  return value <= credit_limit && value <= beginning_balance;
                }
              ),*/

              highest_balance: number().min(0,`${DataLabelUpdate.highest_balance} least 0`)              
              .required(`${DataLabelUpdate.highest_balance} is required`),

              monthly_payment: number().min(0,`${DataLabelUpdate.monthly_payment} least 0`)              
              .required(`${DataLabelUpdate.monthly_payment} is required`),

              credit_limit: number().min(0,`${DataLabelUpdate.credit_limit} least 0`)              
              .required(`${DataLabelUpdate.credit_limit} is required`),

              interest_rate: number().min(0,`${DataLabelUpdate.interest_rate} least 0`)              
              .required(`${DataLabelUpdate.interest_rate} is required`),

              due_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabelUpdate.due_date}`)
              .required(`${DataLabelUpdate.due_date} is required`),

              
              
             
})
});