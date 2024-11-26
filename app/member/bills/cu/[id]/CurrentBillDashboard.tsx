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

interface BillProps{
    bill_acc_id:string;
    user_id:string;
    bill_title:string;
   
}
const url = process.env.NEXT_PUBLIC_API_URL;



interface fetchProps{
    currentBalance:number
    monthTransaction:[];
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
          <p style={{ margin: 0 }}>${data.amount}</p>
        </div>
      );
    }
  
    return null;
  };

const CurrentBillDashboard = ({bill_acc_id, user_id, bill_title}:BillProps)=>{

    const [fetchFomrData,setFetchFormData] = useState<fetchProps>({
        'currentBalance':0,
        'monthTransaction':[]

    });

    
    

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}bill-summary/${bill_acc_id}`);
        //return response.data.user;
        setFetchFormData(response.data);
        

    },[bill_acc_id]);
    useEffect(()=>{
        //if(tab_number){
            fetchDataCallback();
        //}
    
    },[fetchDataCallback]);

    const formattedAmount = new Intl.NumberFormat('en-US').format(fetchFomrData.currentBalance);


    return(
        <CardHolderDefault>

                                <div className="flex flex-col gap-2">
                                    <div className="w-full text-left">
                                        <p className='text-[26px] font-semibold'>{bill_title}</p>
                                    </div>
                                    <div className="w-full text-left">
                                        <p className='text-[22px] font-semibold text-[#768082]'><span>${formattedAmount}</span></p>
                                    </div>                                  

                                    <div className="w-full col-span-2">
                                        <p className='font-semibold text-[15px] uppercase text-[#bdbbbb]'><span>CURRENT BILL</span></p>
                                    </div>

                                    {fetchFomrData.monthTransaction.length > 0 &&

                                    <div className="w-full col-span-2">
                                        
                                        <ResponsiveContainer width="10%" height={80}>
                                        <BarChart                                            
                                            data={fetchFomrData.monthTransaction}
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

                                        </ResponsiveContainer>
                                    </div>
                                    }

                                </div>
        </CardHolderDefault>
    )


}


export default CurrentBillDashboard;