import { object, string, number } from "yup";
export const DataSchema = {
    
    monthly_budget:0,
    minimum_payments:0,
   
    debt_payoff_method:{'label':'None','value':0},
   
      

};

export const DataLabel = {
  
  monthly_budget:'Total Monthly Debt Budget',
  minimum_payments:'Current Total Minimum Payments',
  debt_payoff_method:'Debt Payoff Strategy',
  
  
  
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            


              monthly_budget: number().min(1,`${DataLabel.monthly_budget} least 1`)              
              .required(`${DataLabel.monthly_budget} is required`),


              // minimum_payments: number().min(1,`${DataLabel.minimum_payments} least 1`)              
              // .required(`${DataLabel.minimum_payments} is required`),

              

              debt_payoff_method:object().shape({
                value: number().required().min(1,`${DataLabel.debt_payoff_method} is required`),
                label: string().required(`${DataLabel.debt_payoff_method} is required`)
              }),

              
              
             
})
});


