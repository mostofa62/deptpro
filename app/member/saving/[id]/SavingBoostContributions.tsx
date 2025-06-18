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
import CardView from '@/app/components/grid/CardView';
import TableView from '@/app/components/grid/TableView';


const per_page_list = PerPageList();
const per_page = per_page_list[0];



interface SavingProps{
    saving_id:string;    
}


interface DataRow {
    id:number; 
    saving_boost:string;   
    contribution: number;
    total_balance:number;
    interest:number;
    progress:number;
    contribution_date_word:string;
    next_contribution_date_word:string;    
    month_word:string;
    
}

const SavingBoostContributions = ({saving_id}:SavingProps)=>{



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
        urlSuffix:`saving-boost-contributionspg/${saving_id}`,
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
                accessorKey: 'saving_boost',
                header: 'Saving Boost',
              
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
              accessorKey: 'contribution_date_word',
              header: 'Contribution Date',
            
            }, 


            {
              accessorKey: 'next_contribution_date_word',
              header: 'Next Contribution Date',
            
            }, 
            
            
            
            

            {
              accessorKey: 'contribution',
              header: 'Contribution',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.row.original.contribution)}</span></p>
              
            },

           


            {
              accessorKey: 'total_balance',
              header: 'Accumulated Balance',
              cell: info => <p><span>$</span><span>{Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.row.original.total_balance)}</span></p>
              
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
                  
                  />
                )
    


}

export default SavingBoostContributions;