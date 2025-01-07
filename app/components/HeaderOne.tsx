import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import useAuth from '@/app/hooks/useAuth';
import useApp from '@/app/hooks/useApp';
import LogoIcon from '@/app/images/logo/logo-icon.svg';
import DropdownUser from './DropdownUser';
import ArrowGraph from '@/app/images/icon/arrowgraph';
import CoinSvg from '@/app/images/icon/coin';

type TransactionData = {
  debt_total_balance: number;
  month_debt_free: string;
  financial_frdom_date: string;
  financial_frdom_target: number;
};

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const authCtx = useAuth();
  const appCtx = useApp();
  const user_id = authCtx.userId;
  const app_name = process.env.app_name || '';
  const url = process.env.NEXT_PUBLIC_API_URL || '';

  const [transactionData, setTransactionData] = useState<TransactionData>({
    debt_total_balance: 0,
    month_debt_free: '',
    financial_frdom_date: '',
    financial_frdom_target: 0,
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
  }, [fetchTransactionData, appCtx.debtsAccountsScreen]);

  const InfoBox: React.FC<{ icon?: React.FC<{ width:number; height:number; className: string }>; title: string; value: string | number; isCurrency?: boolean; iconWidth?: number;
  iconHeight?: number;
  iconClassName?: string; }> = ({
    icon: Icon,
    title,
    value,
    isCurrency = false,
    iconWidth = 40,
    iconHeight = 40,
    iconClassName = 'text-white',
  }) => (
    <div className="flex items-center space-x-4">
      {Icon ? (
        <Icon width={iconWidth} height={iconHeight} className={iconClassName} />
      ) : (
        <div style={{ width: iconWidth, height: iconHeight }}></div>
      )}
      <div className="flex flex-col gap-1">
        <span className="text-[14px] text-white lg:text-[16px] font-semibold">{title}</span>
        <span className="text-[17px] text-[#C1FF72] lg:text-[25px] font-bold">
          {isCurrency && '$'}
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#43ACD6]">
      <div className="flex items-center justify-between py-1 px-4 md:px-6 lg:min-h-[100px]">
        {/* Sidebar Toggle & Logo */}
        <div className="items-center gap-4 sm:hidden lg:hidden md:hidden">
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded border bg-white dark:bg-gray-800"
          >
            <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Image src={LogoIcon} alt={app_name} height={50} />
          </Link>
        </div>

        {/* Info Section */}
        <div className="flex justify-between w-full max-w-8xl mx-auto">
          <div className="flex  items-start gap-4">
            <InfoBox
              icon={ArrowGraph}
              title="DEBT BALANCE"
              value={Intl.NumberFormat('en-US').format(transactionData.debt_total_balance)}
              isCurrency
              
              iconHeight={90}
            />
            <InfoBox title="DEBT FREE DATE" value={transactionData.month_debt_free}
            iconWidth={0}
            iconHeight={90}
            />
          </div>
          <div className="flex items-end gap-4 relative left-13">
            <InfoBox
              icon={CoinSvg}
              title="FINANCIAL FREEDOM DATE"
              value={transactionData.financial_frdom_date}

              
              iconHeight={80}
            />
            <InfoBox
              title="FINANCIAL FREEDOM TARGET"
              value={transactionData.financial_frdom_target > 0 ? Intl.NumberFormat('en-US').format(transactionData.financial_frdom_target):transactionData.financial_frdom_target}
              isCurrency={transactionData.financial_frdom_target > 0}

              iconWidth={0}
                iconHeight={80}
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center">
          <span className="text-white font-bold mr-4">{authCtx.activeMobileNumber}</span>
          {authCtx.isLoggedIn && <DropdownUser />}
        </div>
      </div>
    </header>
  );
};

export default Header;
