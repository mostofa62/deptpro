import { mapToInterface } from "@/app/components/utils/Util";
import { useMediaQuery } from "react-responsive";

interface DebtRow {
    name:string;
    total_payment_sum:number;       
    total_interest_sum: number;    
    months_to_payoff:number;    
    month_debt_free_word:string;    
    dept_type_word:string;
    
}
const DataLabel = {
    name:'Account',
    total_payment_sum:'Total Payments',
    total_interest_sum: 'Projected Interest',    
    months_to_payoff:'Months to Payoff',
    month_debt_free_word:'Payoff Date',
    dept_type_word:'Debt Type'    
    
}
const DataPrefix = {
    name:'',
    total_payment_sum:'$',
    total_interest_sum:'$',
    months_to_payoff:'',
    month_debt_free_word:'',
    dept_type_word:'' 
}
interface SortProps{
    debt_accounts_list:DebtRow[]
}



const SortedAccount = ({debt_accounts_list}:SortProps)=>{

    const isMobile = useMediaQuery({ maxWidth: 768 });  
    const isTab = useMediaQuery({ maxWidth: 900 }); 

    const debtTemplate: any = {        
        name: '',
        total_payment_sum: 0,
        total_interest_sum:0,
        months_to_payoff:0,
        month_debt_free_word:'',
        dept_type_word:''
      };

      const filteredDebt = debt_accounts_list.map((item) =>
        mapToInterface<DebtRow>(item, debtTemplate)
      );

    return(
        <div className="bg-white p-2 rounded shadow">

            {debt_accounts_list.length > 0 &&
            
            <div className="flex items-center justify-center">

                {isMobile || isTab ?
                <div className="flex flex-col gap-3 w-full">
                {filteredDebt.map((data, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg shadow-lg">
                    
                    
                      {Object.keys(data).map((key, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="font-semibold">{DataLabel[key as keyof typeof DataLabel]}</span>
                          <span>
                            {DataPrefix[key as keyof DebtRow]}
                            {DataPrefix[key as keyof DebtRow] === "$"
                              ? Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(Number(data[key as keyof DebtRow]))
                              : data[key as keyof DebtRow]}
                          </span>
                        </div>
                      ))}
                    
                  </div>
                ))}
              </div>
                :
                <table className="tanstack-table table-auto w-full">
                <thead>
                    <tr>                    
                        {Object.keys(DataLabel).map((key, index) => (

                            
                                <th className="font-medium" key={index}>{DataLabel[key as keyof typeof DataLabel]}</th>
                            
                        ))}
                    </tr>
                </thead>
                <tbody>
                {
                    filteredDebt.map((data,index)=>{
                        return(
                            <tr key={index}>
                                {
  Object.keys(data).map((key, i) => (
    <td key={i}>
      {DataPrefix[key as keyof DebtRow]}
      {
        DataPrefix[key as keyof DebtRow] === "$"
          ? Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(data[key as keyof DebtRow]))
          : data[key as keyof DebtRow]
      }
    </td>
  ))
}
                                 


                            </tr>
                        )
                    })
                }
                </tbody>
                    
                </table> 
}   


            </div>
            
            }


        </div>
    )

}

export default SortedAccount;