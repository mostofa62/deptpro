import CardHolder from "@/app/components/ui/CardHolder";
import { hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";



interface FuturePayLoad{
  projection_list:{base_gross_income:number, base_net_income:number, month:string, month_word:string}[]
}
interface TotalPros{
  userid:string;
}
const IncomeProjection = ({userid}:TotalPros) => {

    

    const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };


    const payloadFuture:FuturePayLoad={
      projection_list:[]
    }


   
    const IncomeFuture:any = useFetchDropDownObjects({
      urlSuffix:`income-transactions-next`,
      payLoads:payloadFuture
    })

    

    
   
    

    const lineData = IncomeFuture.projection_list;


   const getColorForDebtType = (key:string)=>{
      const hue = Math.abs(hashString(key)) % 360;
      return hslToHex(hue, 70, 50);
      
    }

    const dataLabel = {
      base_net_income:'Net Earnings',
      base_gross_income:'Gross Earnings',      
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


    
    const [maxHeight, setMaxHeight] = useState<number>(450);

    
    return (
    
       

        <>
        {lineData.length > 0 && 
          <CardHolder title="Income 12 Months Projection" maxHeight={maxHeight}>
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
        </>            

   
    );
  };
  
  export default IncomeProjection;