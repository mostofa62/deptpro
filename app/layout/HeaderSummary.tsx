import CardHolderTiny from "@/app/components/ui/CardHolderTiny";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
const url = process.env.NEXT_PUBLIC_API_URL;
interface HSPRops{
  saving_progress: number;
    total_paid_off: number;
    snowball_amount: number;
    monthly_budget: number;
    total_monthly_minimum: number;
    total_monthly_bill_expese: number;
    total_monthly_net_income: number;
    debt_total_balance:number;
    active_debt_account: number;
}

interface TransactionProps{
  transactionData:HSPRops
}

const HeaderSummary = ({transactionData}:TransactionProps) => {

  const isMobile = useMediaQuery({ maxWidth: 768 });  
  const isTab = useMediaQuery({ maxWidth: 900 });  
  const authCtx = useAuth();
  const user_id = authCtx.userId;

  

  const transactioDataLabel = {
    saving_progress: {
      label: "Saving Progress",
      prefix: "",
      suffix: "%",
      href: "/member/saving",
    },
    total_paid_off: {
      label: "debt payoff progress",
      prefix: "",
      suffix: "%",
      href: "/member/debts",
    },
    snowball_amount: {
      label: "monthly + cashflow",
      prefix: "$",
      suffix: "",
      href: "/member/income",
    },
    monthly_budget: {
      label: "monthly debt budget",
      prefix: "$",
      suffix: "",
      href: "/member/debts/settings",
    },
    total_monthly_minimum: {
      label: "minimum payments",
      prefix: "$",
      suffix: "",
      href: "/member/debts",
    },
    total_monthly_bill_expese: {
      label: "monthly bill totals",
      prefix: "$",
      suffix: "",
      href: "/member/bills",
    },
    total_monthly_net_income: {
      label: "monthly net income",
      prefix: "$",
      suffix: "",
      href: "/member/income",
    },
  };

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  const childRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxChildHeight, setMaxChildHeight] = useState<number>(0);
  

  useEffect(() => {
    // Calculate the height of the tallest element after component renders
    const heights = itemRefs.current.map(
      (item) => item?.getBoundingClientRect().height || 0
    );
    const tallestHeight = Math.max(...heights);
    setMaxHeight(tallestHeight);
    const childHeights = childRefs.current.map(
      (child) => child?.getBoundingClientRect().height || 0
    );
    const tallestChildHeight = Math.max(...childHeights);
    setMaxChildHeight(tallestChildHeight);
  }, []); // Empty dependency array ensures it runs once after mount

  return (
    <div className="grid grid-cols-2 gap-2 lg:flex flex-row-reverse md:gap-1">
      {Object.keys(transactioDataLabel).map((data: string, index: number) => {
        const prefix: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].prefix;
        const suffix: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].suffix;
        const link: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].href;
        const amount: number =
        transactionData[data as keyof typeof transactioDataLabel];
        // const amountstring =
        //   prefix == "$" ? formatLargeNumber(amount) : amount.toFixed(0);
        const amountstring = amount.toFixed(0);
        return (
          <div key={index} className="flex-1">
            <CardHolderTiny>
              <div
                ref={(el) => (itemRefs.current[index] = el)}
                style={{ height:isMobile ? '50px': maxHeight ? `${maxHeight}px` : "auto" }}
                className="flex flex-col justify-center items-center gap-2"
              >
                <div
                  ref={(el) => (childRefs.current[index] = el)}
                  style={{
                    height:isMobile? '25px':!isMobile && isTab?'40px': maxChildHeight ? `${maxChildHeight}px` : "auto",
                  }}
                  className={`bg-[#f09a25] shadow-custom flex items-center justify-center w-full md:text-center text-white`}
                >
                  <p className="font-semibold capitalize  md:text-md lg:text-[16px] lg:py-1">
                    {
                      transactioDataLabel[
                        data as keyof typeof transactioDataLabel
                      ].label
                    }
                  </p>
                </div>
                <div className="text-[#47E535]">
                  <Link
                    className="font-semibold text-[20px] lg:text-[25px]"
                    href={link}
                  >
                    {prefix != "" && prefix}
                    {amountstring}
                    {suffix != "" && suffix}
                  </Link>
                </div>
              </div>
            </CardHolderTiny>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderSummary;
