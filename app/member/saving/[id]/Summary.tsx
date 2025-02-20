
import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import ProgressBarOne from "@/app/components/ui/ProgressBarOne";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from "recharts";


interface DebtTransProps{

    saving_id:string,
    ProgressData:{title:string,progress:number, color:string, maxProgressLength:number},
}
interface SavingPayload{
    year_month_wise_counts:{total_balance:number,total_contribution:number, year_month_word:string}[],
    total_monthly_balance:number;
  }
const Summary = ({saving_id, ProgressData}:DebtTransProps)=>{

   

    const payloadSaving :SavingPayload = {
        year_month_wise_counts:[],
        total_monthly_balance:0,
      }

      const SavingContributions:any = useFetchDropDownObjects({
        urlSuffix:`saving-contributions-previouspg/${saving_id}`,
        payLoads:payloadSaving
      })

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(SavingContributions.total_monthly_balance);

    const barData = SavingContributions.year_month_wise_counts;

    

    return(
        <div className="flex flex-col md:flex-row gap-1">

            <div className="w-full text-center md:w-[25%] lmd:text-left md:text-left px-5 flex flex-col gap-1">

                <div className="w-full">
                    <p className='font-semibold text-[15px] uppercase text-[#4f4f4f]'><span>CURRENT MONTHLY SAVINGS</span></p>
                </div>

                <div className="w-full">
                <p className='text-[18px] font-semibold text-[#31c4a2]'><span>$</span><span>{formattedAmount}</span></p>
                </div>


            </div>
            <div className="w-full px-5 lmd:px-0 md:px-0 md:w-[25%]">
                
                
                <ProgressBarOne 
                            title={ProgressData.title} 
                            progress={ProgressData.progress}
                            progressColor={ProgressData.color}
                            
                            />
                
            </div>

            <div className="w-full md:w-[50%] flex justify-center">
              <RechartHorizentalBar
                                                    barData={barData}
                                                    axisData={ 
                                                      {XAxis:{dataKey:'year_month_word'}}
                                                    }
                                                    bar={
                                                      {dataKey:'total_balance'}
                                                    }
                                                   
                                
                                                  /> 
                    
                                {/* <ResponsiveContainer width="35%" height={150}>
                                        <BarChart                                            
                                            data={barData}
                                            margin={{
                                            top: 0,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                            }}
                                            
                                            barCategoryGap={10}
                                            
                                        >

                                        
                                        <XAxis   dataKey="total_balance" tickLine={false} axisLine={false} tick={false} />
                                        <Bar   dataKey="total_balance" fill="#22bf6a"  barSize={20} shape={<CustomBar />} />
                                        <Tooltip content={<CustomTooltipBar />} cursor={{fill: 'transparent'}}/>
                                        
                                        </BarChart>

                                        </ResponsiveContainer> */}
                </div>

        </div>
    )

}

export default Summary;