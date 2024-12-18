import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";






  


  


  interface BarProps{    
    barData:any[];
    axisData:{
        XAxis:{
            dataKey:string,
            customTickFill?:string;        
        },
    },
    bar:{
        dataKey:string;
        barFill?:string;
        barSize?:number;
    }

  }

  export default function RechartHorizentalBar({    
    barData = [],
    axisData = { XAxis: { dataKey: "xKey", customTickFill: "#000" } },
    bar = { dataKey: "value", barFill: "#22bf6a", barSize: 20 },
  }: BarProps) {


    const maxBarValueLength = Math.max(
        ...barData.map((data) =>
          `$${Intl.NumberFormat('en-US').format(data[bar.dataKey])}`.length
        )
      );

      const minBarValueLength = Math.min(
        ...barData.map((data) =>
          `$${Intl.NumberFormat('en-US').format(data[bar.dataKey])}`.length
        )
      );

      //console.log(maxBarValueLength)

      // Calculate dynamic height
    const calculateHeight = () => {
        const barCount = barData.length;
        const barHeight = bar.barSize || 20;
        //const gapBetweenBars = 15; // Default gap between bars
        const valueHeight = maxBarValueLength * 10; // Approximate height per character (adjust multiplier as needed)
        const padding = maxBarValueLength * 10; // Padding for axis labels, tooltips, etc.

        // Overall height based on number of bars, their heights, and value label space
        return barCount * (barHeight) + valueHeight + padding;
    };

    

    const dynamicHeight = calculateHeight();

    const calculateWidth = () => {
        const barCount = barData.length;
        const width =  barCount < 5 ? 35 : barCount < 10 ? 60 : 100;
        return `${width}%`
    };

    const dynamicWidth = calculateWidth();


    const CustomBar = (props: any) => {
        const { fill, x, y, width, height, value } = props;

        const valueString = `$${Intl.NumberFormat('en-US').format(value)}`;
        // Define a minimum bar height
        const minHeight = valueString.length + 15;

        // Adjust the bar position if the height is less than the minimum
        const adjustedHeight = Math.max(height, minHeight);
        const adjustedY = height < minHeight ? y - (minHeight - height) : y;
      
        return (
          <g>
            {/* Draw the bar */}
            <rect
              x={x}
              y={adjustedY}
              width={width}
              height={adjustedHeight}
              fill={fill}
              tabIndex={-1} // Prevent focus
              style={{
                outline: "none", // Remove any focus outline
                transition: "none", // Remove hover transition effect
              }}
            />
            {/* Add the value as a rotated label */}
            <text
              x={x + width + (minBarValueLength * 5)} // Center horizontally on the bar
              y={y - 2} // Position slightly above the bar
              textAnchor="top" // Center-align the text
              fill="#FF8C00" // Text color
              fontSize={12} // Font size
              fontWeight="700" // Text styling
              transform={`rotate(-90, ${x + width / 2}, ${y - 5})`} // Rotate -90 degrees around the text's position
            >
              {valueString}
            </text>
          </g>
        );
      };


    const CustomTooltipBar = ({ payload, label }: any) => {
        if (payload && payload.length) {
          const data = payload[0].payload;
      
          return (
            <div style={{
              color:'#ffffff',  
              backgroundColor: '#800080',
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




    const CustomXAxisTick = (props: any) => {
        const { x, y, payload } = props;
      
        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0}
              y={3} // Move text slightly down to align with the bar bottom
              dy={0} // Fine-tune the vertical offset if necessary
              textAnchor="end" // Center-align the text under the bar
              transform={`rotate(-90)`} // Rotate the text -90 degrees
              fill={axisData.XAxis.customTickFill || "#8B0000"} // Text color
              fontSize={12} // Font size
              fontWeight={600}              
              
            >
              {payload.value}
            </text>
          </g>
        );
      };

      



    return(

        <ResponsiveContainer width={dynamicWidth} height={dynamicHeight}>
                          <BarChart                                            
                              data={barData}
                              margin={{
                              top: maxBarValueLength * 10,
                              right: 0,
                              left: 0,
                              bottom: maxBarValueLength * 10,
                              }}
                              
                            barCategoryGap={10}
                              
                          >
                         
        
                          <XAxis   
                          dataKey={axisData.XAxis.dataKey}
                          tickLine={false} 
                          axisLine={false}  
                          tick={<CustomXAxisTick />} 
                          interval={0}
                          
                          />
                          <Bar 
                          dataKey={bar.dataKey} 
                          fill={bar.barFill || "#483D8B"}  
                          barSize={bar.barSize || 13} 
                          shape={<CustomBar />} 
                          
                          />
                          <Tooltip content={<CustomTooltipBar />} cursor={{fill: 'transparent'}}/>
        
                          </BarChart>
        
                        </ResponsiveContainer>

    )

  }
