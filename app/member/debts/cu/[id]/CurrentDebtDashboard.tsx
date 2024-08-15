import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import ProgressBarOne from "@/app/components/ui/ProgressBarOne";
import useApp from "@/app/hooks/useApp";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";


interface BillProps{
    dept_acc_id:string;
    user_id:string;
   
}
const url = process.env.NEXT_PUBLIC_API_URL;



interface fetchProps{
    currentBalance:number
    left_to_go:number;
}


   
const CurrentDebtDashboard = ({dept_acc_id, user_id}:BillProps)=>{

    const appCtx = useApp();
    const debtsAccountsScreen = appCtx.debtsAccountsScreen;

    const [fetchFomrData,setFetchFormData] = useState<fetchProps>({
        'currentBalance':0,
        'left_to_go':0

    });

    
    

    const fetchDataCallback=useCallback(async()=>{
        //console.log(id);
        const response = await axios.get(`${url}debt-summary/${dept_acc_id}`);
        //return response.data.user;
        setFetchFormData(response.data);
        

    },[dept_acc_id]);
    useEffect(()=>{

      //alert(debtsAccountsScreen)
        //if(debtsAccountsScreen){
          fetchDataCallback();
        //}
    
    },[fetchDataCallback, debtsAccountsScreen]);

    const formattedAmount = new Intl.NumberFormat('en-US').format(fetchFomrData.currentBalance);


    return(
        <CardHolderDefault>

                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-full text-left">
                                        <p className='text-[30px] font-semibold'><span>$</span><span className='ml-1'>{formattedAmount}</span></p>
                                    </div>
                                    <div className="w-full text-[#D3D3D3] flex justify-end items-center">
                                    <svg className='' xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M5 19h-4v-4h4v4zm6 0h-4v-8h4v8zm6 0h-4v-13h4v13zm6 0h-4v-19h4v19zm1 2h-24v2h24v-2z"/>
                                    </svg>

                                    </div>

                                    <div className="w-full col-span-2">
                                        <p className='font-semibold text-[15px] uppercase text-[#bdbbbb]'><span>CURRENT BALANCE</span></p>
                                    </div>

                                    <div className="w-full col-span-2 h-4 py-2 mt-1 mb-2">
                                        <ProgressBarOne title={`left to go`} progress={fetchFomrData.left_to_go} />
                                    </div>

                                    <div className="w-full col-span-2 h-4 py-2 mt-2 mb-4">

                                    </div>

                                   
                                </div>
        </CardHolderDefault>
    )


}


export default CurrentDebtDashboard;