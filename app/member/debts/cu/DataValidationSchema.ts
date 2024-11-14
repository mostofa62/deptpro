import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    name:'',
    debt_type:{'label':'','value':''},
    payor:'',
    balance:0,
    highest_balance:0,
    minimum_payment:0,
    monthly_payment:0,
    credit_limit:0,
    interest_rate:0, 
    start_date:moment().format('YYYY-MM-DD'),   
    due_date:moment().format('YYYY-MM-DD'),
    note:'',
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
  name:'Debt Name',
  debt_type:'Dept Categories',
  payor:'Payor',
  balance:'Current Balance',
  highest_balance:'Beginning / Highest Balance',
  minimum_payment:'Minimum Payment',   
  monthly_payment:'Minimum Monthly Payment',
  credit_limit:'Credit Limit',
  interest_rate:'Interest Rate',
  start_date:'Start Date',  
  due_date:'Next Due Date',
  note:'Note',

  
  
  
}

export const DataLabelUpdate = {
  name:'Debt Name',
  debt_type:'Account Type',
  balance:'Balance',
  highest_balance:'Highest Balance',
  minimum_payment:'Minimum Payment',   
  monthly_payment:'Minimum Monthly Payment',
  credit_limit:'Credit Limit',
  interest_rate:'Interest Rate (%)',
  start_date:'Start Date',    
  due_date:'Next Due Date',  
  note:'Note',

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


export const DataLabelView= {
  name:'Name',
  debt_type:'Account Type',
  balance:'Balance',
  highest_balance:'Highest Balance',   
  monthly_payment:'Minimum Monthly Payment',
  credit_limit:'Credit Limit',
  interest_rate:'Interest Rate',  
  start_date_word:'Start Date',
  due_date_word:'Next Due Date',
  note:'Note',

  //not in form
  monthly_interest:'Monthly Interest',

  //Promotional Interest Rate
  //promo_rate:'Use Promo Rate?',
  //deffered_interest:'Deferred Interest?',
  //promo_interest_rate:'Promo Int. Rate',
  //promo_good_through_month:'Promo Good Through',  
  //promo_monthly_interest:'Promo Monthly Interest',
  

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

              minimum_payment: number().min(0,`${DataLabel.minimum_payment} least 0`)              
              .required(`${DataLabel.minimum_payment} is required`),

              monthly_payment: number().min(0,`${DataLabel.monthly_payment} least 0`)              
              .required(`${DataLabel.monthly_payment} is required`),

              // credit_limit: number().min(0,`${DataLabel.credit_limit} least 0`)              
              // .required(`${DataLabel.credit_limit} is required`),

              credit_limit: 
              number()
              .min(0, `${DataLabel.credit_limit} must be at least 0`)
              .required(`${DataLabel.credit_limit} is required`)
              .test(
                'credit-limit-check',
                `${DataLabel.credit_limit} must be greater than or equal to ${DataLabel.highest_balance}`,
                function (value) {
                  const { highest_balance } = this.parent;
                  return value >= highest_balance;
                }
              ),

              interest_rate: number().min(0,`${DataLabel.interest_rate} least 0`)              
              .required(`${DataLabel.interest_rate} is required`),


              start_date: string()
              .matches(/^\d{4}-\d{2}-\d{2}$/i, `provide valid ${DataLabel.start_date}`)
              .required(`${DataLabel.start_date} is required`)
              .test('is-less', `${DataLabel.start_date} must be earlier than ${DataLabel.due_date}`, function(value) {
                const { due_date } = this.parent; // Get due_date value
                // Use moment to compare dates
                return moment(value, 'YYYY-MM-DD', true).isSameOrBefore(moment(due_date, 'YYYY-MM-DD', true));
              }),

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


              start_date: string()
              .matches(/^\d{4}-\d{2}-\d{2}$/i, `provide valid ${DataLabelUpdate.start_date}`)
              .required(`${DataLabelUpdate.start_date} is required`)
              .test('is-less', `${DataLabelUpdate.start_date} must be earlier than ${DataLabelUpdate.due_date}`, function(value) {
                const { due_date } = this.parent; // Get due_date value
                // Use moment to compare dates
                return moment(value, 'YYYY-MM-DD', true).isBefore(moment(due_date, 'YYYY-MM-DD', true));
              }),

              due_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabelUpdate.due_date}`)
              .required(`${DataLabelUpdate.due_date} is required`),

              
              
             
})
});