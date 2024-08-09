
interface GridGlobalInterface{
 table:any;
 pageNumbers:any;
 handlePageChange:(e:any)=>void
 per_page_list?:any
}


export default function GridPaginationHolder(
    {
table,
pageNumbers,
handlePageChange,
per_page_list
    }:GridGlobalInterface
){

    return(
    




        
            <div className="flex flex-row items-center justify-center gap-2 h-[35px] mb-5">


              <div>
              <button className={`w-[35px] h-[35px] border-[#0166FF] border-[1px] rounded-sm p-1 px-2 text-[#0166FF] bg-[#0166FF] bg-opacity-5 ${!table.getCanPreviousPage()? 'cursor-pointer':''}}`}
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={18} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                </svg>

              </button>
              </div>
              <div>
              <button className={`w-[35px] h-[35px] border-[#0166FF] border-[1px] rounded-sm p-1 px-2 text-[#0166FF] bg-[#0166FF] bg-opacity-5 ${!table.getCanPreviousPage()? 'cursor-pointer':''}}`}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={18} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>

              </button>
              </div>

              {pageNumbers.map((page:any,i:any) => (
                <div key={i}>
                <button
                className={`w-[35px] h-[35px] border-[#0166FF] border-[1px] rounded-sm  
                  ${!table.getCanPreviousPage()? 'cursor-pointer':''}}
                  ${table.getState().pagination.pageIndex === page?'text-white bg-[#0166FF]':'text-[#0166FF] bg-[#0166FF] bg-opacity-5'}
                  `}
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{ fontWeight: table.getState().pagination.pageIndex === page ? 'bold' : 'normal' }}
                >
                  {page + 1}
                </button>
                </div>
              ))}
              <div>
              <button className={`w-[35px] h-[35px] border-[#0166FF] border-[1px] rounded-sm p-1 px-2 text-[#0166FF] bg-[#0166FF] bg-opacity-5 ${!table.getCanPreviousPage()? 'cursor-pointer':''}}`}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={15} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>

              </button>
              </div>
              <div>
              <button className={`w-[35px] h-[35px] border-[#0166FF] border-[1px] rounded-sm p-1 px-2 text-[#0166FF] bg-[#0166FF] bg-opacity-5 ${!table.getCanPreviousPage()? 'cursor-pointer':''}}`}
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={18} height={15} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>

              </button>

              </div>
              {per_page_list &&
              <div>

              <select className="border-[#0166FF] border-[1px] rounded-sm p-1 px-2 text-sm h-[35px] w-[80px]"
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
              >
                {per_page_list.map((pageSize:any) => (
                  <option className="p-1 rounded-sm" key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              
              </div>
              }
              {/*
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              */}
              
            </div>
      

        
    )

}