import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import ProgressBarOne from "@/app/components/ui/ProgressBarOne";

import {
    BarChart,
    Bar,
    XAxis,    
    Tooltip,    
    ResponsiveContainer,
  } from 'recharts';

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
          color:'#ffffff',  
          backgroundColor: '#31c4a2',
          border: '1px solid #4f4f4f',
          borderRadius: '5px',
          padding: '4px',
          fontSize: '16px',
          minWidth:'100px'                    
        }}>          
          <p style={{ margin: 0 }}>${Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,maximumFractionDigits: 2}).format(data.amount)}</p>
        </div>
      );
    }
  
    return null;
  };  

interface DebtTransProps{
    BillWithPaymentData:any
}
const Summary = ({BillWithPaymentData}:DebtTransProps)=>{

    
    const formattedAmount = Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(BillWithPaymentData?.billaccounts?.current_amount);


    return(
        <div className="flex flex-col md:flex-row gap-1">
            

            <div className="w-full md:w-[25%] text-center md:text-left px-5 flex flex-col gap-9">

                    <div className="w-full py-1">
                        <p className='font-semibold text-[25px] uppercase text-[#4f4f4f]'><span>{BillWithPaymentData?.billaccounts?.name}</span></p>
                    </div>

                    
            
                
            </div>

            <div className="w-full md:w-[35%] flex flex-col text-center lmd:text-left md:text-left gap-1 md:gap-6">
                    <div className="w-full">
                        <p className='font-semibold text-[18px] uppercase text-[#4f4f4f]'><span>CURRENT BILL</span></p>
                    </div>

                    <div className="w-full">
                    <p className='text-[30px] font-semibold text-[#31c4a2]'><span>$</span><span className='ml-1'>{formattedAmount}</span></p>
                    </div>
                {/* <div className="w-full">
                    <p className='font-semibold text-[18px] uppercase text-[#4f4f4f]'><span>PROGRESS</span></p>
                </div>
                <div className="w-full">
                    <ProgressBarOne 
                    title={`left to go`} 
                    progress={BillWithPaymentData?.left_to_go} 
                    progressColor="#31c4a2"
                    />
                </div> */}
                
            </div>

            <div className="w-full md:w-[40%]">

            <div className="grid grid-cols-1 h-auto gap-4">

            {BillWithPaymentData.billpayments.length > 0 &&
                <div className="w-full flex flex-col md:flex-row gap-2 mt-3 lmd:mt-0 md:mt-0">

                  <div className="w-full md:w-[30%] flex flex-col items-center justify-center">
                    <p className="text-[#4f4f4f] font-medium">12 Month Bill Payment History</p>
                  </div>
                  <div className="w-full my-3 lmd:my-0 md:my-0 md:w-[70%]  flex justify-center lmd:justify-start md:justify-start">
                      
                      <RechartHorizentalBar
                                          barData={BillWithPaymentData.billpayments}
                                          axisData={ 
                                            {XAxis:{dataKey:'pay_date_word'}}
                                          }
                                          bar={
                                            {dataKey:'amount'}
                                          }
                                         
                      
                                        />
                                {/* <ResponsiveContainer width="10%" height={120}>
                                        <BarChart                                            
                                            data={BillWithPaymentData.billpayments}
                                            margin={{
                                            top: 0,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                            }}
                                            
                                            barCategoryGap={5}
                                            
                                        >

                                        
                                        <XAxis   dataKey="amount" tickLine={false} axisLine={false} tick={false} />
                                        <Bar   dataKey="amount" fill="#31c4a2"  barSize={15} shape={<CustomBar />} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>
                                        
                                        </BarChart>

                                        </ResponsiveContainer> */}
                                        </div>
                </div>
            }

            </div>
                
                

            </div>


        </div>
    )

}

export default Summary;