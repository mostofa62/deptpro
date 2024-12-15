import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import { generateUniqueColors, getColorForValue, hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];








const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius,percent, value, index, total_count, total_balance }:any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={percent < 0.10 ? 11 : 14}
    >
      {/*`${(percent * 100).toFixed(0)}%`*/}
      {percent >= 0.02 ? `${((100/total_balance) * value).toFixed(0)}%`:''}
    </text>
  );
};


// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, total_count, total_balance }:any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '3px', border: '1px solid #ccc' }}>
          <p className="text-lg"><span className=" font-semibold">{`${payload[0].name}`}</span> : <span className=" font-semibold">{`${payload[0].value.toFixed(2)}`}</span> in <span className=" font-semibold">{`${total_balance}`}</span></p>
        </div>
      );
    }
    return null;
  };





interface PayLoads{
    income_source_type_counts:{_id:string,count:number,label:string, balance:number}[],
    total_income_source_type:number,
    total_balance:number,    
    income_source_type_names:{[key:string]:string}     
}


interface IncomePayload{
  year_month_wise_counts:{total_balance_net:number,total_balance_gross:number, year_month_word:string}[],
}

interface FuturePayLoad{
  projection_list:{base_gross_income:number, base_net_income:number, month:string, month_word:string}[]
}
interface TotalPros{
  userid:string;
}
const TotalAllocation = ({userid}:TotalPros) => {

    

    const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };


    const payload: PayLoads ={
        income_source_type_counts:[],
        total_income_source_type:0,
        total_balance:0,        
        income_source_type_names:{},        
        
    }

    const payloadIncome :IncomePayload = {
      year_month_wise_counts:[]
    }
    

    const payloadFuture:FuturePayLoad={
      projection_list:[]
    }


    const IncomeTypewiseInfo:any = useFetchDropDownObjects({
        urlSuffix:`income-typewise-info`,
        payLoads:payload
    })

    const IncomeTransaction:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-previous`,
      payLoads:payloadIncome
    })

    const IncomeFuture:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-next`,
      payLoads:payloadFuture
    })

    

    const total_balance = IncomeTypewiseInfo.total_balance;

    const data = IncomeTypewiseInfo.income_source_type_counts;

    const barData = IncomeTransaction.year_month_wise_counts;

    const lineData = IncomeFuture.projection_list;


    const maxProgressLength = Math.max(...data.map((d: any) => d.count.toString().length > 4?d.count.toString().length:4 ));
    const maxAmountLength = Math.max(...data.map((d: any) => d.balance.toString().length > 4?d.balance.toString().length:4 ));
    //console.log(minValue, maxValue, maxProgressLength)

    const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      
    }

    const dataLabel = {
      base_net_income:'Net Earnings',
      base_gross_income:'Gross Earnings',      
    }
    
    
    const CustomBar = (props: any) => {
      const { fill, x, y, width, height, value } = props;
      
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          tabIndex={-1} // Prevent focus
          style={{
            outline: 'none', // Remove any focus outline
            transition: 'none', // Remove hover transition effect
          }}
        />
      );
    };

    const CustomTooltipBar = ({ payload, label }: any) => {
      if (payload && payload.length) {
        const data = payload[0].payload;
    
        return (
          <div style={{
            color:'#ffffff',  
            backgroundColor: '#22bf6a',
            border: '1px solid #4f4f4f',
            borderRadius: '5px',
            padding: '4px',
            fontSize: '16px',
            minWidth:'100px'                    
          }}>          
            <p style={{ margin: 0 }}>${Intl.NumberFormat('en-US').format(data.total_balance_net)} in <span>{data.year_month_word}</span></p>
          </div>
        );
      }
    
      return null;
    };
    
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


    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
      // Calculate the height of the tallest element after component renders
      const total_length:number = data.length + barData.length + lineData.length;
      if(total_length > 0){
        const heights = itemRefs.current.map(item => item?.getBoundingClientRect().height || 0);
        const tallestHeight = Math.max(...heights);
        if (lineData.length > 0 && tallestHeight < 350){
          setMaxHeight(450)
        }else{ 
          setMaxHeight(tallestHeight);
        }
      }
      
    }, [data, barData, lineData]); // Empty dependency array ensures it runs once after mount

    const ids = data.map((item :any)=> item._id);
    
    const uniquecolors = generateUniqueColors(ids);

    return (
    <div className="flex flex-row gap-2.5">
        <div className="w-[35%]" ref={el => (itemRefs.current[0] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
        {data.length > 0 &&
        <CardHolder title="Total Allocation" maxHeight={maxHeight}>
           
                    <div className="ml-[5px]">
                    {                         
                        data.map((dp:any,i:number)=>{
                            
                            return (
                                <>
                                <DataProgress
                                key={dp._id} 
                                title={dp.name} 
                                progress={((100/total_balance) * dp.balance).toFixed(0)}
                                color={uniquecolors[dp._id]}
                                maxProgressLength={maxProgressLength}
                                amount={dp.balance}
                                maxAmountLength={maxAmountLength}
                                />
                                </>
                            )

                        })


                    }
                    </div>
                
        </CardHolder>
        }
        </div>
        <div className="w-[25%]" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>

{barData.length > 0 &&
  <CardHolder title={`12 months history`} maxHeight={maxHeight}>
                <div className="flex flex-col justify-center items-center py-2">

                <ResponsiveContainer width={'35%'} height={200}>
                  <BarChart                                            
                      data={barData}
                      margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                      }}
                      
                      barCategoryGap={15}
                      
                  >


                  <XAxis   dataKey="total_balance_net" tickLine={false} axisLine={false} tick={false} />
                  <Bar   dataKey="total_balance_net" fill="#22bf6a"  barSize={20} shape={<CustomBar />} />
                  <Tooltip content={<CustomTooltipBar />} cursor={{fill: 'transparent'}}/>

                  </BarChart>

                </ResponsiveContainer>
                  

                <div>
                  <p className={`text-[13px] font-semibold text-[${getColorForDebtType(dataLabel.base_net_income)}]`}>
                    {dataLabel.base_net_income}
                  </p>
                </div>
                  
                    

                      
                </div>
                </CardHolder>
            }

        </div>

        <div className="w-[40%]" ref={el => (itemRefs.current[2] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
        {lineData.length > 0 && 
          <CardHolder title="12 Months Projection" maxHeight={maxHeight}>
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
        </CardHolder>

        }
        </div>            

    </div>
    );
  };
  
  export default TotalAllocation;