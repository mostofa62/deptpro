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







interface PayLoads{
    category_type_counts:{_id:string,count:number,label:string, balance:number}[],
    total_saving_source_type:number,
    total_balance:number,
    bill_type_ammortization:any[],
    category_type_names:{[key:string]:string},
    year_month_wise_counts:{total_balance:number,year_month:string, year_month_word:string}[],
    year_month_wise_balance:number
    
    
}

interface SavingPayload{
  year_month_wise_counts:{total_balance:number,total_contribution:number, year_month_word:string}[],
}

interface FuturePayLoad{
  projection_list:{total_balance:number, contribution:number, month:string, month_word:string}[]
}

interface TotalProps{
  userid:string;
}

const TotalAllocation = ({userid}:TotalProps) => {

    const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };


    const payload: PayLoads ={
        category_type_counts:[],
        total_saving_source_type:0,
        total_balance:0,
        bill_type_ammortization:[],
        category_type_names:{},
        year_month_wise_counts:[],
        year_month_wise_balance:0,
        
    }

    const payloadSaving :SavingPayload = {
      year_month_wise_counts:[]
    }

    const payloadFuture:FuturePayLoad={
      projection_list:[]
    }
    


    const SavingTypewiseInfo:any = useFetchDropDownObjects({
        urlSuffix:`saving-typewise-info/${userid}`,
        payLoads:payload
    })


    const SavingContributions:any = useFetchDropDownObjects({
      urlSuffix:`saving-contributions-previous?userid=${userid}`,
      payLoads:payloadSaving
    })

    const SavingFuture:any = useFetchDropDownObjects({
      urlSuffix:`saving-contributions-next/${userid}`,
      payLoads:payloadFuture
    })

    

    const total_balance = SavingTypewiseInfo.total_balance;

    const data = SavingTypewiseInfo.category_type_counts;


    const barData = SavingContributions.year_month_wise_counts;

    const lineData = SavingFuture.projection_list;


    // Create a mapping from bill_type_id to bill_type_name
    /*
    const billTypeNameMap = chartData.reduce((acc:any, data:any) => {
      data.bill_names.forEach((d:any) => {
        const [id, name] = Object.entries(d)[0];
        acc[id] = name;
      });
      return acc;
    }, {});
    */

    // Tooltip formatter function
    /* const CustomTooltipLine = ({ payload,label }:any) => {
      if (!payload || payload.length === 0) return null;
      return (
        <div className="bg-white border p-2 rounded shadow-lg text-sm">
          <div><strong>Month:</strong> {label}</div>
          {payload.map((entry:any, index:number) => (
            <div key={`item-${index}`} style={{ color: entry.stroke }}>
              <strong>{bill_type_names[entry.dataKey]}:</strong> $ {entry.value.toFixed(2)}
            </div>
          ))}
        </div>
      );
    }; */

    // Legend formatter function
    /* const CustomLegendLine = ({ payload }:any) => {
      return (
        <div className="flex gap-4 justify-center items-center text-sm">
          {payload.map((entry:any, index:number) => (
            <span onMouseEnter={(event)=>handleLegendMouseEnter(entry.value,event)} onMouseLeave={handleLegendMouseLeave} className="font-semibold" key={`legend-item-${index}`} style={{ color: entry.color }}>
              {bill_type_names[entry.value]}
            </span>
          ))}
        </div>
      );
    }; */

    

    // Get min and max values
    //const minValue = Math.min(...data.map((d:any) => d.count));
    //const maxValue = Math.max(...data.map((d:any) => d.count));
    const maxProgressLength = Math.max(...data.map((d: any) => d.count.toString().length > 4?d.count.toString().length:4 ));
    const maxAmountLength = Math.max(...data.map((d: any) => d.balance.toString().length > 4?d.balance.toString().length:4 ));
    //console.log(minValue, maxValue, maxProgressLength)

    const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      // const name:string = billTypeNameMap[key];
      

      // const color:string =  getColorForValue(name.length*20+key.length, 300, 1000, 1)
      // console.log(color)
      // return color;
    }

    const dataLabel = {
      total_balance:'Total Balances',
      contribution:'Contribution'
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
            <p style={{ margin: 0 }}>${Intl.NumberFormat('en-US').format(data.total_balance)} in <span>{data.year_month_word}</span></p>
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
      
    }, [data, barData, lineData]);

    const ids = data.map((item :any)=> item._id);

    const uniquecolors = generateUniqueColors(ids);

    const idsline = lineData.map((item :any)=> item._id);

   // const uniquecolorsLine = generateUniqueColors(idsline);


    return (
    <div className="flex flex-row gap-2.5">
        <div className="w-[35%]" ref={el => (itemRefs.current[0] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
        {data.length > 0 &&
        <CardHolder title="Total Allocation" maxHeight={maxHeight}>
            <div className="flex flex-row">
                {/* {JSON.stringify(data)} */}
                {/* <div className="w-[45%]">
                    <PieChart width={250} height={250}>
                        <Pie
                        data={data}
                        cx={`40%`}
                        cy={`50%`}
                        innerRadius={0}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="balance"
                        label={(props) => renderCustomizedLabel({ ...props, total_count, total_balance })}
                        labelLine={false}
                        >
                        {data.map((entry:any, index:number) => (
                            
                            <Cell key={`cell-${index}`} fill={getColorForDebtType(entry._id)} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip total_count={total_count} total_balance={total_balance}/>} />
                        {/*<Legend /> */}
                    {/* </PieChart>
                </div>  */}

                <div className="w-full">
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
                </div>
            </div>
        </CardHolder>
        }
        </div>
        <div className="w-[25%]" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>

{barData.length > 0 &&
  <CardHolder title={`12 months history`} maxHeight={maxHeight}>
                <div className="w-full flex justify-center items-center py-2">
                    
                                <ResponsiveContainer width="35%" height={200}>
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

                                        </ResponsiveContainer>
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
              <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${value}`}/>
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend 
                content={<CustomLegendLine/>}
                                 
              />

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              {Object.keys(lineData[0]).
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