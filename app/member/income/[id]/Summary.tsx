
import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import CardHolder from "@/app/components/ui/CardHolder";
import CardHolderOne from "@/app/components/ui/CardHolderOne";
import ProgressBarOne from "@/app/components/ui/ProgressBarOne";
import { hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from "recharts";


interface DebtTransProps{

    income_id:string,
    
}
interface IncomePayload{
    year_month_wise_counts:{total_balance_net:number,total_balance_gross:number, year_month_word:string}[],
    total_monthly_balance:number;
  }

  interface FuturePayLoad{
    projection_list:{base_gross_income:number, base_net_income:number, month:string, month_word:string}[]
  }
const Summary = ({income_id}:DebtTransProps)=>{

  const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };

    

   

    const payloadIncome :IncomePayload = {
        year_month_wise_counts:[],
        total_monthly_balance:0,
      }
      const payloadFuture:FuturePayLoad={
        projection_list:[]
      }

    const IncomeContributions:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-previous/${income_id}`,
      payLoads:payloadIncome
    })

    const IncomeFuture:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-next/${income_id}`,
      payLoads:payloadFuture
    })

    const formattedAmount = new Intl.NumberFormat('en-US').format(IncomeContributions.total_monthly_balance);

    const barData = IncomeContributions.year_month_wise_counts;

    const lineData = IncomeFuture.projection_list;

    const dataLabel = {
      base_net_income:'Net Earnings',
      base_gross_income:'Gross Earnings',
      previous_net_history:'12 months net earning history'         
    }

    const CustomTooltipLine = ({ payload,label }:any) => {
      if (!payload || payload.length === 0) return null;
      return (
        <div className="bg-white border p-2 rounded shadow-lg text-sm">
          <div><strong>Month:</strong> {label}</div>
          
          {payload.map((entry:any, index:number) => (
            <div key={`item-${index}`} style={{ color: entry.stroke }}>
              <strong>{dataLabel[entry.dataKey as keyof typeof dataLabel]}:</strong> ${entry.value.toFixed(2)}
            </div>
          ))}
        </div>
      );
    };

    // Legend formatter function
    const CustomLegendLine = ({ payload }:any) => {
      return (
        <div className="flex gap-4 justify-center items-center text-sm">
          {payload.map((entry:any, index:number) => (
            <span onMouseEnter={(event)=>handleLegendMouseEnter(entry.value,event)} onMouseLeave={handleLegendMouseLeave} className="font-semibold" key={`legend-item-${index}`} style={{ color: entry.color }}>
              {dataLabel[entry.dataKey as keyof typeof dataLabel]}
            </span>
          ))}
        </div>
      );
    };

    const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      
    }

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
      // Calculate the height of the tallest element after component renders
      const total_length:number = barData.length + lineData.length;
      if(total_length > 0){
        const heights = itemRefs.current.map(item => item?.getBoundingClientRect().height || 0);
        const tallestHeight = Math.max(...heights);
        if (lineData.length > 0 && tallestHeight < 350){
          setMaxHeight(350)
        }else{ 
          setMaxHeight(tallestHeight);
        }
      }
      
    }, [barData, lineData]);

    

    return(
        <div className="flex flex-row gap-1">

            <div className="w-[25%]" ref={el => (itemRefs.current[0] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
              <CardHolderOne title="current net income" maxHeight={maxHeight}>
                  

                    <div className="w-full flex items-center justify-center">
                    <p className='text-[25px] font-bold text-[#31c4a2] mt-[40%]'><span>$</span><span>{formattedAmount}</span></p>
                    </div>
                  
              </CardHolderOne>

            </div>
            <div className="w-[45%]" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
            {barData.length > 0 &&
  <CardHolderOne title={`12 months history`} maxHeight={maxHeight}>
                <div className="flex flex-col justify-center items-center">
                   <RechartHorizentalBar
                                      barData={barData}
                                      axisData={ 
                                        {XAxis:{dataKey:'year_month_word'}}
                                      }
                                      bar={
                                        {dataKey:'total_balance_net'}
                                      }
                                      barBottomCof={5}
                                      barMaxHeight={70}
                                      barTopCof={0}
                                      paddingCof={0}
                                      valueHeightCof={1}
                  
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

                                        
                                        <XAxis   dataKey="total_balance_net" tickLine={false} axisLine={false} tick={false} />
                                        <Bar   dataKey="total_balance_net" fill="#22bf6a"  barSize={20} shape={<CustomBar />} />
                                        <Tooltip content={<CustomTooltipBar />} cursor={{fill: 'transparent'}}/>
                                        
                                        </BarChart>

                                        </ResponsiveContainer> */}
                                        <div>
                  <p className={`capitalize pt-1 text-[13px] font-semibold text-[${getColorForDebtType(dataLabel.base_net_income)}]`}>
                  {dataLabel.previous_net_history}
                  </p>
                </div>
                  
                    

                      
                </div>
                </CardHolderOne>
            }
                
            </div>

            <div className="w-[40%]" ref={el => (itemRefs.current[2] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>

            {lineData.length > 0 && 
          <CardHolderOne title="12 Months Projection" maxHeight={maxHeight}>
          
          <div className="w-full overflow-x-auto">
            <div className={`w-[${lineData.length * 100}px]`}> {/* Dynamically adjust width */}
              <ResponsiveContainer width="100%" height={maxHeight >= 350 ? maxHeight - 80:maxHeight}>
              <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month_word" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${value}`} />
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend 
                content={<CustomLegendLine/>}
                                 
              />

             

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              { Object.keys(lineData[0]).
              filter(key => key !== 'month_word' && key !== 'month').map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  dot={false}
                  strokeWidth={highlightedKey!=null && highlightedKey === key ?3:1}
                  stroke={getColorForDebtType(key)} // Ensure this function is defined elsewhere
                  activeDot={{ r: 5 }}
                />
              ))} 
            </LineChart>
          </ResponsiveContainer>

          </div>
        </div>
        </CardHolderOne>

        }

        
                    
                                
            </div>

        </div>
    )

}

export default Summary;