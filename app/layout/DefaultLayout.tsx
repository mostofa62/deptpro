"use client"; // This is a client component 👈🏽


import { ReactNode, useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import UseAuthRoute from '@/app/hooks/useAuthRoute';
import { useRouter, usePathname } from "next/navigation";
import { RouteChangeListener } from '../components/utils/RouteChangeListener';
import { AppContextProvider } from '../context/app-context';
import HeaderSummary from '../member/debts/HeaderSummary';



interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  

  //const redirect = useAuthRoute(pathname);
  
  
  //useProtection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-white">
      
      <RouteChangeListener/>
      <AppContextProvider>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden bg-slate-800">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-1 md:p-2 2xl:p-2">
              <HeaderSummary/>
              
              {children}
              
              
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
      </AppContextProvider>
    </div>
  );
};

export default DefaultLayout;
