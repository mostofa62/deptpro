import { formatLargeNumber, hashString, hslToHex } from "@/app/components/utils/Util";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

interface ProjectionProps{
    chartData:{}[],
    debt_type_names:{[key:string]:string}
}

const datalabel = {
    boost:'Payment Boost'
}

const Projection = ({chartData, debt_type_names}:ProjectionProps)=>{

    const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };

    const getColorForDebtType = (key:string)=>{
        const hue = Math.abs(hashString(key)) % 360;
        return hslToHex(hue, 70, 50);        
    }

    // Tooltip formatter function
    const CustomTooltipLine = ({ payload,label }:any) => {
        if (!payload || payload.length === 0) return null;
        return (
          <div className="bg-white border p-2 rounded shadow-lg text-sm">
            <div><strong>Month:</strong> {label}</div>
            {payload.map((entry:any, index:number) => (
              <div key={`item-${index}`} style={{ color: entry.stroke }}>
                <strong>{datalabel[entry.dataKey as keyof typeof datalabel]?datalabel[entry.dataKey as keyof typeof datalabel]: debt_type_names[entry.dataKey]}:</strong> ${Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(entry.value)}
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
                {datalabel[entry.value as keyof typeof datalabel] ? datalabel[entry.value as keyof typeof datalabel]:debt_type_names[entry.value]}
              </span>
            ))}
          </div>
        );
      };
    
    return(
        <div className="bg-white p-4 rounded shadow">            
                {chartData.length > 0 && (
  
  <div className="w-full overflow-x-auto"> {/* Scrollable container */}
      <div className={`w-[${chartData.length * 100}px]`}> {/* Dynamically adjust width */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`}/>
              {/* <Tooltip content={<CustomTooltipLine />} /> */}
              <Tooltip content={<CustomTooltipLine />} />
              <Legend 
                content={<CustomLegendLine/>}
                                 
              />

              {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
              {Object.keys(chartData[0]).
              filter(key => key !== 'month' /*&& key !== 'debt_names'*/).map((key, index) => (
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

)


}

        </div>
    )



}

export default Projection;