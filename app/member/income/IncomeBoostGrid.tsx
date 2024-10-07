import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useAuth from '@/app/hooks/useAuth';
import useFetchGridData, { AlertBox, DeleteActionGlobal, GetInVisibleColumn, getPageNumbers, GetShowingText, PerPageList } from "@/app/components/grid/useFetchGridData";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import { confirmAlert } from "react-confirm-alert";
import GridGlobalSearch from "@/app/components/grid/GridGlobalSearch";
import GridActionLink from "@/app/components/grid/GridActionLink";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import { DataLabel } from "./bst/cu/DataValidationSchema";
import GridActionLinkFixed from '@/app/components/grid/GridActionLinkFixed';


const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface DataRow {
    _id:string;    
    income_boost_source:string;
    income_boost:number;
    pay_date_boost: string;
    repeat_boost:string;
}
interface ExtraPayloadProps{  
  total_income_boost:number;
  

}
const IncomeBoostGrid = ()=>{
    

    const authCtx = useAuth();

    const [extraPayload, setExtraPayload] = useState<ExtraPayloadProps>({
      total_income_boost:0,
      
     });

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

    const setExtraPayloadHandler = useCallback((extra_payload:ExtraPayloadProps)=>{
      setExtraPayload(extra_payload)
    },[])
  
  
      const {error,loading,totalRows,pageCount} = useFetchGridData({
      urlSuffix:`income-boost/${authCtx.userId}`,
      pagination:pagination,
      sorting:sorting,
      globalFilter:globalFilter,
      setTableData:setTableData,
      setExtraPayload:setExtraPayloadHandler    
      })

      const total_income_boost =  extraPayload.total_income_boost;
     
      const deleteAction=useCallback(async(id:string, key:number=1)=>{
  
        const msg = key > 1 ?'Do you want to close this account?' :'Do you want to delete this account?';
        confirmAlert({
          title: msg,
          message: 'Are you sure to do this?',
          buttons: [
            {
              label: 'Yes',
              onClick: async()=>{ 
  
                DeleteActionGlobal({        
                  action:'delete-income-boost',        
                  data:{'id':id, 'key':key}
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


const generateItems = useCallback((row) => [
{
  actionId:'view',
  title:'Details',
  link:`income/bst/${row.getValue('_id')}`,                        
  icon :<svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>      
},
{
  actionId:'edit',
  title:'Edit',
  link:`income/bst/cu/${row.getValue('_id')}`,                        
  icon :<svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
},
{
  actionId:'delete',
  title:'Delete',
  link:`delete-income-boost`, 
  onClick:()=>{deleteAction(row.getValue('_id'))},                       
  icon :<svg className='mt-1' width={14} height={16} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.41406 1.54297L5.81641 2.5H11.6836L11.0859 1.54297C10.9727 1.35938 10.7695 1.25 10.5547 1.25H6.94141C6.72656 1.25 6.52734 1.35938 6.41016 1.54297H6.41406ZM12.1484 0.882812L13.1602 2.5H15H16.25H16.875C17.2188 2.5 17.5 2.78125 17.5 3.125C17.5 3.46875 17.2188 3.75 16.875 3.75H16.25V16.875C16.25 18.6016 14.8516 20 13.125 20H4.375C2.64844 20 1.25 18.6016 1.25 16.875V3.75H0.625C0.28125 3.75 0 3.46875 0 3.125C0 2.78125 0.28125 2.5 0.625 2.5H1.25H2.5H4.33984L5.35156 0.882812C5.69531 0.332031 6.29688 0 6.94141 0H10.5547C11.2031 0 11.8008 0.332031 12.1445 0.882812H12.1484ZM2.5 3.75V16.875C2.5 17.9102 3.33984 18.75 4.375 18.75H13.125C14.1602 18.75 15 17.9102 15 16.875V3.75H2.5ZM5.625 6.875V15.625C5.625 15.9688 5.34375 16.25 5 16.25C4.65625 16.25 4.375 15.9688 4.375 15.625V6.875C4.375 6.53125 4.65625 6.25 5 6.25C5.34375 6.25 5.625 6.53125 5.625 6.875ZM9.375 6.875V15.625C9.375 15.9688 9.09375 16.25 8.75 16.25C8.40625 16.25 8.125 15.9688 8.125 15.625V6.875C8.125 6.53125 8.40625 6.25 8.75 6.25C9.09375 6.25 9.375 6.53125 9.375 6.875ZM13.125 6.875V15.625C13.125 15.9688 12.8438 16.25 12.5 16.25C12.1562 16.25 11.875 15.9688 11.875 15.625V6.875C11.875 6.53125 12.1562 6.25 12.5 6.25C12.8438 6.25 13.125 6.53125 13.125 6.875Z" fill="currentColor"/>
</svg>

},
{
  actionId:'internal',
  title:'Close',
  link:`delete-income-boost`, 
  onClick:()=>{deleteAction(row.getValue('_id'),2)},                       
  icon :

<svg width={17} height={17} className='mt-1' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


}
], [deleteAction]);
  
      const columns: ColumnDef<DataRow>[] = useMemo(() => [
      
          {
              accessorKey: '_id',
              header: 'ID',
              visible: false
              
          },
          {

            accessorKey: 'earner',
            header: DataLabel.earner,
          },
          
          {
            accessorKey: 'income_boost',
            header: DataLabel.income_boost,
            cell: (info) => <p><span>$</span><span className="px-2">{info.getValue<number>().toFixed(2)}</span></p>,
            /*
            footer: (props) => {
              const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
                return sum + row.original.monthly_payment;
              }, 0);
              return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
            },
            */
           footer:(props)=><p><span>$</span><span className="px-2">{total_income_boost.toFixed(2)}</span></p>
          },
         
          

          
          {
            accessorKey: 'income_boost_source',
            header: DataLabel.income_boost_source,
            
          },
          

       

         

          
          
          {
            accessorKey: 'pay_date_boost',
            header: DataLabel.pay_date_boost,
          },

          {
            accessorKey: 'next_pay_date_boost',
            header: DataLabel.next_pay_date_boost,
          },
          
          {
            accessorKey: 'repeat_boost.label',
            header: DataLabel.repeat_boost,
          },
          
          {
            accessorKey: 'total_income_boost',
            header: DataLabel.total_income_boost,
            cell: (info) => <p><span>$</span><span className="px-2">{info.getValue<number>().toFixed(2)}</span></p>,
            /*
            footer: (props) => {
              const total = props.table.getCoreRowModel().rows.reduce((sum, row) => {
                return sum + row.original.monthly_payment;
              }, 0);
              return <p><span>$</span><span className="px-2">{total.toFixed(2)}</span></p>;
            },
            */
           //footer:(props)=><p><span>$</span><span className="px-2">{total_income_boost.toFixed(2)}</span></p>
          },
         
  
          
          

          
         
          

          {
            id: 'actions',
            header: 'Actions',
            cell:({row})=>(<GridActionLinkFixed
              hoveredRowHeight={hoveredRowHeight} // Adjust or compute dynamically as needed
              items={generateItems(row)}
            />)

          }
          


         

                  
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
      
          ], [/*hoveredRowId*/total_income_boost]);
      
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
  
            

    //const rows = table.getRowModel().rows;

    // const tableRows = useMemo(() => rows.map((row) => ({
    //   ...row,
    //   items: generateItems(row),
    // })), [rows, generateItems]);

    const tableRows = table.getRowModel().rows;

    return(
        
        <div>

            <div className="p-2 flex flex-col gap-5">

                    <div className="py-2">
                       <GridGlobalSearch 
                      filterInput={filterInput}
                      handleFilterChange={handleFilterChange}
                      applyFilter={applyFilter}
                      searchButtonText="Search"
                      placeHolderText="Search here"
                      />
                    </div>  
            
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
        (pageCount * per_page) > per_page
        &&
        <div className="mt-3">
      <GridPaginationHolder 
      table={table}
      pageNumbers={pageNumbers}
      handlePageChange={handlePageChange}
      per_page_list={per_page_list}
      />
      </div>

}


            </div>
        
        
    )

}

export default IncomeBoostGrid;