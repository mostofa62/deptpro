import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface TotalProps{

    data:any[];
    
}


// Function to generate a color based on the value
const getColorForValue = (value:number, min:number, max:number) => {
    const ratio = (value - min) / (max - min);
    const r = Math.floor(255 * (1 - ratio)); // Red decreases as value increases
    const g = Math.floor(255 * ratio);       // Green increases as value increases
    const b = 100; // Blue is constant
    return `rgb(${r},${g},${b})`;
};



const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius,percent, value, index }:any) => {
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
      {/* {`${(percent * 100).toFixed(0)}%`} */}
      {`${value}%`}
    </text>
  );
};

const TotalAllocation = ({data}:TotalProps) => {

    // Get min and max values
    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
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
                        dataKey="value"
                        label={renderCustomizedLabel}
                        labelLine={false}
                        >
                        {data.map((entry, index) => (
                            
                            <Cell key={`cell-${index}`} fill={getColorForValue(entry.value, minValue, maxValue)} />
                        ))}
                        </Pie>
                        <Tooltip />
                        {/*<Legend /> */}
                    </PieChart>
                </div>

                <div className="w-[55%]">
                    <div className="p-8">
                    {                         
                        data.map((dp:any,i:number)=>{
                            
                            return (
                                <>
                                <DataProgress 
                                title={dp.name} 
                                progress={dp.value}
                                color={getColorForValue(dp.value, minValue, maxValue)}
                                
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
        <div className="w-[60%]">
            
        </div>            

    </div>
    );
  };
  
  export default TotalAllocation;