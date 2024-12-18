import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarProps {
  container?: {
    width?: string | number;
    height?: string | number;
  };
  barData: any[];
  axisData: {
    YAxis: {
      dataKey: string;
      customTickFill?: string;
    };
  };
  bar: {
    dataKey: string;
    barFill?: string;
    barSize?: number;
  };
}

export default function HorizontalBarChartWithLabels({
  container = { width: "100%", height: 300 },
  barData = [],
  axisData = { YAxis: { dataKey: "category", customTickFill: "#000" } },
  bar = { dataKey: "value", barFill: "#22bf6a", barSize: 20 },
}: BarProps) {
  // Custom Bar Component to display values to the right of bars
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, value } = props;

    

    const valueString = `$${Intl.NumberFormat('en-US').format(value)}`;

    // Define a minimum bar height
    const minWidth = valueString.length + 15;
    // Adjust the bar position if the height is less than the minimum
    const adjustedWidth = Math.max(width, minWidth);
    const adjustedX = height < minWidth ? x - (minWidth - width) : x;

    

    return (
      <g>
        {/* Bar */}
        <rect
          x={x}
          y={y- height / 2 }
          width={adjustedWidth}
          height={height}
          fill={fill}
          style={{
            outline: "none", // Remove any focus outline
            transition: "none", // Remove hover transition effect
          }}
        />
        {/* Value to the right of the bar */}
        <text
          x={x} // Position to the right of the bar
          y={y - height / 2 + 10} // Center vertically on the bar
          textAnchor="top"
          fontSize={12}
          fill="#FF8C00"         
          fontWeight="700"
          // alignmentBaseline="middle"
        >
          {valueString}
        </text>
      </g>
    );
  };

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
  
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={3} // Move text slightly down to align with the bar bottom
          dy={0} // Fine-tune the vertical offset if necessary
          textAnchor="center" // Center-align the text under the bar
          //transform={`rotate(-90)`} // Rotate the text -90 degrees
          fill={axisData.YAxis.customTickFill || "#8B0000"} // Text color
          fontSize={12} // Font size
          fontWeight={600}              
          
        >
          {payload.value}
        </text>
      </g>
    );
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
          //transform={`rotate(-90)`} // Rotate the text -90 degrees
          fill={axisData.YAxis.customTickFill || "#8B0000"} // Text color
          fontSize={12} // Font size
          fontWeight={600}              
          
        >
          {payload.value}
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

  return (
    <ResponsiveContainer width={container.width} height={container.height}>
      <BarChart
        data={barData}
        layout="vertical" // Set layout to horizontal bars
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 20,
        }}
      >
        {/* X-Axis */}
        <XAxis 
        type="number" 
        axisLine={false}
        tickLine={false}
        tick={<CustomXAxisTick/>}
        />

        {/* Y-Axis */}
        <YAxis
          dataKey={axisData.YAxis.dataKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxisTick/>}
          interval={0}
        />

        {/* Bars */}
        <Bar
          dataKey={bar.dataKey}
          fill={bar.barFill || "#22bf6a"}
          barSize={bar.barSize || 20}
          shape={<CustomBar />}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltipBar />} cursor={{fill: 'transparent'}}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
