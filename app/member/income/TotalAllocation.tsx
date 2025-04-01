import HorizontalBarChartWithLabels from "@/app/components/chart/HorizontalBarChartWithLabels";
import RechartHorizentalBar from "@/app/components/chart/RechartHorizentalBar";
import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import {
  formatLargeNumber,
  generateUniqueColors,
  hashString,
  hslToHex,
} from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  index,
  total_count,
  total_balance,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={percent < 0.1 ? 11 : 14}
    >
      {/*`${(percent * 100).toFixed(0)}%`*/}
      {percent >= 0.02 ? `${((100 / total_balance) * value).toFixed(0)}%` : ""}
    </text>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  label,
  total_count,
  total_balance,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "3px",
          border: "1px solid #ccc",
        }}
      >
        <p className="text-lg">
          <span className=" font-semibold">{`${payload[0].name}`}</span> :{" "}
          <span className=" font-semibold">{`${Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(payload[0].value)}`}</span>{" "}
          in <span className=" font-semibold">{`${total_balance}`}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface PayLoads {
  income_source_type_counts: {
    id: number;
    count: number;
    name: string;
    balance: number;
  }[];
  total_income_source_type: number;
  total_balance: number;
  income_source_type_names: { [key: string]: string };
}

interface IncomePayload {
  year_month_wise_counts: {
    total_balance_net: number;
    total_balance_gross: number;
    year_month_word: string;
  }[];
}

interface FuturePayLoad {
  projection_list: {
    base_gross_income: number;
    base_net_income: number;
    month: string;
    month_word: string;
  }[];
}
interface TotalPros {
  userid: number;
}

const TotalAllocation = ({ userid }: TotalPros) => {
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
    income_source_type_counts: [],
    total_income_source_type: 0,
    total_balance: 0,
    income_source_type_names: {},
  };

  const payloadIncome: IncomePayload = {
    year_month_wise_counts: [],
  };

  const payloadFuture: FuturePayLoad = {
    projection_list: [],
  };

  const IncomeTypewiseInfo: any = useFetchDropDownObjects({
    urlSuffix: `income-typewise-infopg/${userid}`,
    payLoads: payload,
  });

  const IncomeTransaction: any = useFetchDropDownObjects({
    urlSuffix: `income-transactions-previouspgu/${userid}`,
    payLoads: payloadIncome,
  });

  const IncomeFuture: any = useFetchDropDownObjects({
    urlSuffix: `income-transactions-nextpgu/${userid}`,
    payLoads: payloadFuture,
  });

  const total_balance = IncomeTypewiseInfo.total_balance;

  const data = IncomeTypewiseInfo.income_source_type_counts;

  const barData = IncomeTransaction.year_month_wise_counts;

  const lineData = IncomeFuture.projection_list;

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

  const getColorForDebtType = (key: string) => {
    const hue = Math.abs(hashString(key)) % 360;
    return hslToHex(hue, 70, 50);
  };

  const dataLabel = {
    base_net_income: "Net Earnings",
    base_gross_income: "Gross Earnings",
    previous_net_history: "12 months net earning history",
  };

  const EarnerDataLabel = {
    earner: "Earner",
    gross_income: "Gross Earnings",
    net_income: "Net Earnings",
  };

  const CustomTooltipLine = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;
    // Find the 'earners' data for the current label
    const currentData = lineData.find((d: any) => d.month_word === label);
    const earners = currentData?.earners || [];

    let uniquecolors_incomes: any = [];
    if (earners.length > 0) {
      const income_ids = earners.map((item: any) => item.earner_id);

      //alert("income_ids" + income_ids);
      uniquecolors_incomes = generateUniqueColors(income_ids);
    }
    return (
      <div className="bg-white border p-2 rounded shadow-lg text-sm z-9999 max-h-screen">
        <div>
          <strong>Month:</strong> {label}
        </div>

        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ color: entry.stroke }}>
            <strong>
              {dataLabel[entry.dataKey as keyof typeof dataLabel]}:
            </strong>{" "}
            $
            {Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(entry.value)}
          </div>
        ))}

        {/* Display earners array as a list */}
        {earners.length > 0 && (
          <div className="mt-1">
            <div>
              <strong>Earners</strong>
            </div>
            <div className="overflow-x-scroll flex gap-1">
              {earners.map((earner: any, index: number) => (
                <div
                  className="border p-1 my-1"
                  key={`earner-${index}`}
                  style={{ color: uniquecolors_incomes[earner.earner_id] }}
                >
                  {/* Iterate over keys in the earner object */}
                  {Object.keys(earner)
                    .filter((key) => key !== "earner_id") // Filter out 'earner_id'
                    .map((key) => (
                      <div key={key}>
                        <strong>
                          {EarnerDataLabel[
                            key as keyof typeof EarnerDataLabel
                          ] || key}
                          :
                        </strong>
                        <span className="px-1">
                          {typeof earner[key] === "number"
                            ? `$${Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(earner[key])}`
                            : earner[key]}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
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
            {dataLabel[entry.dataKey as keyof typeof dataLabel]}
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
        setMaxHeight(400);
      } else {
        setMaxHeight(tallestHeight);
      }
    }
  }, [data, barData, lineData]); // Empty dependency array ensures it runs once after mount

  const ids = data.map((item: any) => item.id);

  const uniquecolors = generateUniqueColors(ids);

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
              <div className="ml-[5px]">
                {data.map((dp: any, i: number) => {
                  return (
                    <>
                      <DataProgress
                        key={dp.id}
                        title={dp.name}
                        progress={((100 / total_balance) * dp.balance).toFixed(
                          0
                        )}
                        color={uniquecolors[dp.id]}
                        maxProgressLength={maxProgressLength}
                        amount={dp.balance}
                        maxAmountLength={maxAmountLength}
                      />
                    </>
                  );
                })}
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
                {/*JSON.stringify(barData)*/}

                <RechartHorizentalBar
                  barData={barData}
                  axisData={{ XAxis: { dataKey: "year_month_word" } }}
                  bar={{ dataKey: "total_balance_net" }}
                />

                {/* <HorizontalBarChartWithLabels

  barData={barData}
  axisData={ 
    {YAxis:{dataKey:'year_month_word'}}
  }
  bar={
    {dataKey:'total_balance_net'}
  }

  /> */}

                {/* <div>
                    <p className={`capitalize pt-1 text-[13px] font-semibold text-[${getColorForDebtType(dataLabel.base_net_income)}]`}>
                      {dataLabel.previous_net_history}
                    </p>
                  </div> */}
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
          <CardHolder title="12 Months Projection" maxHeight={maxHeight}>
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
                          key != "earners"
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
                          stroke={getColorForDebtType(key)} // Ensure this function is defined elsewhere
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
