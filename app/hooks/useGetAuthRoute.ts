"use client";
import useAuth from "./useAuth";
import { usePathname } from "next/navigation";


const UseGetAuthRoute = ()=>{
    
    const authCtx = useAuth();
    const path = usePathname();
    const role:any = authCtx.role;
    const isLoggedIn = authCtx.isLoggedIn;
    let redirect:any = '/';

    if(isLoggedIn){
        //alert(parseInt(role));
        
        if(path == "/"){           
            redirect = parseInt(role) < 10 ?"/admin/dashboard":"/member/dashboard";            
        }
        
        if(parseInt(role) < 10 && path.includes('member')){
            redirect = "/admin";            
        }

        if(parseInt(role) >=10 && path.substring(1,6)=='admin'){
            redirect = "/member";            
        }
        
    }

    return redirect;

}

export default UseGetAuthRoute;