import { flexRender, Table } from "@tanstack/react-table";
import { PerPageList } from "./useFetchGridData";
import GridPaginationHolder from "./GridPaginationHolder";
import GridGlobalSearch from "./GridGlobalSearch";

const per_page_list = PerPageList();
const per_page = per_page_list[0];

interface ViewData{
    table:Table<any>
    tableRows:any[];
    rowRefs: React.MutableRefObject<{ [key: number]: HTMLTableRowElement| HTMLDivElement | null }>;
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
}

const CardView = ({
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
    title
    
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
                    <p className="text-md uppercase font-medium">
                      {title}</p>
<hr className="mt-1 border-stroke"/></>}
            
                    <div className="overflow-x-auto">
  {/* Main container for cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {error && (
      <div className="col-span-full text-center p-4 font-normal">
        <span>{error}</span>
      </div>
    )}
    
    {loading ? (
      <div className="col-span-full text-center p-4 font-normal">
        <span>... Loading ...</span>
      </div>
    ) : (
      <>
        {tableRows.length > 0 ? (
          tableRows.map((row: any) => (
            <div
              key={row.id}
              ref={(el) => (rowRefs.current[row.original._id] = el)}
              onMouseEnter={() => handleMouseEnter(row.original._id)}
              onMouseLeave={handleMouseLeave}
              className="border p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Card Content */}
              {row.getVisibleCells().map((cell: any) => (
                <div key={cell.id} className="flex gap-3 items-start px-2 py-1 border border-[#E6E6E6]">
                  {cell.column.id!='actions' && <div className="font-semibold w-[50%]">{cell.column.columnDef.header}</div>}
                  <div className={`flex  ${cell.column.id=='actions' ? 'w-full items-center justify-center':'items-start w-[50%]'}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                </div>
              ))}

              {/* Optional action link */}
              {/* {hoveredRowId == row.original._id && (
                <div className="absolute top-2 right-2">
                  <GridActionLink hoveredRowHeight={hoveredRowHeight} items={row.items} />
                </div>
              )} */}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-4 font-normal">
            <span className="capitalize">No data found!</span>
          </div>
        )}
      </>
    )}
  </div>

  {/* Optional footer or extra information */}
  {tableRows.length > 0 && table.getFooterGroups().length > 0 && (
    <div className="mt-3 border rounded-md shadow-md hover:shadow-lg transition-shadow">
      <div className="text-center">
        {table.getFooterGroups().map((footerGroup) => (
          <div key={footerGroup.id} className="py-2">
            {footerGroup.headers.map((header) => (
              <div key={header.id} className="mt-1">
                {flexRender(header.column.columnDef.footer, header.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      
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
      />
      </div>

}


            </div>
    )



}


export default CardView;