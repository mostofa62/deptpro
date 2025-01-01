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
          <p style={{ margin: 0 }}>$ {Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(data.amount)}</p>
        </div>
      );
    }
  
    return null;
  };  

interface DebtTransProps{
    DebtWithTransactionData:any
}
const Summary = ({DebtWithTransactionData}:DebtTransProps)=>{

    
    const formattedAmount = Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,maximumFractionDigits: 2}).format(DebtWithTransactionData?.debtaccounts?.balance);


    return(
        <div className="flex flex-row gap-1">
            

            <div className="w-[25%] text-left px-5 flex flex-col gap-9">

                <div className="w-full">
                    <p className='font-semibold text-[18px] uppercase text-[#4f4f4f]'><span>CURRENT BALANCE</span></p>
                </div>

                <div className="w-full">
                <p className='text-[30px] font-semibold text-[#31c4a2]'><span>$</span><span className='ml-1'>{formattedAmount}</span></p>
                </div>
            
                
            </div>

            <div className="w-[35%] flex flex-col gap-6">
                <div className="w-full">
                    <p className='font-semibold text-[18px] uppercase text-[#4f4f4f]'><span>PROGRESS</span></p>
                </div>
                <div className="w-full">
                    <ProgressBarOne 
                    title={`left to go`} 
                    progress={DebtWithTransactionData?.left_to_go} 
                    progressColor="#31c4a2"
                    />
                </div>
                
            </div>

            <div className="w-[40%]">

            <div className="grid grid-cols-1 h-auto gap-4">

            {DebtWithTransactionData.debttrasactions.length > 0 &&
                <div className="w-full flex gap-2">


                    <div className="w-[30%] px-2">
                      <p className="text-[#4f4f4f] font-medium">12 Month Debt Payment History</p>
                    </div>
                    <div className="w-[70%]">
                    
                                <ResponsiveContainer width="10%" height={120}>
                                        <BarChart                                            
                                            data={DebtWithTransactionData.debttrasactions}
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

                                        </ResponsiveContainer>

                      </div>
                </div>
            }

            </div>
                
                

            </div>


        </div>
    )

}

export default Summary;