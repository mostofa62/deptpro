"use client";
import { getPageNumbers, PerPageList } from "@/app/components/grid/useFetchGridData";
import useAuth from '@/app/hooks/useAuth';
import DefaultLayout from "@/app/layout/DefaultLayout";
import { Cell, ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, PaginationState, Row, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from 'react';

import HolderOne from "@/app/layout/HolderOne";

import axios from "axios";
import { DataLabel } from "../cu/DataValidationSchema";
const url = process.env.NEXT_PUBLIC_API_URL;

import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconDragVertical from "@/app/images/icon/drag-vertical";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";

const per_page_list = PerPageList();
const per_page = per_page_list[0];
// const per_page = 3;

interface DataRow {
    _id:string;    
    name: string;
    debt_type:string;   
    balance:number;    
    monthly_payment:number;
    monthly_interest:number;   
    custom_payoff_order:number;
    
}

const Debt = ()=>{



    const authCtx = useAuth();
    const userid = authCtx.userId;
    const [tableData, setTableData] = useState<DataRow[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // Page index (0-based)
    const [totalPages, setTotalPages] = useState(0);
    const [pageCount, setPageCount] = useState(0); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: per_page });



    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try{
            const response = await axios.post(`${url}debtpayoff/${userid}`, {
                pageIndex:  pagination ? pagination.pageIndex:0,
                pageSize: pagination? pagination.pageSize:0,
                
            });
            //setData(response.data.rows);
            setTableData(response.data.rows)
            if(typeof response.data.totalRows != 'undefined' && setTotalPages){ 
              setTotalPages(response.data.totalRows);
            }
            if(typeof response.data.pageCount != 'undefined' && setPageCount){ 
              setPageCount(response.data.pageCount);
            }
           
        }catch (error: any) {
            setError(error.message || 'Something went wrong!');
        }
        setLoading(false);
    },[pagination, userid]);

    useEffect(() => {
        
      fetchData();

      

  }, [fetchData]);

   

  
    const columns: ColumnDef<DataRow>[] = [
      {
        id: 'drag', // Unique identifier for the drag column
        header: '', // No header label
        cell: ({ row }) => (
          
             <IconDragVertical width={20} height={20} />
          
        ),
      },
      { accessorKey: 'custom_payoff_order', header: 'Order' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'debt_type', header: 'Debt Type' },
      { 
        accessorKey: 'balance', 
        header: 'Balance',
        cell: (info) => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>, 
      },
      { 
        accessorKey: 'monthly_payment', 
        header: 'Monthly Payment',
        cell: (info) => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>, 
      
      },
      { 
        accessorKey: 'monthly_interest', 
        header: 'Monthly Interest',
        cell: (info) => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>, 
      
      },
      // Add more column definitions as needed
    ];
    
          const table = useReactTable({
            data: tableData,
            columns,
            state: {              
              pagination,
            },
            getCoreRowModel: getCoreRowModel(),
            onPaginationChange: setPagination,
            getPaginationRowModel: getPaginationRowModel(),
            manualPagination: true,
            pageCount:pageCount
          });
          
    const sensors = useSensors(useSensor(MouseSensor));
    
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (over && active.id !== over.id) {
        const oldIndex = tableData.findIndex(row => row._id === active.id);
        const newIndex = tableData.findIndex(row => row._id === over.id);
  
        if (oldIndex !== -1 && newIndex !== -1) {
          const newTableData = arrayMove(tableData, oldIndex, newIndex);
  
          // Swap `custom_payoff_order` between the two rows
          const sourceRow = newTableData[oldIndex];
          const destinationRow = newTableData[newIndex];
          [sourceRow.custom_payoff_order, destinationRow.custom_payoff_order] =
            [destinationRow.custom_payoff_order, sourceRow.custom_payoff_order];
  
          setTableData(newTableData);
  
          // Send the updated rows to the backend
          const rowsToUpdate = [
            { _id: sourceRow._id, custom_payoff_order: sourceRow.custom_payoff_order },
            { _id: destinationRow._id, custom_payoff_order: destinationRow.custom_payoff_order },
          ];
          axios.post(`${url}update-payoff-order`, rowsToUpdate)
            .then(response => {
              console.log(response.data.message);
            })
            .catch(error => {
              console.error('Error updating payoff order:', error);
            });
        }
      }
    };
            

    const rows = table.getRowModel().rows;

  


    const pageNumbers = getPageNumbers(table.getPageCount(),pagination.pageIndex);
        
        
    const handlePageChange = (pageIndex: number) => {
          setPagination(old => ({
            ...old,
            pageIndex,
          }));
        };

    

    return(
        
        <DefaultLayout>
            <div className="grid grid-flow-row">

            <HolderOne
            title="custom payoff strategy"            
            linkItems={[
              {
                link:'/member/debts',
                title:'your debt dashboard'
              }
            ]}
            />


            
            
            
            

           

            <div className="mt-10 p-2 flex flex-col gap-5">

             

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={tableData.map(row => row._id)}>
        <table className="tanstack-table table-auto w-full text-left">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className={`font-medium
                  ${header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : ''}`
                } key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      <tbody>
      {table.getRowModel().rows.map(row => (
        <SortableRow key={row.id} row={row} getVisibleCells={() => row.getVisibleCells()} />
      ))}
    </tbody>
        </table>
      </SortableContext>
    </DndContext>
      
            </div>

            {
        !loading 
        && 
        !error 
        &&
        (pageCount * per_page) > per_page
        &&
        <div className="mt-[100px]">
      <GridPaginationHolder 
      table={table}
      pageNumbers={pageNumbers}
      handlePageChange={handlePageChange}
      
      />
      </div>

}

            


            </div>
        </DefaultLayout>
        
    )

}

// SortableRow component for draggable rows
const SortableRow: React.FC<{ row: Row<DataRow>; getVisibleCells: () => Cell<DataRow, unknown>[] }> = ({ row, getVisibleCells }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.original._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      
      {getVisibleCells().map((cell: Cell<DataRow, unknown>) => (
        <td key={cell.id}>
          {typeof cell.column.columnDef.cell === 'function'
            ? cell.column.columnDef.cell(cell.getContext())
            : cell.getValue()}
        </td>
      ))}
    </tr>
  );
};



export default Debt;