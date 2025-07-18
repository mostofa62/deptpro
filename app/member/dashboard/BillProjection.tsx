import CardHolder from "@/app/components/ui/CardHolder";
import { formatLargeNumber, generateUniqueColors, hashString, hslToHex } from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";



interface ProjectionPayload{

    bill_type_ammortization:any[],
    bill_type_names:{[key:string]:string},
    bill_type_bill_counts:{id:string,count:number,balance:number,label:string}[],
    total_bill_type:number,
    total_balance:number,
}

interface TotalPros{
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

const BillProjection = ({userid}:TotalPros) => {

    const [highlightedKey, setHighlightedKey] = useState(null);

    const handleLegendMouseEnter = (key:any, event:any) => {
      //alert('o')
      setHighlightedKey(key);
    };

    const handleLegendMouseLeave = () => {
      setHighlightedKey(null);
    };


   

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

    
    const chartData = BillProjection.bill_type_ammortization;

    const bill_type_names = BillProjection.bill_type_names;

    
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
    

    const [maxHeight, setMaxHeight] = useState<number>(450);

    const keys_charts = chartData && chartData.length > 0
      ? Object.keys(chartData[0]).map((item: string) => item)
      : [];
    
    const uniquecolorsline = generateUniqueColors(keys_charts);

    
    return (
   
       
        <>

        {chartData.length > 0 && (
  <CardHolder title="12 Months Bill Projection" maxHeight={maxHeight}>
  <div className="w-full overflow-x-auto"> {/* Scrollable container */}
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




    
            
                 

    </>
    );
  };
  
  export default BillProjection;