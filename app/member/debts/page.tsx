"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useAuth from '@/app/hooks/useAuth';
import CardHolder from "@/app/components/ui/CardHolder";
import useFetchGridData, { AlertBox, DeleteActionGlobal, GetInVisibleColumn, getPageNumbers, GetShowingText, PerPageList } from "@/app/components/grid/useFetchGridData";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import { confirmAlert } from "react-confirm-alert";
import GridGlobalSearch from "@/app/components/grid/GridGlobalSearch";
import GridActionLink from "@/app/components/grid/GridActionLink";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import TotalAllocation from "./TotalAllocation";
import HolderOne from "@/app/layout/HolderOne";
import { DataLabel } from "./cu/DataValidationSchema";
import GridActionLinkFixed from "@/app/components/grid/GridActionLinkFixed";
import TabView from "@/app/components/ui/TabView";
import DebtGrid from "./DebtGrid";


interface Tab {
  label: string;
  content: React.ReactNode;
}

const Debt = ()=>{

    

    const authCtx = useAuth();
    const userid:any  = authCtx.userId;

    const [activeTab, setActiveTab] = useState(0);

    const tabs: Tab[] = [
      { 
        label: 'Active Accounts', 
        content: <DebtGrid />
      } ,   

      { 
        label: 'Closed Accounts', 
        content: <DebtGrid category={`closed_deleted`}/>
      },

      
      
      
    ];

    return(
        
        <DefaultLayout>
            <div className="grid grid-flow-row">

            <HolderOne
            title="your debt dashboard"            
            linkItems={[
              {
                link:'debts/cu',
                title:'add debt'
              },
              {
                link:'debts/settings',
                title:'set debt budget'
              }
            ]}
            />


            
            
            
            

            <div className="mt-10 p-2 mb-10">

              <TotalAllocation />

            </div>

            <div className="w-full mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg p-5">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView  tabs={tabs} align={`left`} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>


            </div>
        </DefaultLayout>
        
    )

}

export default Debt;