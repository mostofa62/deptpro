import CardHolderTiny from "@/app/components/ui/CardHolderTiny";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatLargeNumber } from "@/app/components/utils/Util";
const url = process.env.NEXT_PUBLIC_API_URL;
const HeaderSummary = () => {
  const authCtx = useAuth();
  const user_id = authCtx.userId;

  const [transactioData, setTransactionData] = useState({
    saving_progress: 0,
    total_paid_off: 0,
    snowball_amount: 0,
    monthly_budget: 0,
    total_monthly_minimum: 0,
    total_monthly_bill_expese: 0,
    total_monthly_net_income: 0,
    debt_total_balance: 0,
    active_debt_account: 0,
  });

  const fetchDataCallback = useCallback(async () => {
    //console.log(id);
    const response = await axios.get(`${url}header-summary-data/${user_id}`);
    //return response.data.user;
    setTransactionData({ ...transactioData, ...response.data });
  }, [user_id]);
  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const transactioDataLabel = {
    saving_progress: {
      label: "Saving Progress",
      prefix: "",
      suffix: "%",
      href: "",
    },
    total_paid_off: {
      label: "debt payoff progress",
      prefix: "",
      suffix: "%",
      href: "",
    },
    snowball_amount: {
      label: "monthly + cashflow",
      prefix: "$",
      suffix: "",
      href: "",
    },
    monthly_budget: {
      label: "monthly debt budget",
      prefix: "$",
      suffix: "",
      href: "",
    },
    total_monthly_minimum: {
      label: "minimum payments",
      prefix: "$",
      suffix: "",
      href: "",
    },
    total_monthly_bill_expese: {
      label: "monthly bill totals",
      prefix: "$",
      suffix: "",
      href: "",
    },
    total_monthly_net_income: {
      label: "monthly net income",
      prefix: "$",
      suffix: "",
      href: "",
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
    <div className="flex flex-row-reverse gap-1">
      {Object.keys(transactioDataLabel).map((data: string, index: number) => {
        const prefix: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].prefix;
        const suffix: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].suffix;
        const link: string =
          transactioDataLabel[data as keyof typeof transactioDataLabel].href;
        const amount: number =
          transactioData[data as keyof typeof transactioDataLabel];
        const amountstring =
          prefix == "$" ? formatLargeNumber(amount) : amount.toFixed(0);
        return (
          <div key={index} className="flex-1">
            <CardHolderTiny>
              <div
                ref={(el) => (itemRefs.current[index] = el)}
                style={{ height: maxHeight ? `${maxHeight}px` : "auto" }}
                className="flex flex-col justify-center items-center gap-2"
              >
                <div
                  ref={(el) => (childRefs.current[index] = el)}
                  style={{
                    height: maxChildHeight ? `${maxChildHeight}px` : "auto",
                  }}
                  className="bg-[#f09a25] border-[#595959] border-2 w-full text-center text-white"
                >
                  <p className="font-semibold capitalize md:text-sm lg:text-[16px] lg:py-1">
                    {
                      transactioDataLabel[
                        data as keyof typeof transactioDataLabel
                      ].label
                    }
                  </p>
                </div>
                <div className="text-[#47E535]">
                  <Link
                    className="font-semibold lg:text-[25px] drop-shadow-custom"
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
