// pages/chart.js
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

interface BarProsp{
    height:number | number;
    width:string | number;
    data:any[];
    keys:string[];
    indexBy:string;
    colors?:string[];
}

const customColors = ['#FF5733', '#33FF57', '#3357FF', '#F3E000'];
const HorizontalBarChartNivo = ({ height, width,data,keys,indexBy,colors }:BarProsp) => (
  <div style={{ height: height,width:width }}>
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 60, right: 0, bottom: 60, left: 0 }}
      padding={0.3}
      axisTop={null}
      
      axisBottom={{
          tickSize: 2,
          tickPadding: 50,          
          tickRotation: 270,         
          truncateTickAt: 0,
      }}
      axisRight={{
        tickRotation: 45,  // Rotate the left axis labels
      }}
      colors={colors && colors.length > 0 ? colors:customColors }
      borderRadius={2}
      enableLabel={true}
      enableGridY={false}
      labelPosition={`end`}
      labelOffset={15}
      labelTextColor={colors && colors.length > 0 ? colors[0]:customColors[1] }

      // Applying text transformation via labelTextColor, but not returning JSX
      label={(datum) => `$${datum.value}`}

    
    />
  </div>
);

export default HorizontalBarChartNivo;
