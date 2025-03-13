"use client"; // This is a client component 👈🏽


import { ReactNode, useEffect, useState } from 'react';
import AdminHeader from '@/app/components/AdminHeader';
import SidebarAdmin from '@/app/components/SidebarAdmin';
import UseAuthRoute from '@/app/hooks/useAuthRoute';
import { useRouter, usePathname } from "next/navigation";
import { RouteChangeListener } from '../components/utils/RouteChangeListener';
import { AppContextProvider } from '../context/app-context';




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
        <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== AdminHeader Start ===== --> */}
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== AdminHeader End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-1 md:p-2 2xl:p-2">
             
              
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
