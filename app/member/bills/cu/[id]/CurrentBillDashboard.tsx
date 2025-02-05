import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';


const url = process.env.NEXT_PUBLIC_API_URL;


/*
interface fetchProps{    
    currentBalance:number
    monthTransaction:any[];
}
    */
interface BillProps{
  //bill_summary:fetchProps
  bill_title:string;
  currentBalance:number
 
}

const CustomBar = (props: any) => {
    const { fill, x, y, width, height, value } = props;
    
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        tabIndex={-1} // Prevent focus
        style={{
          outline: 'none', // Remove any focus outline
          transition: 'none', // Remove hover transition effect
        }}
      />
    );
  };

const CustomTooltip = ({ payload, label }: any) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
  
      return (
        <div style={{
            
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '1px',
          padding: '2px',
          fontSize: '14px',          
        }}>          
          <p style={{ margin: 0 }}>${Intl.NumberFormat('en-US').format(data.amount)}</p>
        </div>
      );
    }
  
    return null;
  };

const CurrentBillDashboard = ({bill_title, currentBalance=0}:BillProps)=>{

    
    const formattedAmount = new Intl.NumberFormat('en-US').format(currentBalance);


    return(
        <CardHolderDefault>

                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-full text-center lmd:text-left md:text-left">
                                        <p className='text-[18px] md:text-[26px] font-semibold'>{bill_title}</p>
                                    </div>
                                    <div className="w-full text-center lmd:text-left md:text-left">
                                        <p className='text-[16px] md:text-[22px] font-semibold text-[#768082]'><span>${formattedAmount}</span></p>
                                    </div>                                  

                                    <div className="w-full col-span-2">
                                        <p className='font-semibold text-[13px] md:text-[15px] md:text-left lmd:text-left text-center uppercase text-[#bdbbbb]'><span>CURRENT BILL</span></p>
                                    </div>

                                    {/*bill_summary?.monthTransaction && bill_summary.monthTransaction.length > 0 &&

                                    <div className="w-full flex justify-center lmd:justify-start md:justify-start col-span-2">
                                        
                                        {/* <ResponsiveContainer width="10%" height={80}>
                                        <BarChart                                            
                                            data={bill_summary.monthTransaction}
                                            margin={{
                                            top: 0,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                            }}
                                            
                                            barCategoryGap={5}
                                            
                                        >

                                        
                                        <XAxis   dataKey="amount" tickLine={false} axisLine={false} tick={false} />
                                        <Bar   dataKey="amount" fill="#8884d8"  barSize={15} shape={<CustomBar />} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                                        
                                        </BarChart>

                                        </ResponsiveContainer> *//*}
                                        
                                        <RechartHorizentalBar
                                                              barData={bill_summary.monthTransaction}
                                                              
                                                              bar={
                                                                {dataKey:'amount'}
                                                              }
                                                            
                                        
                                                            />
                                    </div>
                                    */}

                                </div>
        </CardHolderDefault>
    )


}


export default CurrentBillDashboard;