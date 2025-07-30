"use client"; // This is a client component 👈🏽
import { ReactNode, useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
//import useAuthRoute from '@/app/hooks/useAuthRoute';
import { useRouter, usePathname } from "next/navigation";
import UseAuthRoute from "@/app/hooks/useAuthRoute";
import useAuth from "@/app/hooks/useAuth";

interface DefaultLayoutProps {
  children: ReactNode;
}

const FullPageLayout = ({ children }: DefaultLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const authCtx = useAuth();

  //const redirect = useAuthRoute(pathname);
  /*
  useEffect(()=>{
    if(typeof redirect !='undefined'){
      router.push(redirect);
    }
    
  },[])
  */
  /*
  useEffect(()=>{
    /*
    if(typeof redirect !='undefined'){
      router.push(redirect);
    }*/
  /*
    if(!authCtx.isLoggedIn){
      router.push('/');
    }
      
  },[authCtx.isLoggedIn,router,pathname])
  */
  //const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#43ACD6]">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="sm:flex sm:h-screen lmd:h-screen sm:overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}

        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="sm:relative sm:flex sm:flex-1 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}

          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="sm:mx-auto md:max-w-screen-2xl xl:mx-auto sm:p-4 md:px-15 md:py-6 lg:px-10 lg:py-5 xl:px-8 xl:py-5 2xl:px-10 2xl:py-5">
              <UseAuthRoute>{children}</UseAuthRoute>
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default FullPageLayout;
