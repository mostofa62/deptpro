import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, PaginationState } from '@tanstack/react-table';
import useFetchGridData,{getPageNumbers,GetInVisibleColumn, GetShowingText, PerPageList, DeleteActionGlobal, AlertBox} from "@/app/components/grid/useFetchGridData";

import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import { confirmAlert } from "react-confirm-alert";
import useAuth from '@/app/hooks/useAuth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DataLabel } from '../billextra/DataValidationSchema'
import GridActionLinkFixed from '@/app/components/grid/GridActionLinkFixed';
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
  bill_id:number;

  
}


interface DataRow {
    id:number; 
    amount: number;       
    due_date_word:string;
    pay_date_word:string;
    type:string;
    type_number:number;
    repeat_frequency:string;   
}

const ExtraTransactions = ({bill_id}:DebtProps)=>{

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });
    const authCtx = useAuth();
   

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
        urlSuffix:`bill-extraspg/${bill_id}`,
        pagination:pagination,
        sorting:sorting,
        globalFilter:globalFilter,
        setTableData:setTableData
        })

        const deleteAction=useCallback(async(id:string)=>{


          confirmAlert({
            title: 'Do you want to delete this?',
            message: 'Are you sure to do this?',
            buttons: [
              {
                label: 'Yes',
                onClick: async()=>{ 
    
                  DeleteActionGlobal({        
                    action:`delete-extra`,        
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
                              
          
        },[data])

        const generateItems = useCallback((row) =>[
                            
        //   {
        //     actionId:'internal',
        //     title:'Edit',
        //     link:``,
        //     onClick:()=>{onEdit({'id':row.original._id,'bill':row.original.bill,'type':row.original.type,'pay_date_extra':row.original.pay_date_extra,'amount':row.original.amount}) },                         
        //     icon :<svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        //     <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        // </svg>
        //   },
          
          
          {
            actionId:'delete',
            title:'Delete',
            link:`delete-extra`, 
            onClick:()=>{deleteAction(row.getValue('_id'))},                       
            icon :<svg width={14} height={16} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.41406 1.54297L5.81641 2.5H11.6836L11.0859 1.54297C10.9727 1.35938 10.7695 1.25 10.5547 1.25H6.94141C6.72656 1.25 6.52734 1.35938 6.41016 1.54297H6.41406ZM12.1484 0.882812L13.1602 2.5H15H16.25H16.875C17.2188 2.5 17.5 2.78125 17.5 3.125C17.5 3.46875 17.2188 3.75 16.875 3.75H16.25V16.875C16.25 18.6016 14.8516 20 13.125 20H4.375C2.64844 20 1.25 18.6016 1.25 16.875V3.75H0.625C0.28125 3.75 0 3.46875 0 3.125C0 2.78125 0.28125 2.5 0.625 2.5H1.25H2.5H4.33984L5.35156 0.882812C5.69531 0.332031 6.29688 0 6.94141 0H10.5547C11.2031 0 11.8008 0.332031 12.1445 0.882812H12.1484ZM2.5 3.75V16.875C2.5 17.9102 3.33984 18.75 4.375 18.75H13.125C14.1602 18.75 15 17.9102 15 16.875V3.75H2.5ZM5.625 6.875V15.625C5.625 15.9688 5.34375 16.25 5 16.25C4.65625 16.25 4.375 15.9688 4.375 15.625V6.875C4.375 6.53125 4.65625 6.25 5 6.25C5.34375 6.25 5.625 6.53125 5.625 6.875ZM9.375 6.875V15.625C9.375 15.9688 9.09375 16.25 8.75 16.25C8.40625 16.25 8.125 15.9688 8.125 15.625V6.875C8.125 6.53125 8.40625 6.25 8.75 6.25C9.09375 6.25 9.375 6.53125 9.375 6.875ZM13.125 6.875V15.625C13.125 15.9688 12.8438 16.25 12.5 16.25C12.1562 16.25 11.875 15.9688 11.875 15.625V6.875C11.875 6.53125 12.1562 6.25 12.5 6.25C12.8438 6.25 13.125 6.53125 13.125 6.875Z" fill="currentColor"/>
        </svg>
        
          }
        ], [deleteAction]);

        const columns: ColumnDef<DataRow>[] = useMemo(() => [
    
            {
                accessorKey: '_id',
                header: 'ID',
                visible: false
                
            },

            // {
            //   accessorKey: 'bill',
            //   header: DataLabel.bill,
            // },

            {
              accessorKey: 'type',
              header: DataLabel.type,
            },

           
            {
              accessorKey: 'pay_date_word',
              header: DataLabel.pay_date,
            },
            {
              accessorKey: 'due_date_word',
              header: DataLabel.due_date,
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
                cell: info => <p>{info.row.original.type_number>1 &&<span>-</span>}<span className='ml-1'>$</span><span>{Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,maximumFractionDigits: 2}).format(info.getValue<number>())}</span></p>
                
            },

            {
              accessorKey: 'repeat_frequency',
              header: DataLabel.repeat_frequency,
            },

            // {
            //   id: 'actions',
            //   header: 'Actions',
            //   cell:({row})=>(<GridActionLinkFixed
            //     hoveredRowHeight={hoveredRowHeight} // Adjust or compute dynamically as needed
            //     items={generateItems(row)}
            //   />)
    
            // }

            

           
                      
           
        
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

export default ExtraTransactions;