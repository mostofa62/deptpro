import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import { getColorForValue, hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useState } from "react";
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
          <p className="text-lg"><span className=" font-semibold">{`${payload[0].name}`}</span> : <span className=" font-semibold">${`${payload[0].value.toFixed(2)}`}</span> in <span className=" font-semibold">${`${total_balance}`}</span></p>
        </div>
      );
    }
    return null;
  };





interface PayLoads{
    bill_type_bill_counts:{_id:string,count:number,label:string}[],
    total_dept_type:number,
    total_balance:number,
    bill_type_ammortization:any[],
    bill_type_names:{[key:string]:string}
    
}


const TotalAllocation = () => {

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
        total_dept_type:0,
        total_balance:0,
        bill_type_ammortization:[],
        bill_type_names:{}
    }
    


    const DebtTypewiseInfo:any = useFetchDropDownObjects({
        urlSuffix:`bill-typewise-info`,
        payLoads:payload
    })

    const total_count = DebtTypewiseInfo.total_dept_type

    const total_balance = DebtTypewiseInfo.total_balance;

    const data = DebtTypewiseInfo.bill_type_bill_counts;

    const chartData = DebtTypewiseInfo.bill_type_ammortization;

    const bill_type_names = DebtTypewiseInfo.bill_type_names;

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
    //console.log(minValue, maxValue, maxProgressLength)

    const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      // const name:string = billTypeNameMap[key];
      

      // const color:string =  getColorForValue(name.length*20+key.length, 300, 1000, 1)
      // console.log(color)
      // return color;
    } 
    return (
    <div className="flex flex-row min-h-75">
        <div className="w-[40%]">
          {data.length > 0 &&
        <CardHolder title="Total Allocation">
            <div className="flex flex-row">
                {/* {JSON.stringify(data)} */}
                <div className="w-[45%]">
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
                    </PieChart>
                </div>

                <div className="w-[55%]">
                    <div className="ml-[5%]">
                    {                         
                        data.map((dp:any,i:number)=>{
                            
                            return (
                                <>
                                <DataProgress
                                key={dp._id} 
                                title={dp.name} 
                                progress={dp.balance > 0 ? ((100/total_balance) * dp.balance).toFixed(0):'0'}
                                color={getColorForDebtType(dp._id)}
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
        <div className="w-[60%] py-2 px-1">

        {/* {chartData.map((damort:any, index:number)=>{
          const keys = Object.keys(damort);
          return <p key={index}>{keys[1]} </p>

        })} */}



    
            
        </div>            

    </div>
    );
  };
  
  export default TotalAllocation;