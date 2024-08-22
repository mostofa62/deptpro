import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{GetInVisibleColumn} from "@/app/components/grid/useFetchGridData";

import useAuth from '@/app/hooks/useAuth';
import { useMemo, useRef, useState } from 'react';
import useApp from '@/app/hooks/useApp';






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

const DebtAmortization = ({debt_acc_id, user_id,tab_number}:DebtProps)=>{

    console.log('Loading amortization seciton...')
    const authCtx = useAuth();
    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [data, setData] = useState<DataRow[]>([]);
    
    

    



    const setTableData=(tableData:[])=>{
        setData(tableData);
    }

    const [globalFilter, setGlobalFilter] = useState('');    

    const {error,loading,totalRows,pageCount} = useFetchGridData({
        urlSuffix:`debt-amortization/${debt_acc_id}`,
        setTableData:setTableData      
        })

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: 'month',
                header: 'Month',
              },

            {
              accessorKey: 'balance',
              header: 'Balance',
              cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
            }, 
            
            
            
            {
                accessorKey: 'total_payment',
                header: 'Total Payment',
                cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
            },
            
            {
                accessorKey: 'interest',
                header: 'Interest',
                cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
            },
            
            
            {
                accessorKey: 'principle',
                header: 'Principal',
                cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
            },

            
           
                      
           
        
            ], []);


            const table = useReactTable({
                data,
                columns,
                initialState: {
                  columnVisibility: GetInVisibleColumn(columns)
        
                },
               
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: getSortedRowModel(),
                
              });

             

                



                  

                return(

                    <div className="grid grid-flow-row">

                    <p className="text-[16px] uppercase font-medium mt-3">Amortization Table <span className='text-[11px] ml-2'>Projected payment schedule for this account</span></p>

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

                   
                    </div>
                )
    


}

export default DebtAmortization;