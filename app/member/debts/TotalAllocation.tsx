import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import { getColorForValue } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];








const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius,percent, value, index, total_count }:any) => {
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
    >
      {/*`${(percent * 100).toFixed(0)}%`*/}
      {`${((value/total_count) * 100).toFixed(0)}%`}
    </text>
  );
};


// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, total_count }:any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '3px', border: '1px solid #ccc' }}>
          <p className="text-lg"><span className=" font-semibold">{`${payload[0].name}`}</span> : <span className=" font-semibold">{`${payload[0].value}`}</span> in <span className=" font-semibold">{`${total_count}`}</span></p>
        </div>
      );
    }
    return null;
  };





interface PayLoads{
    debt_type_debt_counts:{_id:string,count:number,label:string}[],
    total_dept_type:number,
    debt_type_ammortization:any[]
    
}


const TotalAllocation = () => {


    const payload: PayLoads ={
        debt_type_debt_counts:[],
        total_dept_type:0,
        debt_type_ammortization:[]
    }
    


    const DebtTypewiseInfo:any = useFetchDropDownObjects({
        urlSuffix:`debt-typewise-info`,
        payLoads:payload
    })

    const total_count = DebtTypewiseInfo.total_dept_type

    const data = DebtTypewiseInfo.debt_type_debt_counts;

    const chartData = DebtTypewiseInfo.debt_type_ammortization;

    // Create a mapping from debt_type_id to debt_type_name
    const debtTypeNameMap = chartData.reduce((acc:any, data:any) => {
      data.debt_names.forEach((d:any) => {
        const [id, name] = Object.entries(d)[0];
        acc[id] = name;
      });
      return acc;
    }, {});

    // Tooltip formatter function
    const CustomTooltipLine = ({ payload,label }:any) => {
      if (!payload || payload.length === 0) return null;
      return (
        <div className="bg-white border p-2 rounded shadow-lg text-sm">
          <div><strong>Month:</strong> {label}</div>
          {payload.map((entry:any, index:number) => (
            <div key={`item-${index}`} style={{ color: entry.stroke }}>
              <strong>{debtTypeNameMap[entry.dataKey]}:</strong> $ {entry.value}
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
            <span key={`legend-item-${index}`} style={{ color: entry.color }}>
              {debtTypeNameMap[entry.value]}
            </span>
          ))}
        </div>
      );
    };

    

    // Get min and max values
    const minValue = Math.min(...data.map((d:any) => d.count));
    const maxValue = Math.max(...data.map((d:any) => d.count));
    const maxProgressLength = Math.max(...data.map((d: any) => d.count.toString().length > 4?d.count.toString().length:4 ));
    //console.log(minValue, maxValue, maxProgressLength)

    const getColorForDebtType = (key:string)=>{
      const name:string = debtTypeNameMap[key];
      

      const color:string =  getColorForValue(name.length*20+key.length, 300, 1000, 1)
      console.log(color)
      return color;
    } 
    return (
    <div className="flex flex-row min-h-75">
        <div className="w-[40%]">
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
                        dataKey="count"
                        label={(props) => renderCustomizedLabel({ ...props, total_count })}
                        labelLine={false}
                        >
                        {data.map((entry:any, index:number) => (
                            
                            <Cell key={`cell-${index}`} fill={getColorForValue(entry.count, minValue, maxValue)} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip total_count={total_count}/>} />
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
                                progress={((dp.count/total_count) * 100).toFixed(0)}
                                color={getColorForValue(dp.count, minValue, maxValue)}
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
        </div>
        <div className="w-[60%] py-2 px-1">

        {/* {chartData.map((damort:any, index:number)=>{
          const keys = Object.keys(damort);
          return <p key={index}>{keys[1]} </p>

        })} */}

{chartData.length > 0 && (
  <div className="w-full overflow-x-auto"> {/* Scrollable container */}
      <div className={`w-[${chartData.length * 100}px]`}> {/* Dynamically adjust width */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} />
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend content={<CustomLegendLine/>} />

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              {Object.keys(chartData[0]).
              filter(key => key !== 'month' && key !== 'debt_names').map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={getColorForDebtType(key)} // Ensure this function is defined elsewhere
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
      </div>
  </div>
)


}

    
            
        </div>            

    </div>
    );
  };
  
  export default TotalAllocation;