import useApp from '@/app/hooks/useApp';
import useAuth from '@/app/hooks/useAuth';
import CoinSvg from '@/app/images/icon/coin';
import GoldBarTick from '@/app/images/icon/goldbartick';
import Logo from '@/app/images/logo/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DropdownUser from './DropdownUser';
import InfoBox from './InfoBox';

type TransactionData = {
  debt_total_balance: number;
  month_debt_free: string;
  financial_frdom_date: string;
  financial_frdom_target: number;
};

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  transactionData:TransactionData
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, transactionData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const authCtx = useAuth();
  const appCtx = useApp();
  let Loguser:any = authCtx.role;
  const user_id = authCtx.userId;
  const app_name = process.env.app_name || '';
  const url = process.env.NEXT_PUBLIC_API_URL || '';
  
  

  

  return (
    <header className="sticky top-0 z-50 md:bg-[#43ACD6] bg-white shadow-2">
      <div className="flex items-center  justify-between py-1 px-4 md:px-6 lg:min-h-[100px]">
        {/* Sidebar Toggle & Logo */}
        <div className="flex items-center justify-center md:items-start lg:hidden xl:hidden">
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded border border-[#43ACD6] bg-white dark:bg-gray-800"
          >
            <span className="block w-6 h-0.5 bg-[#f09a25] dark:bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-[#f09a25] dark:bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-[#f09a25] dark:bg-white"></span>
          </button>
          {/* <Link href="/dashboard" className="rounded-lg mt-5 flex items-center justify-center p-2 bg-white">
            <Image src={LogoIcon} alt={app_name} height={80} />
          </Link> */}
        </div>

        <div className='flex w-full h-15 items-center justify-center md:hidden sm:hidden lg:hidden xl:hidden'>
          <Link href={(Loguser && parseInt(Loguser) < 10 )?'/admin/dashboard':'/member/dashboard'}>
          <Image src={Logo} alt={app_name} className="" height={50}  />
          </Link>
        </div>

        {/* Info Section */}
        <div className="hidden md:px-5 md:flex flex-col md:flex-row md:justify-between w-full md:max-w-8xl md:mx-auto">
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-4">
            <InfoBox
              icon={GoldBarTick}
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
          <div className="flex flex-col items-center md:flex-row md:items-end md:gap-4 md:relative md:left-13">
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
        <div className="hidden lg:flex md:items-center">
          
          {authCtx.isLoggedIn && <DropdownUser />}
        </div>
      </div>
    </header>
  );
};

export default Header;
