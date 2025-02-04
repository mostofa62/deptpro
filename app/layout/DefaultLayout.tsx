"use client"; // This is a client component 👈🏽


import { ReactNode, useCallback, useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import UseAuthRoute from '@/app/hooks/useAuthRoute';
import { useRouter, usePathname } from "next/navigation";
import { RouteChangeListener } from '../components/utils/RouteChangeListener';
import { AppContextProvider } from '../context/app-context';
import HeaderSummary from './HeaderSummary';
import HeaderOne from '../components/HeaderOne';
import { useMediaQuery } from 'react-responsive';
import useAuth from '../hooks/useAuth';
import axios from 'axios';


type TransactionData = {
  debt_total_balance: number;
  month_debt_free: string;
  financial_frdom_date: string;
  financial_frdom_target: number;
  saving_progress: number;
  total_paid_off: number;
  snowball_amount: number;
  monthly_budget: number;
  total_monthly_minimum: number;
  total_monthly_bill_expese:number;
  total_monthly_net_income: number;  
  active_debt_account: number;
};


interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const authCtx = useAuth();  
  const user_id = authCtx.userId;
  const url = process.env.NEXT_PUBLIC_API_URL || '';

  //const redirect = useAuthRoute(pathname);
  
  
  //useProtection();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const isTab = useMediaQuery({ maxWidth: 900 });

  const [transactionData, setTransactionData] = useState<TransactionData>({
    debt_total_balance: 0,
    month_debt_free: '',
    financial_frdom_date: '',
    financial_frdom_target: 0,
    saving_progress: 0,
    total_paid_off: 0,
    snowball_amount: 0,
    monthly_budget: 0,
    total_monthly_minimum: 0,
    total_monthly_bill_expese: 0,
    total_monthly_net_income: 0,    
    active_debt_account: 0,
  });

  const fetchTransactionData = useCallback(async () => {
    try {
      const response = await axios.get<TransactionData>(`${url}header-summary-data/${user_id}`);
      setTransactionData(response.data);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  }, [user_id, url]);

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData, pathname]);

  //alert(isTab)

  return (
    <div className="bg-white">
      
      <RouteChangeListener/>
      <AppContextProvider>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden bg-slate-800">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} transactionData={transactionData} />
        {/* <!-- ===== Sidebar End ===== --> */}

         {/* Overlay for mobile view */}
         {(isMobile || isTab) && sidebarOpen && (
      <div className="absolute inset-0 bg-black opacity-50 z-999 pointer-events-auto h-screen w-full" />
    )}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
         
         
          {/* <!-- ===== Header Start ===== --> */}
          <HeaderOne sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} transactionData={transactionData} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
              <div className="mx-auto py-2.5 px-1 md:px-2 md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-2xl">

              <HeaderSummary transactionData={transactionData}/>
              
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
