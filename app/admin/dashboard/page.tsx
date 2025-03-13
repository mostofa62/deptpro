"use client";
import AdminLayout from "@/app/layout/AdminLayout";
import Link from "next/link";
import {useEffect} from 'react';
import useAuth from '@/app/hooks/useAuth';
import CardHolder from "@/app/components/ui/CardHolder";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";

const Roles ={
  2:'Admins',
  10:'Clients',
  13:'Prospect List'
}

export default function AdminDashBoard() {
    const authCtx = useAuth();
    const user_id: any = authCtx.adminId;
    const payload = {
      role_counts: [],
      online_count:0,
    };
    
    const AdminData: any = useFetchDropDownObjects({
      urlSuffix: `adminpg/${user_id}`,
      payLoads: payload,
    });

    

    
      

    return(
       
        <AdminLayout>
        <div className="flex">

          <div className="flex w-auto shrink-0 grow-0 basis-auto gap-4  mt-2">
          <div className="">
          <CardHolder title={`${authCtx.displayName}`}>
                <p>Welcome</p>
          </CardHolder>
          </div>
          <div className="">
          <CardHolder title={`Role Wise Users Counts`}>
            {/* {JSON.stringify(AdminData.role_counts)} */}
            {
              AdminData.role_counts.length > 0 &&
              AdminData.role_counts.map((data:any, i:number)=>{

                return(
                  <p key={i}>
                    {Roles[data.role as keyof typeof Roles]} - {data.count}

                  </p>
                )
              })
            }

          </CardHolder>
          </div>
          <div className="">
          <CardHolder title={`Active Online Users`}>
            {AdminData.online_count}
          </CardHolder>
          </div>
          </div>
        </div>
        </AdminLayout>
        
    )


}