import React,{ useEffect, useState,useMemo,useCallback } from 'react';
import axios from "axios";
const url = process.env.NEXT_PUBLIC_API_URL;

interface hookData{
    urlSuffix:string;
}

const useFetchDropDownData = ({urlSuffix}:hookData)=>{
    const memoArray:any[]=useMemo(()=>[],[]);
    const [fetchFomrData,setFetchFormData] = useState(memoArray);
    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}${urlSuffix}`);

        // Add 'isChild' property to the child options for styling purposes
        const modifiedOptions = response.data.list.map((group:any) => {
            if (group.options) {
                return {
                ...group,
                options: group.options.map((option:any) => ({
                    ...option,
                    isChild: true,
                }))
                };
            }
            return group;  // Standalone options
        });
        //console.log(response.data)
        //return response.data.user;
        setFetchFormData(modifiedOptions);
    },[urlSuffix]);

    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);

    return fetchFomrData;

}

export default useFetchDropDownData;