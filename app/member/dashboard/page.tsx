"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import Pie from "@/app/components/chart/Pie";

import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import {
  generateRandomColor,
  generateRandomMixedColor,
  getColorForValue,
  hashString,
  hslToHex,
} from "@/app/components/utils/Util";
import DebtToWealthScore from "./DebtToWealthScore";
import ProgressBarTwo from "@/app/components/ui/ProgressBarTwo";
import IncomeProjection from "./IncomeProjection";
import BillProjection from "./BillProjection";
import SavingProjection from "./SavingProjection";
import TreasureBox from "@/app/images/icon/treasurebox";

const url = process.env.NEXT_PUBLIC_API_URL;

const GaugeComponentF = dynamic(() => import("@/app/components/chart/Gauge"), {
  ssr: false,
});

const GaugeData = [
  {
    name: "Perfect",
    range: "0-30",
    color: "#009900",
  },
  {
    name: "Moderate",
    range: "30-50",
    color: "#47e535",
  },
  {
    name: "High",
    range: "50-70",
    color: "#ff9900",
  },

  {
    name: "Extreme",
    range: "70-100",
    color: "#EA4228",
  },
];

const getColorForDebtType = (key: string) => {
  const hue = Math.abs(hashString(key)) % 360;
  return hslToHex(hue, 70, 50);
};

//const ThermoMeterF = dynamic(()=>import('../components/chart/Thermometer'),{ssr:false});

//const ThermoMeterF = dynamic(() => import('../components/chart/ThermoMeter'), { ssr: false });
export default function DashBoard() {
  const authCtx = useAuth();
  const user_id: any = authCtx.userId;

  //Pusher.logToConsole = true;

  const [transactioData, setTransactionData] = useState({
    debt_list: [],
    debt_total_balance: 0,
    total_net_income: 0,
    saving_list: [],
    total_wealth: 0,
    total_saving:0,
    debt_to_wealth: 0,
    credit_ratio: 0,
    total_allocation_data: [],
  });

  const fetchDataCallback = useCallback(async () => {
    //console.log(id);
    const response = await axios.get(`${url}dashboard-data/${user_id}`);
    //return response.data.user;
    setTransactionData(response.data);
  }, [user_id]);
  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const maxProgressLength = Math.max(
    ...transactioData.debt_list.map((dp: any) => dp.progress.toString().length)
  );
  const minValue = Math.min(
    ...transactioData.debt_list.map((d: any) => d.progress)
  );
  const maxValue = Math.max(
    ...transactioData.debt_list.map((d: any) => d.progress)
  );
  const maxAmountLength = Math.max(
    ...transactioData.debt_list.map((d: any) =>
      d.amount.toString().length > 4 ? d.amount.toString().length : 4
    )
  );

  return (
    <>
      <DefaultLayout>
        <div className="grid grid-flow-row">
          <div className="mt-2">
            <CardHolder title="Main Dashboard">
              <div className="flex flex-row gap-4">
                <div className="w-[15%]">
                  <Image
                    src="/animated/maindashboard.gif"
                    width={200}
                    height={200}
                    alt="Focus"
                  />
                </div>

                <div className="w-[18%] flex items-center justify-center">
                  <ProgressBarTwo
                    progress={50}
                    amount={transactioData.total_net_income}
                    title={`monthly net income`}
                    progressColor={"#43acd6"}
                  />
                </div>

                <div className="w-[18%] ml-[1%] flex items-center justify-center">
                  <ProgressBarTwo
                    progress={20}
                    amount={transactioData.debt_total_balance}
                    title={`monthly debt`}
                    progressColor={"#FEC001"}
                  />
                </div>

                <div className="w-[18%] ml-[1%] flex items-center justify-center">
                  <ProgressBarTwo
                    progress={30}
                    amount={transactioData.total_wealth}
                    title={`monthly wealth`}
                    progressColor={"#fe992c"}
                  />
                </div>

                <div className="w-[18%] ml-[1%] flex items-center justify-center">
                  <ProgressBarTwo
                    progress={45}
                    amount={transactioData.total_saving}
                    title={`monthly saving`}
                    progressColor={"#C1FF72"}
                  />
                </div>

                <div className="w-[30%] ml-[1%] flex items-center justify-center">
                  {/* <DebtToWealthScore
                    title={`DEBT TO WEALTH SCORE`}
                    amount={transactioData.debt_to_wealth}
                  /> */}
                  <TreasureBox height={180} treasureValue={transactioData.debt_to_wealth} fontSize={50} color="#47E535"/>
                </div>
              </div>
            </CardHolder>
          </div>

          <div className="mt-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col h-full">
                <CardHolder title="Total Allocation">
                  <Pie data={transactioData.total_allocation_data} />
                </CardHolder>
              </div>
              <div className="flex flex-col h-full">
                <CardHolder title="Credit Utilization">
                  <div className="grid grid-cols-2">
                    {/* {transactioData.credit_ratio}                   */}
                    <div className="w-[100%] h-[100%]">
                      <GaugeComponentF
                        direction_value={transactioData.credit_ratio}
                        tick_values={[{ value: transactioData.credit_ratio }]}
                      />
                    </div>
                    <div className="w-[100%] ml-3">
                      <div className="flex flex-col justify-center items-center mt-6 gap-0.5">
                        {GaugeData.map((gdata, i) => {
                          return (
                            <div
                              key={i}
                              style={{ color: `${gdata.color}` }}
                              className={`flex gap-2 w-[90%] font-semibold text-[14px]`}
                            >
                              <span className="w-[40%] text-right">
                                {gdata.range}
                              </span>
                              <span className="w-[60%] text-left">
                                {gdata.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardHolder>
                <div></div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-row gap-2">
            <div className="w-[50%]">
              {transactioData.debt_list.length > 0 && (
                <CardHolder title="Debt Payoff Progress">
                  {transactioData.debt_list.map((dp: any, i: number) => {
                    return (
                      <>
                        <DataProgress
                          title={dp.title}
                          progress={dp.progress}
                          color={getColorForDebtType(dp._id)}
                          amount={dp.amount}
                          maxProgressLength={maxProgressLength}
                          maxAmountLength={maxAmountLength}
                        />
                      </>
                    );
                  })}
                </CardHolder>
              )}
            </div>

            <div className="w-[50%]">
              <IncomeProjection userid={user_id} />
            </div>
          </div>

          <div className="mt-3 flex flex-row gap-2">
            <div className="w-[50%]">
              {/*transactioData.saving_list.length > 0 &&
                    <CardHolder title="Saving Progress">
                    { transactioData.saving_list.map((dp:any,i:number)=>{              
                        
                        return (
                          <>
                          <DataProgress 
                          title={dp.title} 
                          progress={dp.progress}
                          color={getColorForDebtType(dp._id)}
                          amount={dp.amount}
                          maxProgressLength={maxProgressLength}
                          maxAmountLength={maxAmountLength}
                          />
                          </>
                        )

                      })


                      }

                    </CardHolder>
                    */}
              <SavingProjection userid={user_id} />
            </div>
            <div className="w-[50%]">
              <BillProjection userid={user_id} />
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
