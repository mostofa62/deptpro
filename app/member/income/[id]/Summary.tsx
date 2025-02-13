
import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import CardHolder from "@/app/components/ui/CardHolder";
import CardHolderOne from "@/app/components/ui/CardHolderOne";
import ProgressBarOne from "@/app/components/ui/ProgressBarOne";
import { formatLargeNumber, hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from "recharts";


interface DebtTransProps{

    income_id:number,
    
}
interface IncomePayload{
    year_month_wise_counts:{total_balance_net:number,total_balance_gross:number, year_month_word:string}[],
    total_monthly_balance:number;
  }

  interface FuturePayLoad{
    projection_list:{base_gross_income:number, base_net_income:number, month:string, month_word:string}[]
  }
const Summary = ({income_id}:DebtTransProps)=>{

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });

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
      urlSuffix:`income-transactions-previouspg/${income_id}`,
      payLoads:payloadIncome
    })

    const IncomeFuture:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-nextpg/${income_id}`,
      payLoads:payloadFuture
    })

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(IncomeContributions.total_monthly_balance);

    const barData = IncomeContributions.year_month_wise_counts;

    const lineData = IncomeFuture.projection_list;

    const dataLabel = {
      base_net_income:'Net Earnings',
      base_gross_income:'Gross Earnings',
      previous_net_history:'12 months net earning history'         
    }

    const EarnerDataLabel={
      earner:'Earner',
      gross_income:'Gross Earnings',
      net_income:'Net Earnings'
    }

    const CustomTooltipLine = ({ payload,label }:any) => {
      if (!payload || payload.length === 0) return null;
      // Find the 'earners' data for the current label
      const currentData = lineData.find((d:any) => d.month_word === label);
      const earners = currentData?.earners || [];
      return (
        <div className="bg-white border p-2 rounded shadow-lg text-sm z-9999 max-h-screen">
          <div><strong>Month:</strong> {label}</div>
          
          {payload.map((entry:any, index:number) => (
            <div key={`item-${index}`} style={{ color: entry.stroke }}>
              <strong>{dataLabel[entry.dataKey as keyof typeof dataLabel]}:</strong> ${Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(entry.value)}
            </div>
          ))}

          {/* Display earners array as a list */}
          {earners.length > 0 && (
            <div className="mt-1">
              <div><strong>Earners</strong></div>
              <div className="overflow-y-scroll max-h-25">
              {earners.map((earner: any, index: number) => (
                <div className="border p-1 my-1" key={`earner-${index}`} style={{ color: getColorForDebtType(earner.earner_id) }}>
                  {/* Iterate over keys in the earner object */}
                  {Object.keys(earner)
                  .filter((key) => key !== "earner_id") // Filter out 'earner_id'
                  .map((key) => (
                    <div key={key}>
                      <strong>{EarnerDataLabel[key as keyof typeof EarnerDataLabel] || key}:</strong>
                      <span className="px-1">{typeof earner[key] === "number" ? (
                        `$${Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,maximumFractionDigits: 2}).format(earner[key])}`
                      ) : (
                        earner[key]
                      )}
                      </span>
                    </div>
                  ))}


                </div>
              ))}
              </div>
            </div>
          )}
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
        if (total_length > 0 && tallestHeight < 350){
          setMaxHeight(380)
        }else{ 
          setMaxHeight(tallestHeight);
        }
      }
      
    }, [barData, lineData]);

    

    return(
        <div className="flex flex-col lg:flex-row gap-2.5">


            <div className={isTab && !isMobile ? `flex flex-row gap-2`:`flex flex-col lg:flex-row lg:w-[60%] lg:gap-2.5`} >

            <div className="w-full" ref={el => (itemRefs.current[0] = el)} style={{ height: isMobile? 'auto': maxHeight ? `${maxHeight}px` : 'auto' }}>
              <CardHolderOne title="current net income" maxHeight={isMobile?80:maxHeight}>
                  

                    <div className="w-full flex items-center justify-center">
                    <p className='md:text-[25px] font-bold text-[#31c4a2] md:mt-[40%]'><span>$</span><span>{formattedAmount}</span></p>
                    </div>
                  
              </CardHolderOne>

            </div>
            <div className="w-full" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
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
                  {/* <p className={`capitalize pt-1 text-[13px] font-semibold text-[${getColorForDebtType(dataLabel.base_net_income)}]`}>
                  {dataLabel.previous_net_history}
                  </p> */}
                </div>
                  
                    

                      
                </div>
                </CardHolderOne>
            }
                
            </div>

            </div>

            <div className="lg:w-[40%]" ref={el => (itemRefs.current[2] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>

            {lineData.length > 0 && 
          <CardHolderOne title="12 Months Projection" maxHeight={maxHeight}>
          
          <div className="w-full overflow-x-auto">
            <div className={`w-[${lineData.length * 100}px]`}> {/* Dynamically adjust width */}
              <ResponsiveContainer width="100%" height={maxHeight >= 350 ? maxHeight - 80:maxHeight}>
              <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month_word" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`} />
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend 
                content={<CustomLegendLine/>}
                                 
              />

             

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              { Object.keys(lineData[0]).
              filter(key => key !== 'month_word' && key !== 'month' && key!='earners').map((key, index) => (
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