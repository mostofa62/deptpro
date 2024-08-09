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
        //console.log(response.data)
        //return response.data.user;
        setFetchFormData(response.data.list);
    },[urlSuffix]);

    useEffect(()=>{
        fetchDataCallback();
    
    },[fetchDataCallback]);

    return fetchFomrData;

}

export default useFetchDropDownData;