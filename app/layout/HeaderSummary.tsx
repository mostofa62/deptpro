import CardHolderTiny from "@/app/components/ui/CardHolderTiny";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const url = process.env.NEXT_PUBLIC_API_URL;
const HeaderSummary = ()=>{

    const authCtx = useAuth();
    const user_id = authCtx.userId;

    const [transactioData, setTransactionData] = useState({
        'saving_progress':25,
        'total_paid_off':0,
        'snowball_amount':0,
        'monthly_budget':0,
        'total_monthly_minimum':0,
        'total_monthly_bill_expese':0,
        'total_monthly_net_income':0,
        'debt_total_balance':0,
        'active_debt_account':0,
      })

      const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
          const response = await axios.get(`${url}debt-header-data/${user_id}`);
          //return response.data.user;
          setTransactionData({...transactioData,...response.data});
                
    
      },[user_id]);
      useEffect(()=>{
          
          fetchDataCallback();
          
    
      },[fetchDataCallback]);

      const transactioDataLabel = {
        saving_progress:{label:'Saving Progress',prefix:'',suffix:'%',href:''},
        total_paid_off:{label:'debt payoff progress',prefix:'',suffix:'%',href:''},
        snowball_amount:{label:'monthly + cashflow',prefix:'$',suffix:'',href:''},
        monthly_budget:{label:'monthly debt budget',prefix:'$',suffix:'',href:''},
        total_monthly_minimum:{label:'minimum payments',prefix:'$',suffix:'',href:''},
        total_monthly_bill_expese:{label:'monthly bill totals',prefix:'$',suffix:'',href:''},
        total_monthly_net_income:{label:'monthly net income',prefix:'$',suffix:'',href:''}
      }


      const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
      const [maxHeight, setMaxHeight] = useState<number>(0);

      useEffect(() => {
        // Calculate the height of the tallest element after component renders
        const heights = itemRefs.current.map(item => item?.getBoundingClientRect().height || 0);
        const tallestHeight = Math.max(...heights);
        setMaxHeight(tallestHeight);
      }, []); // Empty dependency array ensures it runs once after mount


    return(
        <div className="flex flex-row-reverse gap-1">
            {Object.keys(transactioDataLabel).map((data:string, index:number)=>{
                const prefix:string = transactioDataLabel[data as keyof typeof transactioDataLabel].prefix;
                const suffix:string = transactioDataLabel[data as keyof typeof transactioDataLabel].suffix;
                const link:string = transactioDataLabel[data as keyof typeof transactioDataLabel].href;

                return(
                <div key={index} className="flex-1" >
                    <CardHolderTiny>
                        <div ref={el => (itemRefs.current[index] = el)} style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }} className="flex flex-col justify-center items-center gap-2">
                            <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                                <p className="font-semibold capitalize md:text-sm lg:text-sm">
                                {transactioDataLabel[data as keyof typeof transactioDataLabel].label}
                                </p>
                            </div>
                            <div className="text-[#31c4a2]">
                                <Link className="font-semibold md:text-sm lg:text-lg" href={link}>
                                {prefix!='' && prefix}    {transactioData[data as keyof typeof transactioDataLabel].toFixed(0)} {suffix!='' && suffix}
                                </Link>
                            </div>
                        </div>
                        
                    </CardHolderTiny>
                </div>
                )

            })}

        </div>
    )

}

export default HeaderSummary;