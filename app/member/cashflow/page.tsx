"use client";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import CashflowList from './CashFlowGrid';

const Cashflow = ()=>{

    const authCtx = useAuth();
    const userid:any  = authCtx.userId;

    return(
            
            <DefaultLayout>
                <div className="flex flex-col">
                <HolderOne
                    title="your cashflow dashboard"
                    linkItems={[]}

                />

                <div className="w-full mt-0 lmd:mt-0 md:mt-5 md:border-[#fafafa] md:border-[2px] md:shadow-1 md:rounded-lg md:p-5">
                    <CashflowList user_id={userid} />
                </div>

                </div>

            
        </DefaultLayout>
        
    )

}

export default Cashflow;