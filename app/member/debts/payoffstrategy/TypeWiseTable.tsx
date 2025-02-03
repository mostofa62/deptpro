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

    /*
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
      */
      
      const getDataDiv = (data: any[], columns: any[], ix=0) => {
        return (
          <div className={`flex flex-col ${ix < 1? 'items-center justify-between':''}`}>
            {data.map((value, index) => {
              const label = columns[index];
              const formattedValue =
                typeof value === "number"
                  ? `$${Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(value)}`
                  : value;


                  return ix > 0 ? (
                    <div
                      className="flex justify-between py-1 text-sm border-b border-[#E6E6E6]"
                      key={index}
                    >
                      <span className="font-semibold w-1/2">
                        {datalabel[label as keyof typeof datalabel] || debt_type_names[label] || label}
                      </span>
                      <span className="w-1/2">{formattedValue}</span>
                    </div>
                  ) : label in debt_type_names ? (
                    <div
                      className="flex flex-col gap-2 justify-between items-center text-sm"
                      key={index}
                    >
                      <span className="font-semibold">{debt_type_names[label]}</span>
                      <span>{formattedValue}</span>
                    </div>
                  ) : null;
                  
              
            })}
          </div>
        );
      };

    return(

        <div className="lg:bg-white lg:p-2 md:rounded md:shadow">
            

            {
                all_data.length > 0 &&
                <div className="flex items-center justify-center  md:p-1 lg:p-1">

                        {isMobile || isTab ?

                        <div className="flex flex-col w-full lmd:grid lmd:grid-cols-3 gap-1">

{
                            all_data.map((data, index)=>{


                                return index > 0  ?(
                                  
                                    <div key={index} className={`bg-white p-2 flex flex-col ${index-1 ==0 ? 'items-center justify-center':''} rounded-md shadow-md`}>
                                      
                                      {/* Render headings only for the first data set */}
                                      {/* {index === 0 && getHeadingDiv(data)} */}
                                      {index-1 > 0 &&
                                      <div className="flex items-center justify-center my-3">
                                      <span className="bg-[#f09a25] w-1/4 rounded-lg  text-white px-1 py-1 text-center font-semibold">
                                        {index-1}
                                      </span>
                                      </div>
                                      }
                              
                                      {/* Render data for every subsequent index */}
                                      {getDataDiv(data, all_data[0], index-1)} {/* Pass the first entry to getData for column matching */}
                                    </div>
                                  ) : null;


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