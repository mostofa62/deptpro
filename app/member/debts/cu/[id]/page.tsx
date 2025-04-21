"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

import TabView from "@/app/components/ui/TabView";

import CurrentDebtDashboard from "./CurrentDebtDashboard";
import DebtTransactions from "./DebtTransactions";
import DebtAccountUpdate from "./DebtAccountUpdate";
import DebtEntry from "./DebtEntry";
import DebtAmortization from "./DebtAmortization";
import HolderOne from "@/app/layout/HolderOne";
import AddPlus from "@/app/images/icon/add-plus";
import DashGrid from "@/app/images/icon/dash-grid";
import Setting from "@/app/images/icon/setting";

interface Tab {
  label: string;
  content: React.ReactNode;
}

const url = process.env.NEXT_PUBLIC_API_URL;
export default function InsuranceCreate({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authCtx = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);

  const id = params.id;
  const user_id: any = authCtx.userId;
  const admin_id: any = authCtx.adminId;

  const [currentDate, setCurrentDate] = useState<string>("");

  const [transactioData, setTransactionData] = useState({
    transactionType: [],
    transactionMonth: [],
    transactionYear: [],
  });

  const fetchDataCallback = useCallback(async () => {
    //console.log(id);
    const response = await axios.get(`${url}debt-transaction-dropdownpg`);
    //return response.data.user;
    setTransactionData({
      transactionType: response.data.transaction_type,
      transactionMonth: response.data.transaction_month,
      transactionYear: response.data.transaction_year,
    });
  }, []);
  useEffect(() => {
    fetchDataCallback();

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  }, [fetchDataCallback]);

  const tabs: Tab[] = [
    {
      label: "Settings and Info",
      content: (
        <DebtAccountUpdate
          user_id={user_id}
          admin_id={admin_id}
          debt_acc_id={id}
          tab_number={activeTab}
        />
      ),
    },

    {
      label: "Transaction History",
      content: (
        <DebtTransactions
          user_id={user_id}
          debt_acc_id={id}
          tab_number={activeTab}
          //onPayment={onPaymentHandler}
          //onEdit={onEditHandler}
        />
      ),
    },
    {
      label: "Amortization",
      content: (
        <DebtAmortization
          user_id={user_id}
          debt_acc_id={id}
          tab_number={activeTab}
          //onPayment={onPaymentHandler}
          //onEdit={onEditHandler}
        />
      ),
    },
  ];

  return (
    <>
      <DefaultLayout>
        <HolderOne
          title="update debt"
          linkItems={[
            {
              link: "/member/debts/cu",
              title: "add debt",
              icon: <AddPlus width={14} height={14} />,
            },
            {
              link: "/member/debts",
              title: "your debt dashboard",
              icon: <DashGrid width={16} height={16} />,
            },
            {
              link: "/member/debts/settings",
              title: "set debt budget",
              icon: <Setting width={15} height={15} />,
            },
          ]}
        />

        <div className="flex flex-col  md:grid lmd:flex-row md:grid-cols-3 gap-1 mt-4">
          <div className="w-full">
            <div className="grid grid-row">
              <div className="w-full">
                <CurrentDebtDashboard dept_acc_id={id} user_id={user_id} />
              </div>

              <div className="w-full mt-2 lmd:mt-4 md:mt-8">
                <DebtEntry
                  debt_acc_id={id}
                  user_id={user_id}
                  transaction_data={transactioData}
                  currentDate={currentDate}
                />
              </div>

              {/*transactionData.id !='' && prevTransId==transactionData.id &&
                <div className="w-full mt-8">
                  <BillPayment 
                  trans_id={transactionData.id} 
                  amount={transactionData.amount} 
                  pay_date={transactionData.due_date}
                  cleanData={cleanData}
                  />
                </div>
                */}
            </div>
          </div>
          <div className="w-full md:col-span-2">
            {
              <TabView
                tabs={tabs}
                onChageTab={(index) => {
                  setActiveTab(index);
                }}
              />
            }
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
