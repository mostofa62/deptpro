import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{GetInVisibleColumn, getPageNumbers, GetShowingText, PerPageList} from "@/app/components/grid/useFetchGridData";

import useAuth from '@/app/hooks/useAuth';
import { useCallback, useMemo, useRef, useState } from 'react';
import useApp from '@/app/hooks/useApp';

import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import { useMediaQuery } from 'react-responsive';
import CardView from '@/app/components/grid/CardView';
import TableView from '@/app/components/grid/TableView';

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

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });
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
                title='amortization table'
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
                title='amortization table'
                />
              )
    


}

export default DebtAmortization;