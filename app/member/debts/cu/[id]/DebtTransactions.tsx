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
import EditableCell from './transactions/EditableCell';
import { useMediaQuery } from 'react-responsive';
import CardView from '@/app/components/grid/CardView';
import TableView from '@/app/components/grid/TableView';

const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface paymentProps{
    trans_id:number;
    amount:number;
    due_date:string;
  }

interface DebtProps{
    debt_acc_id:number;
    user_id:number;
    tab_number:number;
    view_mode?:number;    
}


interface DataRow {
    id:string;    
    amount: number;
    previous_balance:number;
    new_balance:number;
    trans_date:string;
    type:string;
    billing_month_year:string;
    autopay:number;
    payment_status:number;   
}

const DebtTransactions = ({debt_acc_id, user_id,tab_number,view_mode}:DebtProps)=>{

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });

  
    const authCtx = useAuth();
    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [data, setData] = useState<DataRow[]>([]);
    
    const [sorting, setSorting] = useState<SortingState>([]); 
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

    const [globalFilter, setGlobalFilter] = useState('');    

    const {error,loading,totalRows,pageCount} = useFetchGridData({
        urlSuffix:`debt-transpg/${debt_acc_id}`,
        pagination:pagination,
        sorting:sorting,
        globalFilter:globalFilter,
        setTableData:setTableData      
        })

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: 'id',
                header: 'ID',
                visible: false
                
            },

            {
              accessorKey: 'trans_date',
              header: 'Date',
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
              accessorKey: 'billing_month_year',
              header: 'Billing Month',
            },
            
            {
              accessorKey: 'type',
              header: 'Type',
            },
            
            
            {
                accessorKey: 'amount',
                header: 'Amount',
                /*
                cell: ({ getValue, row, column }) => {
                  const initialValue = getValue<number>();
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
                cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
                
            },

            {
              accessorKey: 'previous_balance',
              header: 'Prev balance',
              cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
              
            },

            {
              accessorKey: 'new_balance',
              header: 'New balance',
              cell: info => <p><span>$</span><span>{info.getValue()}</span></p>
              
            },

            {
              accessorKey: 'autopay',
              header: 'Autopay',
              cell: (info:any) => <p>{info.getValue() > 0?'Yes':'No'}</p>,
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

               

                  
        

                  const rows = table.getRowModel().rows;

                  return(
  
                    isMobile || isTab ? <CardView
                    table={table}
                    tableRows={rows}
                    rowRefs={rowRefs}
                    hoveredRowId={hoveredRowId}
                    hoveredRowHeight={hoveredRowHeight}
                    
                    
                    pageCount={pageCount}
                    pageNumbers={pageNumbers}
                    handlePageChange={handlePageChange}
                    
                    loading={loading}
                    error={error}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    enableSearch={false}
                    title='transaction history'
                    />:<TableView
                    table={table}
                    tableRows={rows}
                    rowRefs={rowRefs}
                    hoveredRowId={hoveredRowId}
                    hoveredRowHeight={hoveredRowHeight}
                    
                    
                    pageCount={pageCount}
                    pageNumbers={pageNumbers}
                    handlePageChange={handlePageChange}
                    
                    loading={loading}
                    error={error}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    enableSearch={false}
                    title='transaction history'
                    />
                  )


}

export default DebtTransactions;