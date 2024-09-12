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
        'active_debt_account':0,
        'total_monthly_net_income':0,
        'total_monthly_bill_expese':0,
        'saving_progress':25

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

    return (


        <div className="flex flex-row-reverse h-auto w-auto gap-1">

            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold">Saving Progress</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'saving'}>
                    {transactioData.saving_progress.toFixed(0)} %
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold capitalize">debt payoff progress</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'settings'}>
                    {transactioData.total_paid_off.toFixed(2)} %
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    {/* <p className="text-[15px] font-semibold">Snowball Amounts</p> */}
                    <p className="text-[15px] font-semibold capitalize">monthly + cashflow</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'settings'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.snowball_amount)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>


            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold capitalize">monthly debt budget</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'settings'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.monthly_budget)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            

            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold capitalize">minimum payments</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'/member/debts'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.total_monthly_minimum)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

           

            {/* <div className="w-[15%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold">Active Debts</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'/member/debts'}>
                    {transactioData.active_debt_account}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div> */}

            <div className="h-auto w-auto">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold capitalize">monthly bill totals</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'/member/income'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.total_monthly_bill_expese)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>

            <div className="w-[20%]">
            <CardHolderTiny>
                <div className="flex flex-row">
                <div className="bg-[#f99f5c] border-[#06c3ef] border-2 w-full text-center text-white">
                    <p className="text-[15px] font-semibold capitalize">monthly net income</p>
                </div>
                </div>
                <div className="flex flex-row py-2">
                <div className="w-full text-center text-[#31c4a2]">
                    <Link className="text-[19px] font-semibold" href={'/member/income'}>
                    $ {Intl.NumberFormat('en-US').format(transactioData.total_monthly_net_income)}
                    </Link>
                </div>
                </div>
            </CardHolderTiny>
            </div>



            


        </div>



    )

}

export default HeaderSummary;