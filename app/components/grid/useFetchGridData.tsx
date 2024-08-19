import React,{ useEffect, useState,useMemo,useCallback } from 'react';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import toast from 'react-hot-toast';
const url = process.env.NEXT_PUBLIC_API_URL;
const number_of_page:any = process.env.NEXT_PUBLIC_NUMBER_OF_PAGE;



// Generate page numbers
export function getPageNumbers(pageCount:number,pageIndex:number)  {
    const totalPageCount = pageCount;
    const maxPageNumButtons = number_of_page;//from enviroment settings
    const currentPage = pageIndex;
    let startPage = Math.max(currentPage - maxPageNumButtons / 2, 0);
    let endPage = Math.min(startPage + maxPageNumButtons, totalPageCount);

    if (endPage === totalPageCount) {
      startPage = Math.max(endPage - maxPageNumButtons, 0);
    }

    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
};

export function GetInVisibleColumn(finalColumnDef: any) {

    let inVisibleColumns = finalColumnDef.filter(
      (col: { visible: boolean }) => col.visible === false
    );
    
    const removedColumn = {} as Record<string, boolean>;
    for (const item of inVisibleColumns) {
      removedColumn[item.accessorKey] = false;
    }
  
    return removedColumn;
}

export function GetShowingText(pageIndex:number, pageSize:number, totalRows:number){    
    const startIndex = pageIndex * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, totalRows);
    const showingText = `${startIndex} to ${endIndex} of ${totalRows}`;
    return showingText;

}

export function PerPageList(){
    let per_page_list:any = process.env.NEXT_PUBLIC_PER_PAGE_LIST;
    if(typeof per_page_list !='undefined'){
        per_page_list = per_page_list.split(",");
        per_page_list = per_page_list.reduce( (acc:any, x:any ) => acc.concat(+x), [])
    }
    else{
        per_page_list = []
    }
    return per_page_list;
}

export function AlertBox(message:string,status:number){

  if(status > 0){
    toast.success(message)
  }else{
    toast.error(message);
  }

}

export const  DeleteActionGlobal = async(
    {action, data}:
    {action:string,data:{}}
)=>{
        
        const responseResult = await axios.post(`${url}${action}`, 
            data, {
            
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ) .then(function (response) {
         
          return {
            'message':response.data.message,
            'error':response.data.error,
            'deleted_done':response.data.deleted_done
          };         
          
        })
        .catch(function (error) {                       
          return {
            'message':error,
            'error':0,
            'deleted_done':0
          };    
        });

        return responseResult;

}

interface hookData{
  urlSuffix:string;    
  pagination:any;
  sorting:any;
  globalFilter:any;
  setTableData:(data:[])=>void,
  setExtraPayload?:(payload_data:any)=>void
}

const useFetchGridData = ({
    urlSuffix,
    pagination,
    sorting,
    globalFilter,
    setTableData,
    setExtraPayload
}:hookData)=>{

    //const [data, setData] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [totalRows,setTotalRows] = useState(0);
    const [pageCount, setPageCount] = useState(0); 

    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try{
            const response = await axios.post(`${url}${urlSuffix}`, {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                sortBy: sorting,
                filter: globalFilter,
            });
            //setData(response.data.rows);
            setTableData(response.data.rows)
            setTotalRows(response.data.totalRows);
            setPageCount(response.data.pageCount);
            if(typeof response.data.extra_payload != 'undefined' && setExtraPayload){              
              setExtraPayload(response.data.extra_payload);
            }
        }catch (error: any) {
            setError(error.message || 'Something went wrong!');
        }
        setLoading(false);
    },[pagination,sorting,globalFilter,urlSuffix]);

    useEffect(() => {
        
        fetchData();
    }, [fetchData]);

    return {
        //data,
        error,
        loading,
        totalRows,
        pageCount
    }

};


export default useFetchGridData;