import { flexRender, Table } from "@tanstack/react-table";
import GridGlobalSearch from "./GridGlobalSearch";
import GridPaginationHolder from "./GridPaginationHolder";
import { PerPageList } from "./useFetchGridData";

const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface ViewData{
    table:Table<any>
    tableRows:any[];
    rowRefs: React.MutableRefObject<{ [key: number]: HTMLTableRowElement | HTMLDivElement| null }>;
    hoveredRowId:string|null;
    hoveredRowHeight:number|null;
    filterInput?:string;
    handleFilterChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void;
    pageCount:number;
    pageNumbers:number[];
    handlePageChange:(pageIndex: number) =>void;
    applyFilter?:()=>void,
    loading:any;
    error:any;
    handleMouseEnter:(rowId: any)=>void;
    handleMouseLeave:()=>void;
    enableSearch?:boolean;
    title?:string;
    perPage?:number;
}

const TableView = ({
    table,
    tableRows,
    rowRefs,
    hoveredRowId,
    hoveredRowHeight,
    filterInput,
    handleFilterChange,
    pageCount,
    pageNumbers,
    handlePageChange,
    applyFilter,
    loading,
    error,
    handleMouseEnter,
    handleMouseLeave,
    enableSearch=true,
    title,
    perPage=per_page
    
}:ViewData)=>{

    return (

        <div>

            <div className="p-2 flex flex-col gap-5 w-full overflow-x-auto">
                  {tableRows.length > 0 && enableSearch &&
                    <div className="py-2">
                       <GridGlobalSearch 
                      filterInput={filterInput || ''}
                      handleFilterChange={handleFilterChange || ((e: React.ChangeEvent<HTMLInputElement>)=>{})}
                      applyFilter={applyFilter|| (()=>{})}
                      searchButtonText="Search"
                      placeHolderText="Search here"
                      />
                    </div>  }


                    {title && <>
                    <p className="text-[16px] uppercase font-medium md:mt-3">
                      {title}</p>
<hr className="mt-2 border-stroke"/></>}
            
            <table className="tanstack-table table-auto w-full text-left overflow-x-auto">
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
                        <td colSpan={table.getAllColumns().length} className="col-span-full text-center w-full p-2 font-normal">
                          <span>{error}</span>
                        </td>
                      </tr>
                      </>
                      }  
                      {loading ?  
                      <>
                      <tr className="col-span-full row-span-full">
                        <td colSpan={table.getAllColumns().length} className="col-span-full text-center w-full p-2 font-normal">
                          <span>... Loading ...</span>
                        </td>
                      </tr>
                      </>
                      :
                      <> 
                        
                      {
                      
                      tableRows.length > 0 ?
                      tableRows.map((row:any) => (
                                            
                          
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

                            
                          
                          
                      )) : 

                      <tr className="col-span-full row-span-full">
                        <td colSpan={table.getAllColumns().length} className="col-span-full text-center w-full p-2 font-normal">
                          <span className=' capitalize'>No data found!</span>
                        </td>
                      </tr>
                      
                      
                      }
                      </> 
                      }
                      </tbody>
                      {tableRows.length > 0 && 
              table.getFooterGroups().some(group => 
                group.headers.some(header => header.column.columnDef.footer)
              ) && (
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
            )}

                      
              
            </table>
      
            </div>

            {
        !loading 
        && 
        !error 
        &&
        (pageCount * perPage) > perPage
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

export default TableView;