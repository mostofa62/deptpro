import { object, string, number } from "yup";
export const DataSchema = {
    
    monthly_budget:0,
    // selected_month:{'label':'None','value':0},
    debt_payoff_method:{'label':'None','value':0},
   
      

};

export const DataLabel = {
  
  monthly_budget:'Total Monthly Debt Budget',
  // selected_month:'Selected Month',
  debt_payoff_method:'Payoff Strategy',
  
  
  
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            


              monthly_budget: number().min(1,`${DataLabel.monthly_budget} least 1`)              
              .required(`${DataLabel.monthly_budget} is required`),


              // selected_month:object().shape({
              //   value: number().required().min(1,`${DataLabel.selected_month} is required`),
              //   label: string().required(`${DataLabel.selected_month} is required`)
              // }),

              

              debt_payoff_method:object().shape({
                value: number().required().min(1,`${DataLabel.debt_payoff_method} is required`),
                label: string().required(`${DataLabel.debt_payoff_method} is required`)
              }),

              
              
             
})
});


