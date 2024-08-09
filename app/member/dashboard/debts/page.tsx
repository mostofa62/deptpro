"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import {useEffect} from 'react';
import useAuth from '@/app/hooks/useAuth';
import CardHolder from "@/app/components/ui/CardHolder";
const Debt = ()=>{

    return(
        
        <DefaultLayout>
            <div className="grid grid-flow-row">
            <div className="mt-4">
                <div className="flex flex-row">
                    <div className="p-3">
                        <span className="text-lg capitalize font-semibold text-[#4F4F4F]">DEBTS</span>
                    </div>
                    <div className="p-3">
                        <span className="text-xs font-semibold">1-50 of 100</span>
                    </div>
                    <div className="p-2">
                        <Link
                            href={'debts/cu'}
                            className={`text-sm capitalize group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   bg-[#0166FF] text-white`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={20} height={20} stroke-width="1.5" stroke="currentColor" className="">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            Add Debt
                        </Link>
                    </div>
                </div>
            </div>

            </div>
        </DefaultLayout>
        
    )

}

export default Debt;