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
import { useMediaQuery } from 'react-responsive';
import TableView from '@/app/components/grid/TableView';
import CardView from '@/app/components/grid/CardView';


const per_page_list = PerPageList();
const per_page = per_page_list[0];


interface IncomeProps{
    income_id:number;    
}


interface DataRow {
    id:string;    
    base_gross_income: number;
    base_net_income:number;
    total_gross_for_period:number;
    total_net_for_period:number;
    pay_date_word:string;
    next_pay_date_word:string;    
    month_word:string;
    
}

const IncomeTransactions = ({income_id}:IncomeProps)=>{

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTab = useMediaQuery({ maxWidth: 900 });
    
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
        urlSuffix:`income-transactionspg/${income_id}`,
        pagination:pagination,
        //sorting:sorting,
        //globalFilter:globalFilter,
        setTableData:setTableData      
        })

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: 'id',
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
                    id={row.original.id}
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
            
            
            
            

            // {
            //   accessorKey: 'base_gross_income',
            //   header: 'Gross Income',
            //   cell: info => <p><span>$</span><span>{info.row.original.base_gross_income.toFixed(2)}</span></p>
              
            // },

            // {
            //   accessorKey: 'base_net_income',
            //   header: 'Net Income',
            //   cell: info => <p><span>$</span><span>{info.row.original.base_net_income.toFixed(2)}</span></p>
              
            // },


            {
              accessorKey: 'total_gross_for_period',
              header: 'Total Gross Income',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.row.original.total_gross_for_period)}</span></p>
              
            },

            {
              accessorKey: 'total_net_for_period',
              header: 'Total Net Income',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.row.original.total_net_for_period)}</span></p>
              
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
                  title='income transaction history'
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
                  title='income transaction history'
                  />
                )
    


}

export default IncomeTransactions;