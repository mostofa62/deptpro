import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{GetInVisibleColumn, getPageNumbers, GetShowingText, PerPageList} from "@/app/components/grid/useFetchGridData";

import useAuth from '@/app/hooks/useAuth';
import { useCallback, useMemo, useRef, useState } from 'react';
import useApp from '@/app/hooks/useApp';

import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";

const per_page_list = PerPageList();
const per_page = per_page_list[0];


interface DebtProps{
    debt_acc_id:string;
    user_id:string;
    tab_number:number;    
}


interface DataRow {
    balance: number,
    interest: number,
    month: string,
    principle: number,
    snowball_amount: number,
    total_payment: number
}

interface ExtraPayloadProps{
  total_payment:number;
  total_snowball_amount:number;
  total_interest:number;
  total_principle:number;
}

const DebtAmortization = ({debt_acc_id, user_id,tab_number}:DebtProps)=>{

    console.log('Loading amortization seciton...')
    const authCtx = useAuth();
    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [data, setData] = useState<DataRow[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: per_page });
    
    
    const [extraPayload, setExtraPayload] = useState<ExtraPayloadProps>({
      total_payment:0,
      total_snowball_amount:0,
      total_interest:0,
      total_principle:0
    });
    



    const setTableData=(tableData:[])=>{
        setData(tableData);
    }


    const setExtraPayloadHandler = useCallback((extra_payload:ExtraPayloadProps)=>{
      setExtraPayload(extra_payload)
    },[])

    const [globalFilter, setGlobalFilter] = useState('');    

    const {error,loading,totalRows,pageCount} = useFetchGridData({
        urlSuffix:`debt-amortization-dynamically/${debt_acc_id}`,
        pagination:pagination,
        setTableData:setTableData,
        setExtraPayload:setExtraPayloadHandler      
        })

      const  total_payment = extraPayload.total_payment;
      const total_snowball_amount = extraPayload.total_snowball_amount;
      const total_interest = extraPayload.total_interest;      
      const total_principle = extraPayload.total_principle;

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: 'month',
                header: 'Month',
              },

            {
              accessorKey: 'balance',
              header: 'Balance',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>,
              
            }, 
            
            
            
            {
                accessorKey: 'total_payment',
                header: 'Total Payment',
                cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>,
                footer:(props)=><p className=" capitalize">{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(total_payment)}</p>
            },

            {
              accessorKey: 'snowball_amount',
              header: 'Snowball Amount',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>,
              footer:(props)=><p className=" capitalize">{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(total_snowball_amount)}</p>
            },
            
            {
                accessorKey: 'interest',
                header: 'Interest',
                cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>,
                footer:(props)=><p className=" capitalize">{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(total_interest)}</p>
            },
            
            
            {
                accessorKey: 'principle',
                header: 'Principal',
                cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>,
                footer:(props)=><p className=" capitalize">{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(total_principle)}</p>
            },

            
           
                      
           
        
            ], [total_payment,total_snowball_amount,total_principle,total_interest]);


            const table = useReactTable({
                data,
                columns,
                initialState: {
                  columnVisibility: GetInVisibleColumn(columns)
        
                },
                state: {
                  
                  pagination,
                },
               
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: getSortedRowModel(),

                onPaginationChange: setPagination,
                getPaginationRowModel: getPaginationRowModel(),
                manualPagination: true,
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

                  

                return(

                    <div className="grid grid-flow-row">

                    <p className="text-[16px] uppercase font-medium mt-3">Amortization Table <span className='text-[11px] ml-2'>Projected payment schedule for this account</span></p>

                    <hr className="mt-2 border-stroke"/>

                    <div className="mt-[10px] flex flex-row">
                      <div className="py-[1px] px-10">
                          <p className="text-[15px] text-[#4F4F4F]">{showingText}</p>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 gap-1 mt-4">

                    <div className="mt-1 p-2">  
            
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

                      <tfoot>
                  {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map(header => (
                        <td key={header.id}>
                          {flexRender(header.column.columnDef.footer, header.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot>
                      
              
            </table>
            
            
                  </div>

                  {
        !loading 
        && 
        !error 
        &&
        data.length > 0
        &&
        <div className="mt-[10px]">
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

export default DebtAmortization;