import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{getPageNumbers,GetInVisibleColumn, GetShowingText, PerPageList, DeleteActionGlobal, AlertBox} from "@/app/components/grid/useFetchGridData";
import GridGlobalSearch from "@/app/components/grid/GridGlobalSearch";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import GridActionLink from "@/app/components/grid/GridActionLink";
import { confirmAlert } from "react-confirm-alert";
import useAuth from '@/app/hooks/useAuth';
import { useMemo, useRef, useState } from 'react';
import CardHolderDefault from '@/app/components/ui/CardHolderDefault';
import Loading from '@/app/loading';
import useApp from '@/app/hooks/useApp';


const per_page_list = PerPageList();
const per_page = per_page_list[0];



interface IncomeProps{
    income_id:string;    
}


interface DataRow {
    _id:string;    
    base_gross_income: number;
    base_net_income:number;
    total_gross_for_period:number;
    total_net_for_period:number;
    pay_date_word:string;
    next_pay_date_word:string;    
    month_word:string;
    
}

const IncomeTransactions = ({income_id}:IncomeProps)=>{

    
    const authCtx = useAuth();
    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [data, setData] = useState<DataRow[]>([]);
    
    //const [sorting, setSorting] = useState<SortingState>([]); 
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: per_page });

    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);


    /* ROW HEIGHT CALCULATION FOR UI */

    const [hoveredRowHeight, setHoveredRowHeight] = useState<number | null>(null);
    const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});

    const handleMouseEnter = (rowId: any) => {
      const rowElement = rowRefs.current[rowId];
      if (rowElement) {
        setHoveredRowHeight(rowElement.offsetHeight);
        setHoveredRowId(rowId);
      }
    };
  
    const handleMouseLeave = () => {
      setHoveredRowHeight(null);
      setHoveredRowId(null);
    };

    /* END ROW HEIGHT CALCUALTION */

    const setTableData=(tableData:[])=>{
        setData(tableData);
    }

    //const [globalFilter, setGlobalFilter] = useState('');    

    const {error,loading,totalRows,pageCount} = useFetchGridData({
        urlSuffix:`income-transactions/${income_id}`,
        pagination:pagination,
        //sorting:sorting,
        //globalFilter:globalFilter,
        setTableData:setTableData      
        })

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: '_id',
                header: 'ID',
                visible: false
                
            },

            {
              accessorKey: 'month_word',
              header: 'Month',
              /*
              cell: ({ getValue, row, column }) => {
                const initialValue = getValue<string>();
                return (
                  <EditableCell
                    initialValue={initialValue}
                    id={row.original._id}
                    field={column.id}
                    onSave={saveData}
                    isEditable={false}
                  />
                );
              },
              */
            }, 


            {
              accessorKey: 'pay_date_word',
              header: 'Pay Date',
            
            }, 


            {
              accessorKey: 'next_pay_date_word',
              header: 'Next Pay Date',
            
            }, 
            
            
            
            

            {
              accessorKey: 'base_gross_income',
              header: 'Gross Income',
              cell: info => <p><span>$</span><span>{info.row.original.base_gross_income.toFixed(2)}</span></p>
              
            },

            {
              accessorKey: 'base_net_income',
              header: 'Net Income',
              cell: info => <p><span>$</span><span>{info.row.original.base_net_income.toFixed(2)}</span></p>
              
            },


            {
              accessorKey: 'total_gross_for_period',
              header: 'Total Gross Income',
              cell: info => <p><span>$</span><span>{info.row.original.total_gross_for_period.toFixed(2)}</span></p>
              
            },

            {
              accessorKey: 'total_net_for_period',
              header: 'Total Net Income',
              cell: info => <p><span>$</span><span>{info.row.original.total_net_for_period.toFixed(2)}</span></p>
              
            },

           
            
                      
           
        
            ], []);


            const table = useReactTable({
                data,
                columns,
                initialState: {
                  columnVisibility: GetInVisibleColumn(columns)
        
                },
                state: {
                  //sorting,
                  //globalFilter,
                  pagination,
                },
                //onSortingChange: setSorting,
                //onGlobalFilterChange: setGlobalFilter,
                onPaginationChange: setPagination,
                //globalFilterFn: 'includesString',
                getCoreRowModel: getCoreRowModel(),
                //getSortedRowModel: getSortedRowModel(),
                getPaginationRowModel: getPaginationRowModel(),
                manualPagination: true,
                //manualSorting: true,
                /*manualFiltering:true,*/
                //enableGlobalFilter: true,
                pageCount:pageCount
              });

              const pageNumbers = getPageNumbers(table.getPageCount(),pagination.pageIndex);
      
      
              const handlePageChange = (pageIndex: number) => {
                  setPagination(old => ({
                    ...old,
                    pageIndex,
                  }));
                };

              

                

                return(

                    <div className="grid grid-flow-row">

                    <p className="text-[16px] uppercase font-medium mt-3">Income Transaction History</p>

                    <hr className="mt-2 border-stroke"/>

                    <div className="grid grid-cols-1 gap-1 mt-4">

                    <div className="mt-10 p-2">  
            
            <table className="tanstack-table table-auto w-full text-left">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
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
                        <td className="text-center w-full p-2">
                          <span>{error}</span>
                        </td>
                      </tr>
                      </>
                      }  
                      {loading ?  
                      <>
                      <tr className="col-span-full row-span-full">
                        <td className="text-center w-full p-2">
                          <span>... Loading ...</span>
                        </td>
                      </tr>
                      </>
                      :
                      <>   
                      {table.getRowModel().rows.map((row:any) => {
                          
                          return(
                                             
                          
                          <tr 
                          ref={el => (rowRefs.current[row.original._id] = el)}
                          onMouseEnter={() => handleMouseEnter(row.original._id)}
                          onMouseLeave={handleMouseLeave}  
                          key={row.id} className="border-t">
                          {row.getVisibleCells().map((cell:any) => (
                              <td className="py-1" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                          ))}
     
                                          
                          </tr>
      
                            
                          
                          
                          )
                      })}
                      </> 
                      }
                      </tbody>
                      
              
            </table>
            
            
                  </div>
                    
                    </div>

                    <div className="grid grid-flow-row">

                    {
        !loading 
        && 
        !error 
        &&
        data.length > per_page
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
                    </div>
                )
    


}

export default IncomeTransactions;