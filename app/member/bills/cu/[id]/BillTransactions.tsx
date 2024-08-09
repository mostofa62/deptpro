import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{getPageNumbers,GetInVisibleColumn, GetShowingText, PerPageList, DeleteActionGlobal, AlertBox} from "@/app/components/grid/useFetchGridData";
import GridGlobalSearch from "@/app/components/grid/GridGlobalSearch";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import GridActionLink from "@/app/components/grid/GridActionLink";
import { confirmAlert } from "react-confirm-alert";
import useAuth from '@/app/hooks/useAuth';
import { useMemo, useState } from 'react';
import CardHolderDefault from '@/app/components/ui/CardHolderDefault';
import Loading from '@/app/loading';

const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface paymentProps{
    trans_id:string;
    amount:number;
    due_date:string;
  }

interface BillProps{
    bill_acc_id:string;
    user_id:string;
    tab_number:number;
    onPayment:(data:any)=>void
    onEdit:(data:any)=>void
}


interface DataRow {
    _id:string;    
    amount: number;
    due_date:string;
    payment_status:number;   
}

const BillTransactions = ({bill_acc_id, user_id,tab_number,onPayment,onEdit}:BillProps)=>{


    const authCtx = useAuth();

    const [data, setData] = useState<DataRow[]>([]);
    
    const [sorting, setSorting] = useState<SortingState>([]); 
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: per_page });

    const setTableData=(tableData:[])=>{
        setData(tableData);
    }

    const [globalFilter, setGlobalFilter] = useState('');    

    const {error,loading,totalRows,pageCount} = useFetchGridData({
        urlSuffix:`bill-trans/${bill_acc_id}`,
        pagination:pagination,
        sorting:sorting,
        globalFilter:globalFilter,
        setTableData:setTableData      
        })

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: '_id',
                header: 'ID',
                visible: false
                
            },
            
            
            {
                accessorKey: 'amount',
                header: 'Amount',
                
            },
            {
              accessorKey: 'due_date',
              header: 'Due',
            },            
           
        
            ], []);


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

              const pageNumbers = getPageNumbers(table.getPageCount(),pagination.pageIndex);
      
      
              const handlePageChange = (pageIndex: number) => {
                  setPagination(old => ({
                    ...old,
                    pageIndex,
                  }));
                };

                const deleteAction=async(id:string)=>{


                    confirmAlert({
                      title: 'Do you want to delete this?',
                      message: 'Are you sure to do this?',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: async()=>{ 
              
                            DeleteActionGlobal({        
                              action:`delete-bill-transaction/${bill_acc_id}`,        
                              data:{'id':id}
                            }).then((deletedData)=>{
                                //console.log(deletedData)
                                AlertBox(deletedData.message, deletedData.deleted_done);
                                if(deletedData.deleted_done > 0){
                                  const updatedData:any = data.filter((row:any) => row._id !== id);              
                                  setData(updatedData)
                                }
                            })
                            
                          }
                        },
                        {
                          label: 'No',
                          onClick: () => ()=>{                
              
                          }
                        }
                      ],
                      closeOnEscape: true,
                      closeOnClickOutside: true,
                    
                    });                                                        
                                        
                    
                  }
        

                return(

                    <div className="grid grid-flow-row">

                    <p className="text-[16px] uppercase font-medium mt-3">Bill History</p>

                    <hr className="mt-2 border-stroke"/>

                    <div className="grid grid-cols-2 gap-1 mt-4">

                    {loading ? <div className='w-full col-span-2 mt-[-100px]'>
                        <Loading width={150}/>
                        </div>:<>

                    {table.getRowModel().rows.map((row:any) => {

                        
                    
                        return(
                            <div className="w-full" key={row.id}>
                            <CardHolderDefault>
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-full text-left">
                                        <p className='text-[20px] font-semibold'><span>$</span><span className='ml-1'>{row.original.amount}</span></p>
                                    </div>
                                    <div className="w-full">
                                        <svg className='relative left-40 top-0' width={22} height={22} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </div>

                                    <div className="w-full col-span-2">
                                        <p className='font-medium text-[15px]'><span>DUE:</span><span className='ml-1'>{row.original.due_date_word}</span></p>
                                    </div>

                                    <div className="w-full">
                                        <button onClick={()=>{ onPayment({'id':row.original._id, 'due_date':row.original.due_date,'amount':row.original.amount})  }} className="text-[15px] h-[40px] bg-[#56595e] rounded text-white px-4  capitalize text-center font-semibold">
                                        Add Payment
                                        </button>
                                        
                                    </div>
                                    <div className="w-full flex flex-row relative left-25">
                                        <button 
                                        onClick={()=>{ onEdit({'id':row.original._id, 'due_date':row.original.due_date,'amount':row.original.amount,'autopay':row.original.autopay}) }}
                                        title='Edit' className="text-[15px] h-[38px] border-[#56595e] border  rounded text-[#56595e] px-2  capitalize text-center font-semibold">
                                        <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>


                                        </button>


                                        <button onClick={()=>deleteAction(row.original._id)} title='Delete' className="ml-5 text-[15px] h-[38px] border-[#56595e] border  rounded text-[#56595e] px-2  capitalize text-center font-semibold">
                                        

                                        <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>



                                        </button>
                                    </div>

                                    

                                </div>
                                
                            </CardHolderDefault>
                            </div>

                        )
                
                
                    })}
                    </>
                    }

                    
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

export default BillTransactions;