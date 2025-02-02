import { useMediaQuery } from "react-responsive";

interface TypeProps{
    all_data:any[],
    debt_type_names:{[key:string]:string},
}


interface DebtRow {
    month:string;
    boost:number;       
    total_snowball: number;    
    total_interest:number;
    total_balance:number;
    total_payment:number;    
    
}
const datalabel = {
    month:'Month',
    boost:'Payment Boost',
    total_snowball:'Total SnowBall',
    total_interest:'Total Interest',
    total_balance:'Total Balance',
    total_payment:'Total Payment'
}

const DataPrefix = {   
    total_snowball:'$',
    total_interest:'$',
    total_balance:'$',
    total_payment:'$',    
}
const TypeWiseTable = ({all_data,debt_type_names}:TypeProps)=>{

    const isMobile = useMediaQuery({ maxWidth: 768 });  
    const isTab = useMediaQuery({ maxWidth: 900 });

    

    const getHeading = (data:any)=>{

        const columns = data
        

        return(
            <>
            
            {columns.map((col:any, index:number)=>(

                <th className="py-1 border-l text-sm border-[#E6E6E6]" key={index}>
                    
                    {datalabel[col as keyof typeof datalabel]?datalabel[col as keyof typeof datalabel]: debt_type_names[col]}
                </th>

            ))}
            </>

        )

    }

    const getData = (data:any)=>{
        
        return(
            <>
            
            {data.map((col:any, index:number)=>{
                const row = typeof col == 'number' ? `$${Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(col)}` :col;
                return(
                <td className="py-1 border-l text-sm border-[#E6E6E6]" key={index}>
                    {row}
                </td>
                )

            })}
            </>

        )

    }


    const getHeadingDiv = (data: any) => {
        const columns = data;
        return (
          <div className="flex flex-col">
            {columns.map((col:any, index:number) => (
              <div className="py-1 text-sm border-b border-[#E6E6E6]" key={index}>
                {datalabel[col as keyof typeof datalabel] || debt_type_names[col] || col}
              </div>
            ))}
          </div>
        );
      };
      
      const getDataDiv = (data: any[], columns: any[]) => {
        return (
          <div className="flex flex-col">
            {data.map((value, index) => {
              const label = columns[index];
              const formattedValue =
                typeof value === "number"
                  ? `$${Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(value)}`
                  : value;
              return (
                <div className="py-1 text-sm border-b border-[#E6E6E6]" key={index}>
                  <strong>{datalabel[label as keyof typeof datalabel] || debt_type_names[label] || label}:</strong>
                  {" "}{formattedValue}
                </div>
              );
            })}
          </div>
        );
      };

    return(

        <div className="bg-white p-2 rounded shadow">
            

            {
                all_data.length > 0 &&
                <div className="flex items-center justify-center p-1">

                        {isMobile || isTab ?

                        <div className="flex flex-col lmd:grid grid-cols-4 gap-1">

{
                            all_data.map((data, index)=>{


                                return (
                                    <div key={index} className="bg-white p-2 rounded-lg shadow-lg">
                                      {/* Render headings only for the first data set */}
                                      {/* {index === 0 && getHeadingDiv(data)} */}
                              
                                      {/* Render data for every subsequent index */}
                                      {index > 0 && getDataDiv(data, all_data[0])} {/* Pass the first entry to getData for column matching */}
                                    </div>
                                  );


                            })
                            
                            }

                        </div>
                            :
                        <table className="table-auto w-full text-center">

                            {
                            all_data.map((data, index)=>{


                                return(
                                    <tr className="border border-[#E6E6E6]" key={index}>
                                        {index == 0 && getHeading(data)}

                                        {index > 0 && getData(data)}


                                    </tr>
                                    

                                )


                            })
                            
                            }

                            
                        </table>
}
                </div>
            }
        </div>
    )



}

export default TypeWiseTable;