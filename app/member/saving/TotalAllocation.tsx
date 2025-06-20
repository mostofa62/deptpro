import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import {
  formatLargeNumber,
  generateUniqueColors,
} from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

interface PayLoads {
  category_type_counts: {
    _id: string;
    count: number;
    label: string;
    balance: number;
  }[];
  total_saving_source_type: number;
  total_balance: number;
  bill_type_ammortization: any[];
  category_type_names: { [key: string]: string };
  year_month_wise_counts: {
    total_balance: number;
    year_month: string;
    year_month_word: string;
  }[];
  year_month_wise_balance: number;
}

interface SavingPayload {
  year_month_wise_counts: {
    total_balance: number;
    total_contribution: number;
    year_month_word: string;
  }[];
}

interface FuturePayLoad {
  projection_list: {
    //total_balance: number;
    //contribution: number;
    data: {
      [key: string]: {
        balance: number;
        total_contribution: number;
        period: number;
        total_interest: number;
        total_period_contribution: number;
        total_boosts: number;
      };
    };
    month: string;
    month_word: string;
  }[];
  saving_account_names: { [key: string]: string };
}

interface TotalProps {
  userid: string;
}

interface Entry {
  dataKey: string;
  value: number;
  stroke: string;
}

// const SavingLineLabel: Record<string, string> = {
//   total_balance: "Total Balance",
// };

const TotalAllocation = ({ userid }: TotalProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });
  const [highlightedKey, setHighlightedKey] = useState(null);

  const handleLegendMouseEnter = (key: any, event: any) => {
    //alert('o')
    setHighlightedKey(key);
  };

  const handleLegendMouseLeave = () => {
    setHighlightedKey(null);
  };

  const payload: PayLoads = {
    category_type_counts: [],
    total_saving_source_type: 0,
    total_balance: 0,
    bill_type_ammortization: [],
    category_type_names: {},
    year_month_wise_counts: [],
    year_month_wise_balance: 0,
  };

  const payloadSaving: SavingPayload = {
    year_month_wise_counts: [],
  };

  const payloadFuture: FuturePayLoad = {
    projection_list: [],
    saving_account_names: {},
  };

  const SavingTypewiseInfo: any = useFetchDropDownObjects({
    urlSuffix: `saving-typewise-infopg/${userid}`,
    payLoads: payload,
  });

  const SavingContributions: any = useFetchDropDownObjects({
    urlSuffix: `saving-contributions-previouspgu/${userid}`,
    payLoads: payloadSaving,
  });

  const SavingFuture: any = useFetchDropDownObjects({
    urlSuffix: `saving-contributions-nextpgu/${userid}`,
    payLoads: payloadFuture,
  });

  const total_balance = SavingTypewiseInfo.total_balance;

  const data = SavingTypewiseInfo.category_type_counts;

  const barData = SavingContributions.year_month_wise_counts;

  const lineData = SavingFuture.projection_list;

  const saving_account_names = SavingFuture.saving_account_names;

  const maxProgressLength = Math.max(
    ...data.map((d: any) =>
      d.count.toString().length > 4 ? d.count.toString().length : 4
    )
  );
  const maxAmountLength = Math.max(
    ...data.map((d: any) =>
      d.balance.toString().length > 4 ? d.balance.toString().length : 4
    )
  );
  //console.log(minValue, maxValue, maxProgressLength)

  const dataLabel = {
    total_balance: "Total Balances",
    contribution: "Contribution",
  };

  const CustomTooltipLine = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;
    return (
      <div className="bg-white border p-2 rounded shadow-lg text-sm">
        <div>
          <strong>Month:</strong> {label}
        </div>

        {payload.map((entry: Entry, index: number) => {
          const label = saving_account_names?.[entry.dataKey as string]; /*||
            SavingLineLabel?.[entry.dataKey as string]*/

          //console.log("entry", entry);

          if (!entry.dataKey || !label) return null;

          const styles = /*SavingLineLabel?.[entry.dataKey as string]
            ? {
                color: entry.stroke,
                border: `1px solid ${entry.stroke}`,
                padding: "2px",
              }
            :*/ { color: entry.stroke };

          return (
            <div key={`item-${index}`} style={styles}>
              <strong>{label}:</strong> $
              {Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(entry.value)}
            </div>
          );
        })}
      </div>
    );
  };

  // Legend formatter function
  const CustomLegendLine = ({ payload }: any) => {
    return (
      <div className="flex gap-4 justify-center items-center text-sm">
        {payload.map((entry: any, index: number) => (
          <span
            onMouseEnter={(event) => handleLegendMouseEnter(entry.value, event)}
            onMouseLeave={handleLegendMouseLeave}
            className="font-semibold"
            key={`legend-item-${index}`}
            style={{ color: entry.color }}
          >
            {
              saving_account_names && saving_account_names[entry.value] /*||
              SavingLineLabel[entry.value]*/
            }
          </span>
        ))}
      </div>
    );
  };

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    // Calculate the height of the tallest element after component renders
    const total_length: number = data.length + barData.length + lineData.length;
    if (total_length > 0) {
      const heights = itemRefs.current.map(
        (item) => item?.getBoundingClientRect().height || 0
      );
      const tallestHeight = Math.max(...heights);
      if (total_length > 0 && tallestHeight < 350) {
        setMaxHeight(380);
      } else {
        setMaxHeight(tallestHeight);
      }
    }
  }, [data, barData, lineData]);

  const ids = data.map((item: any) => item._id);

  const uniquecolors = generateUniqueColors(ids);

  //const idsline = lineData.map((item: any) => item._id);

  let uniquecolors_savings: any = [];
  if (lineData.length > 0 && lineData[0]) {
    const savings_ids = Object.keys(lineData[0]).map((item: any) => item);

    uniquecolors_savings = generateUniqueColors(savings_ids);
  }

  // const uniquecolorsLine = generateUniqueColors(idsline);

  return (
    <div className="flex flex-col py-2 lg:flex-row gap-2.5">
      <div
        className={
          isTab && !isMobile
            ? `flex flex-row gap-2`
            : `flex flex-col gap-2.5 lg:flex-row lg:w-[60%] lg:gap-2.5`
        }
      >
        <div
          className="w-full md:w-[45%]"
          ref={(el) => (itemRefs.current[0] = el)}
          style={{ height: maxHeight ? `${maxHeight}px` : "auto" }}
        >
          {data.length > 0 && (
            <CardHolder title="Total Allocation" maxHeight={maxHeight}>
              <div className="flex flex-row">
                <div className="w-full">
                  <div className="ml-[5px]">
                    {data.map((dp: any, i: number) => {
                      return (
                        <>
                          <DataProgress
                            key={dp._id}
                            title={dp.name}
                            progress={(
                              (100 / total_balance) *
                              dp.balance
                            ).toFixed(0)}
                            color={uniquecolors[dp._id]}
                            maxProgressLength={maxProgressLength}
                            amount={dp.balance}
                            maxAmountLength={maxAmountLength}
                          />
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardHolder>
          )}
        </div>
        <div
          className="w-full md:w-[55%]"
          ref={(el) => (itemRefs.current[1] = el)}
          style={{ height: maxHeight ? `${maxHeight}px` : "auto" }}
        >
          {barData.length > 0 && (
            <CardHolder title={`12 months history`} maxHeight={maxHeight}>
              <div className="flex flex-col justify-center items-center">
                <RechartHorizentalBar
                  barData={barData}
                  axisData={{ XAxis: { dataKey: "year_month_word" } }}
                  bar={{ dataKey: "total_balance" }}
                />
              </div>
            </CardHolder>
          )}
        </div>
      </div>
      <div
        className="w-full lg:w-[40%]"
        ref={(el) => (itemRefs.current[2] = el)}
        style={{ height: maxHeight ? `${maxHeight}px` : "auto" }}
      >
        {lineData.length > 0 && (
          <CardHolder title="Savings Goal Projection" maxHeight={maxHeight}>
            <div className="w-full overflow-x-auto">
              <div className={`w-[${lineData.length * 100}px]`}>
                {" "}
                {/* Dynamically adjust width */}
                <ResponsiveContainer
                  width="100%"
                  height={maxHeight >= 350 ? maxHeight - 80 : maxHeight}
                >
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month_word" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${formatLargeNumber(value)}`}
                    />
                    {/* <Tooltip content={<CustomTooltipLine />} /> */}
                    <Tooltip content={<CustomTooltipLine />} />
                    <Legend content={<CustomLegendLine />} />

                    {/* Render Line components for each unique dataKey (e.g., BB, TEACHER_FEE, etc.) */}
                    {Object.keys(lineData[0])
                      .filter(
                        (key) =>
                          key !== "month_word" &&
                          key !== "month" &&
                          key !== "total_balance"
                      )
                      .map((key, index) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          dot={false}
                          strokeWidth={
                            highlightedKey != null && highlightedKey === key
                              ? 3
                              : 1
                          }
                          stroke={uniquecolors_savings[key]} // Ensure this function is defined elsewhere
                          activeDot={{ r: 5 }}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardHolder>
        )}
      </div>
    </div>
  );
};

export default TotalAllocation;
