import React from "react";
import { Chart } from "react-google-charts";

// export const data = [
//   ["Task", "Hours per Day"],
//   ["Emergency Savings", 11],
//   ["Income", 2],
//   ["52 Weeks Savings", 2],
//   ["FF Savings", 2],
//   ["Dept", 7],
// ];

export const options = {
  /*title: "My Daily Activities",*/
};

interface DataProps{
  data:any[]
}

export default function Pie({data}:DataProps) {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      //height={"250px"}
    />
  );
}
