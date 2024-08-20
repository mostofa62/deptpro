import CardHolderTiny from "@/app/components/ui/CardHolderTiny";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_API_URL;
const HeaderSummary = ()=>{

    const authCtx = useAuth();
    const user_id = authCtx.userId;

    const [transactioData, setTransactionData] = useState({
        'debt_total_balance':0,
        'monthly_budget':0,
        'total_monthly_minimum':0,
        'snowball_amount':0,
        'total_paid_off':0,
        'active_debt_account':0
      })

      const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
          const response = await axios.get(`${url}debt-header-data/${user_id}`);
          //return response.data.user;
          setTransactionData(response.data);
                
    
      },[user_id]);
      useEffect(()=>{
          
          fetchDataCallback();
          
    
      },[fetchDataCallback]);

    return (


        <div className="flex flex-row-reverse gap-1">

            <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#828ba1] w-full text-center text-white">
                    <p className="text-[15px]">Overall Progress</p>
                </div>
                </div>
                <div className="flex flex-row">
                <div className="w-full text-center text-[#48ce67]">
                    <Link href={'/member/debt/settings'}>
                    {transactioData.total_paid_off.toFixed(2)} %
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#828ba1] w-full text-center text-white">
                    <p className="text-[15px]">Snowball Amounts</p>
                </div>
                </div>
                <div className="flex flex-row">
                <div className="w-full text-center text-[#48ce67]">
                    <Link href={'/member/debt/settings'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.snowball_amount)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            

            <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#828ba1] w-full text-center text-white">
                    <p className="text-[15px]">Minimum Payments</p>
                </div>
                </div>
                <div className="flex flex-row">
                <div className="w-full text-center text-[#48ce67]">
                    <Link href={'/member/debts'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.total_monthly_minimum)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#828ba1] w-full text-center text-white">
                    <p className="text-[15px]">Monthly Budget</p>
                </div>
                </div>
                <div className="flex flex-row">
                <div className="w-full text-center text-[#48ce67]">
                    <Link href={'/member/debt/settings'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.monthly_budget)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#828ba1] w-full text-center text-white">
                    <p className="text-[15px]">Active Debts</p>
                </div>
                </div>
                <div className="flex flex-row">
                <div className="w-full text-center text-[#48ce67]">
                    <Link href={'/member/debts'}>
                    {transactioData.active_debt_account}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>



            


        </div>



    )

}

export default HeaderSummary;