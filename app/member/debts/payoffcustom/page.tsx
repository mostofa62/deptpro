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

import HolderOne from "@/app/layout/HolderOne";
import { DataLabel } from "../cu/DataValidationSchema";
import GridActionLinkFixed from "@/app/components/grid/GridActionLinkFixed";

const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface DataRow {
    _id:string;    
    name: string;
    debt_type:string;
    payor:string;   
    balance:number;
    interest_rate:number;
    monthly_payment:number;
    monthly_interest:number;
    next_due_date: string;
    custom_payoff_order:number;
    
}

const Debt = ()=>{



    const authCtx = useAuth();

    

    const [data, setData] = useState<DataRow[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);       
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: per_page });
    
    
    const [globalFilter, setGlobalFilter] = useState('');
    const [filterInput, setFilterInput] = useState<string>('');

    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);


    /* ROW HEIGHT CALCULATION FOR UI */

    const [hoveredRowHeight, setHoveredRowHeight] = useState<number | null>(null);
    const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});

    const handleMouseEnter = useCallback((rowId: any) => {
      const rowElement = rowRefs.current[rowId];
      if (rowElement) {
        setHoveredRowHeight(rowElement.offsetHeight);
        setHoveredRowId(rowId);
      }
    },[]);
  
    const handleMouseLeave = useCallback(() => {
      setHoveredRowHeight(null);
      setHoveredRowId(null);
    },[]);

    /* END ROW HEIGHT CALCUALTION */

    const setTableData = useCallback((tableData: DataRow[]) => {
      setData(tableData);
    }, []);

    // const setExtraPayloadHandler = useCallback((extra_payload:ExtraPayloadProps)=>{
    //   setExtraPayload(extra_payload)
    // },[])
  
  
      const {error,loading,totalRows,pageCount} = useFetchGridData({
      urlSuffix:`debtpayoff/${authCtx.userId}`,
      pagination:pagination,
      sorting:sorting,
      globalFilter:globalFilter,
      setTableData:setTableData,
      //setExtraPayload:setExtraPayloadHandler    
      })

      

     



  
      const columns: ColumnDef<DataRow>[] = useMemo(() => [
      
          {
              accessorKey: '_id',
              header: 'ID',
              visible: false
              
          },
          
          
          {
              accessorKey: 'name',
              header: 'Name',
              cell: (info) => <p><Link className="text-[#43ACD6]" href={`debts/${info.row.getValue('_id')}`}>{info.getValue()}</Link></p>,
            //   footer:(props)=><p className=" capitalize">{total_paid_off.toFixed(2)}% Paid Off</p>
          },

          {
            accessorKey: 'debt_type',
            header: 'Category',
            
          },

          {
            accessorKey: 'payor',
            header: 'Payor',
            
          },

          {
            accessorKey: 'due_date',
            header: 'Due Date',
          },  
            
          
          {
              accessorKey: 'balance',
              header: 'Balance',
              cell: (info) => <p><span>$</span><span>{info.getValue<number>()}</span></p>,
            //   footer:(props)=><p><span>$</span><span>{total_balance.toFixed(2)}</span></p>
              /*
              footer: (props) => {
                const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
                  return sum + row.original.balance;
                }, 0);
                return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
              },
              */
          },
  
          

          // {
          //   accessorKey: 'minimum_payment',
          //   header: 'Mimimum Payment',
          //   cell: (info) => <p><span>$</span><span className="px-2">{info.getValue<number>()}</span></p>,
          //   /*
          //   footer: (props) => {
          //     const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
          //       return sum + row.original.monthly_payment;
          //     }, 0);
          //     return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
          //   },
          //   */
          //  footer:(props)=><p><span>$</span><span className="px-2">{total_minimum_payment.toFixed(2)}</span></p>
          // },

          {
            accessorKey: 'monthly_payment',
            header: DataLabel.monthly_payment,
            cell: (info) => <p><span>$</span><span>{info.getValue<number>()}</span></p>,
            /*
            footer: (props) => {
              const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
                return sum + row.original.monthly_payment;
              }, 0);
              return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
            },
            */
        //    footer:(props)=><p><span>$</span><span>{total_monthly_payment.toFixed(2)}</span></p>
          },

          {
            accessorKey: 'interest_rate',
            header: 'Interest Rate',
            cell: (info) => <p><span>{info.getValue<number>()}</span><span>%</span></p>,
            
          },


          {
            accessorKey: 'monthly_interest',
            header: 'Monthly Interest',
            cell: (info) => <p><span>$</span><span>{info.getValue<number>()}</span></p>,
            /*
            footer: (props) => {
              const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
                return sum + row.original.monthly_interest;
              }, 0);
              return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
            },
            */
            // footer:(props)=><p><span>$</span><span>{total_monthly_interest.toFixed(2)}</span></p>
          },

         

                  
          /*
          {
              id: 'actions',
              header: 'Actions',
              cell: ({ row }) => (
              hoveredRowId === row.original.id ? 
              <button onClick={() => alert(`Action for ${row.original.name}`)}>Action</button> : 
              null
              ),
          },
          */
      
          ], [/*hoveredRowId*/]);
      
          const table = useReactTable({
              data,
              columns,
              initialState: {
                columnVisibility: GetInVisibleColumn(columns)
      
              },
              state: {
                sorting,
                globalFilter,
                pagination,
              },
              onSortingChange: setSorting,
              onGlobalFilterChange: setGlobalFilter,
              onPaginationChange: setPagination,
              globalFilterFn: 'includesString',
              getCoreRowModel: getCoreRowModel(),
              getSortedRowModel: getSortedRowModel(),
              getPaginationRowModel: getPaginationRowModel(),           
              manualPagination: true,
              manualSorting: true,
              /*manualFiltering:true,*/
              enableGlobalFilter: true,
              pageCount:pageCount
            });
          
          const showingText = GetShowingText(pagination.pageIndex, pagination.pageSize,totalRows);
  
          const pageNumbers = getPageNumbers(table.getPageCount(),pagination.pageIndex);
        
        
          const handlePageChange = (pageIndex: number) => {
                setPagination(old => ({
                  ...old,
                  pageIndex,
                }));
              };
        
        
          const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilterInput(e.target.value);        
            };
        
        
          const applyFilter = () => {
            setGlobalFilter(filterInput);
            };
        
          useEffect(()=>{
            if(filterInput.length < 1){
                setGlobalFilter("");
            }
            },[filterInput])
  
            

    const rows = table.getRowModel().rows;

    const tableRows = rows;

    

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

              {/* <div className="py-2">
                       <GridGlobalSearch 
                      filterInput={filterInput}
                      handleFilterChange={handleFilterChange}
                      applyFilter={applyFilter}
                      searchButtonText="Search"
                      placeHolderText="Search here"
                      />
                    </div>   */}
            
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
                {error &&
                <>
                <tr className="col-span-full row-span-full">
                  <td className="text-center w-full p-2 font-normal">
                    <span>{error}</span>
                  </td>
                </tr>
                </>
                }  
                {loading ?  
                <>
                <tr className="col-span-full row-span-full">
                  <td className="text-center w-full p-2 font-normal">
                    <span>... Loading ...</span>
                  </td>
                </tr>
                </>
                :
                <>   
                 {tableRows.map((row:any) => (
                                      
                    
                    <tr 
                    ref={el => (rowRefs.current[row.original._id] = el)}
                    onMouseEnter={() => handleMouseEnter(row.original._id)}
                    onMouseLeave={handleMouseLeave}   
                    key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell:any) => (
                        <td className="font-normal" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}

{/* {
                    hoveredRowId == row.original._id &&
                    <div className=" absolute">
                     <GridActionLink
            hoveredRowHeight={hoveredRowHeight} // Adjust or compute dynamically as needed
            items={row.items}
          />

                    </div>
                   
                    } */}
                                    
                    </tr>

                      
                    
                    
                ))}
                </> 
                }
                </tbody>

                {/* <tfoot>
                  {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map(header => (
                        <td key={header.id}>
                          {flexRender(header.column.columnDef.footer, header.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot> */}
                
        
      </table>
      
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
      per_page_list={per_page_list}
      />
      </div>

}


            </div>
        </DefaultLayout>
        
    )

}

export default Debt;