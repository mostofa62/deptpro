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
import { DataLabel } from "./cu/DataValidationSchema";
import TotalAllocation from "./TotalAllocation";
import HolderOne from "@/app/layout/HolderOne";
import SavingGrid from "./SavingGrid";
import TabView from "@/app/components/ui/TabView";




interface Tab {
  label: string;
  content: React.ReactNode;
}
const Saving = ()=>{
    

    const authCtx = useAuth();
    const [activeTab, setActiveTab] = useState(0);


    const tabs: Tab[] = [
      { 
        label: 'Active Accounts', 
        content: <SavingGrid/>
      } ,   

      { 
        label: 'Closed Accounts', 
        content: <SavingGrid category={`closed_deleted`}/>
      },

      
      
      
    ];

  
    return(
        
        <DefaultLayout>
            <div className="flex flex-col">


            <HolderOne
            title="your savings dashboard"            
            linkItems={[
                {
                link:'saving/cu',
                title:'add savings'
                },

                {
                  link:'saving/bst/cu',
                  title:'add saving boost'
                  }
            ]}
            />


            <div className="mt-10 p-2 mb-10">

              <TotalAllocation />

            </div>

            <div className="w-full mt-[32px] border-[#fafafa] border-[2px] shadow-1 rounded-lg">
            {/* <SavingBoostGrid saving_id={id}  /> */}
            {
              <TabView  tabs={tabs} align={`left`} onChageTab={(index)=>{
                setActiveTab(index)
              }} />
               }
            </div>


            {/* <div className="mt-3 p-2 border-[#E6E6E6] shadow-2">
              <SavingBoostGrid />
            </div> */}


            </div>
        </DefaultLayout>
        
    )

}

export default Saving;