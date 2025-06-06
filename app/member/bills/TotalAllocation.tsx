import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import { generateUniqueColors, formatLargeNumber, hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

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
          <p className="text-lg"><span className=" font-semibold">{`${payload[0].name}`}</span> : <span className=" font-semibold">${`${Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,maximumFractionDigits: 2}).format(payload[0].value)}`}</span> in <span className=" font-semibold">${`${Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(total_balance)}`}</span></p>
        </div>
      );
    }
    return null;
  };





interface PayLoads{
    bill_type_bill_counts:{id:string,count:number,balance:number,label:string}[],
    total_bill_type:number,
    total_balance:number,
    
    
    
}
interface ProjectionPayload{

    bill_type_ammortization:any[],
    bill_type_names:{[key:string]:string},
    bill_type_bill_counts:{id:string,count:number,balance:number,label:string}[],
    total_bill_type:number,
    total_balance:number,
}

interface TotapProps{
  userid:number;
}

const BillLineLabel: Record<string, string> = {
  total_bill: 'Total Monthly Bill',
};


interface Entry {
  dataKey: string;
  value: number;
  stroke: string;
}
const TotalAllocation = ({userid}:TotapProps) => {

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


    const payload: PayLoads ={
        bill_type_bill_counts:[],
        total_bill_type:0,
        total_balance:0,        
    }

    const projectPayload:ProjectionPayload={
      bill_type_ammortization:[],
      bill_type_names:{},
      bill_type_bill_counts:[],
      total_bill_type:0,
      total_balance:0,   
    }
    


    


    const BillProjection:any = useFetchDropDownObjects({
      urlSuffix:`bill-projectionpg/${userid}`,
      payLoads:projectPayload
  })

    const total_count = BillProjection.total_bill_type

    const total_balance = BillProjection.total_balance;

    const data = BillProjection.bill_type_bill_counts;

    const chartData = BillProjection.bill_type_ammortization;

    const bill_type_names = BillProjection.bill_type_names;

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
    const CustomTooltipLine = ({ payload,label }:any) => {
      if (!payload || payload.length === 0) return null;
      return (
        <div className="bg-white border p-2 rounded shadow-lg text-sm">
          <div><strong>Month:</strong> {label}</div>
         {payload.map((entry: Entry, index: number) => {
          const label =
          bill_type_names?.[entry.dataKey as string] || BillLineLabel?.[entry.dataKey as string];


          if (!entry.dataKey || !label) return null;

          const styles = BillLineLabel?.[entry.dataKey as string]
        ? { color: entry.stroke, border: `1px solid ${entry.stroke}`, padding:'2px' }
        : { color: entry.stroke };

          return (
            <div key={`item-${index}`} style={styles}>
              <strong>{label}:</strong>{' '}
              ${Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(entry.value)}
            </div>
          );
        })}

        </div>
      );
    };

    // Legend formatter function
    const CustomLegendLine = ({ payload }:any) => {
      return (
        <div className="flex gap-4 justify-center items-center text-sm">
          {payload.map((entry:any, index:number) => (
            <span onMouseEnter={(event)=>handleLegendMouseEnter(entry.value,event)} onMouseLeave={handleLegendMouseLeave} className="font-semibold" key={`legend-item-${index}`} style={{ color: entry.color }}>
              {bill_type_names && bill_type_names[entry.value]}
            </span>
          ))}
        </div>
      );
    };

    

    // Get min and max values
    //const minValue = Math.min(...data.map((d:any) => d.count));
    //const maxValue = Math.max(...data.map((d:any) => d.count));
    const maxProgressLength = Math.max(...data.map((d: any) => d.count.toString().length > 4?d.count.toString().length:4 ));
    //console.log(minValue, maxValue, maxProgressLength)

    const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      // const name:string = billTypeNameMap[key];
      

      // const color:string =  getColorForValue(name.length*20+key.length, 300, 1000, 1)
      // console.log(color)
      // return color;
    }
    
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
      // Calculate the height of the tallest element after component renders
      const total_length:number = data.length + chartData.length;
      if(total_length > 0){
        const heights = itemRefs.current.map(item => item?.getBoundingClientRect().height || 0);
        const tallestHeight = Math.max(...heights);
        if (chartData.length > 0 && tallestHeight < 350){
          setMaxHeight(450)
        }else{ 
          setMaxHeight(tallestHeight);
        }
      }
      
    }, [data, chartData]);

    const ids = data.map((item :any)=> item.id);
        
    const uniquecolors = generateUniqueColors(ids);
    const keys_charts = chartData && chartData.length > 0
  ? Object.keys(chartData[0]).map((item: string) => item)
  : [];

    const uniquecolorsline = generateUniqueColors(keys_charts);
    return (
      <div className="flex flex-col lg:flex-row gap-2.5">
        <div className="w-full lg:w-[40%]" ref={el => (itemRefs.current[0] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
          {data.length > 0 &&
        <CardHolder title="Total Allocation" maxHeight={maxHeight}>
            <div className="flex flex-col  md:flex-row">
                {/* {JSON.stringify(data)} */}
                <div className="w-full md:w-[45%] flex items-center justify-center">
                    <PieChart width={250} height={250}>
                        <Pie
                        data={data}
                        cx={isMobile || isTab? `50%`: `40%`}
                        cy={`50%`}
                        innerRadius={0}
                        outerRadius={isMobile || isTab?75:100}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="balance"
                        label={(props) => renderCustomizedLabel({ ...props, total_count, total_balance })}
                        labelLine={false}
                        >
                        {data.map((entry:any, index:number) => (
                            
                            <Cell key={`cell-${index}`} fill={uniquecolors[entry.id]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip total_count={total_count} total_balance={total_balance}/>} />
                        {/*<Legend /> */}
                    </PieChart>
                </div>

                <div className="w-full lg:w-[55%] mt-2.5 md:mt:0">
                    <div className="md:ml-[5%]">
                    {                         
                        data.map((dp:any,i:number)=>{
                            
                            return (
                                <>
                                <DataProgress
                                key={dp.id} 
                                title={dp.name} 
                                progress={dp.balance > 0 ? ((100/total_balance) * dp.balance).toFixed(0):'0'}
                                color={uniquecolors[dp.id]}
                                maxProgressLength={maxProgressLength}
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
        <div className="w-full lg:w-[60%]" ref={el => (itemRefs.current[1] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>

        {chartData.length > 0 && (
  <CardHolder title="12 Months Projection" maxHeight={maxHeight}>
  <div className="w-full overflow-x-auto"> {/* Scrollable container */}
    {/* {bill_type_names[Object.keys(chartData[0])[0]]} */}
      <div className={`w-[${chartData.length * 100}px]`}> {/* Dynamically adjust width */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`} />
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend 
                content={<CustomLegendLine/>}
                                 
              />

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              {Object.keys(chartData[0]).
              filter(key => key !== 'month' /*&& key !== 'bill_names'*/).map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  dot={false}
                  strokeWidth={highlightedKey!=null && highlightedKey === key ?3:1}
                  stroke={uniquecolorsline[key]} // Ensure this function is defined elsewhere
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
      </div>
  </div>
  </CardHolder>
)


}




    
            
        </div>            

    </div>
    );
  };
  
  export default TotalAllocation;