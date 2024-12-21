import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import {formatLargeNumber} from '@/app/components/utils/Util';
import { useEffect, useState } from "react";




  


  


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
    },
    
    barMinHeight?:number;
    barMaxHeight?:number;
  }

  export default function RechartHorizentalBar({    
    barData = [],
    axisData = { XAxis: { dataKey: "xKey", customTickFill: "#000" } },
    bar = { dataKey: "value", barFill: "#22bf6a", barSize: 20 },
    barMinHeight = 10,
    barMaxHeight = 80
  }: BarProps) {

    const [topBarHeight, setTopBarHeight] = useState(1); // For bar + label.
    const [bottomAxisHeight, setBottomAxisHeight] = useState(1); // For X-axis labels.
    const [dynamicHeight, setDynamicHeight] = useState(150); // Default minimum height
  

    const calculateWidth = () => {
        const barCount = barData.length;
        const width =  barCount < 5 ? 35 : barCount < 10 ? 60 : 100;
        return `${width}%`
    };

    const dynamicWidth = calculateWidth();


    const CustomBar = (props: any) => {
      const { fill, x, y, width, height, value } = props;
  
      const valueString = `$${formatLargeNumber(value)}`;
      const labelPadding = 10; // Space between the bar and the label
      const maxBarHeight = barMaxHeight; // Maximum bar height
  
      // Adjust the bar's height, capping it at maxBarHeight
      const minHeight = barMinHeight;
      const calculatedHeight = Math.max(height, minHeight); // Ensure height is at least minHeight
      const adjustedHeight = Math.min(calculatedHeight, maxBarHeight); // Cap at maxBarHeight
      const adjustedY = y + (height - adjustedHeight); // Adjust Y to keep the bar aligned at the bottom
  
      // Calculate the position for the rotated text
      const adjustedTextX = x + width / 2; // Align horizontally with the bar's center
      const adjustedTextY = adjustedY - labelPadding; // Position above the bar with padding
      const labelWidth = valueString.length * 8; // Approximation of label width.

      useEffect(() => {
        // Update the topBarHeight to consider bar + label height.
        setTopBarHeight((prevHeight) => Math.max(prevHeight, adjustedHeight + labelWidth + labelPadding));
      }, [adjustedHeight, labelWidth]);
    

  
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
              {/* Add the rotated label above the bar */}
              <text
                  x={adjustedTextX}
                  y={adjustedTextY + 2}
                  textAnchor="top" // Center-align the text horizontally
                  fill="#FF8C00" // Text color
                  fontSize={12} // Font size
                  fontWeight="700" // Text styling
                  transform={`rotate(-90, ${adjustedTextX}, ${adjustedTextY})`} // Rotate around the label's position
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
        const labelWidth = payload.value.length * 8; // Approximation of X-axis label width.

        useEffect(() => {
          // Update the bottomAxisHeight to consider the label height.
          setBottomAxisHeight((prevHeight) => Math.max(prevHeight, labelWidth + 10)); // Add some padding.
        }, [labelWidth]);
      
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


      useEffect(() => {
        setDynamicHeight(topBarHeight + bottomAxisHeight); // Sum the two heights.
      }, [topBarHeight, bottomAxisHeight]);
      
      



    return(

        <ResponsiveContainer width={dynamicWidth} height={dynamicHeight}>
                          <BarChart                                            
                              data={barData}
                              margin={{
                              top: topBarHeight / 8 ,
                              right: 0,
                              left: 0,
                              bottom: bottomAxisHeight /2,
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
