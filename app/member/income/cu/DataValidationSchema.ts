import moment from "moment";
import { object, string, number } from "yup";
export const DataSchema = {
    
    income_source:{'label':'','value':''},
    earner:'',
    
    gross_income:0,
    net_income:0,
   
    pay_date:moment().format('YYYY-MM-DD'),
    
    
    repeat:{'label':'None','value':0},


    note:'',
    total_net_income:0,
    total_gross_income:0,

    //close:0,
      

};

export const DataLabel = {
  
  income_source:'Income Source',
  earner:'Earner',
  
  gross_income:'Gross Income',
  net_income:'Net Income',   
  
  pay_date:'Pay Day',
 
  repeat:'Repeat Frequency',

  

  note:'Note',

  total_gross_income:'Total Gross Income',
  total_net_income:'Total Net Income',

  monthly_net_income:'Monthly Net Income',
  monthly_gross_income:'Monthly  Gross Income',

  yearly_net_income:'Yearly Net Income',
  yearly_gross_income:'Yearly Gross Income',

  net_income_boost_monthly:'Monthly Income Boost'

  //close:'Close Account?'
  
  
  
}


export const DataLabelView = {
  
  income_source:'Income Source',
  earner:'Earner',
  
  gross_income:'Gross Income',
  net_income:'Net Income',   
  
  
 
  repeat:'Repeat Frequency',

  
  

  total_gross_income:'Total Gross Income',
  total_net_income:'Total Net Income',


  pay_date_word:'Pay Day',
  
  next_pay_date_word:'Next Payment Date',

  note:'Note',
  
}



export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
            

              earner: string()
              .ensure()
              .required(`${DataLabel.earner} is required`),

              income_source:object().shape({
                value: string().required(),
                label: string().required(`${DataLabel.income_source} is required`)
              }),

              repeat:object().shape({
                value: number()
                .moreThan(0, `${DataLabel.repeat} is required`), // use label message here
                label: string().required(`${DataLabel.repeat} is required`)
              }),

             

              gross_income: number().min(0,`${DataLabel.gross_income} least 0`)              
              .required(`${DataLabel.gross_income} is required`)
              .test(
                              'credit-limit-check',
                              `${DataLabel.gross_income} must be greater than or equal to ${DataLabel.net_income}`,
                              function (value) {
                                const { net_income } = this.parent;
                                return value >= net_income;
                              }
                            ),
              

              net_income: number().min(0,`${DataLabel.net_income} least 0`)              
              .required(`${DataLabel.net_income} is required`),
             
             

              pay_date: string()
              .ensure()
              .matches(/^\d{4}-\d{2}-\d{2}$/i,`provide valid ${DataLabel.pay_date}`)
              .required(`${DataLabel.pay_date} is required`),

              close: number()

              
              
             
})
});
