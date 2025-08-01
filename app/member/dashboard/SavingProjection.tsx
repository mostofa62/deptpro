import CardHolder from "@/app/components/ui/CardHolder";
import {
  formatLargeNumber,
  generateUniqueColors,
  hashString,
  hslToHex,
} from "@/app/components/utils/Util";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";
import { useState } from "react";
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
  userid: number;
}

interface Entry {
  dataKey: string;
  value: number;
  stroke: string;
}

const SavingProjection = ({ userid }: TotalProps) => {
  const [highlightedKey, setHighlightedKey] = useState(null);

  const handleLegendMouseEnter = (key: any, event: any) => {
    //alert('o')
    setHighlightedKey(key);
  };

  const handleLegendMouseLeave = () => {
    setHighlightedKey(null);
  };

  const payloadFuture: FuturePayLoad = {
    projection_list: [],
    saving_account_names: {},
  };

  const SavingFuture: any = useFetchDropDownObjects({
    urlSuffix: `saving-contributions-nextpgu/${userid}`,
    payLoads: payloadFuture,
  });

  const lineData = SavingFuture.projection_list;

  const saving_account_names = SavingFuture.saving_account_names;

  

  const getColorForDebtType = (key: string) => {
    const hue = Math.abs(hashString(key)) % 360;
    return hslToHex(hue, 70, 50);
  };

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
  const [maxHeight, setMaxHeight] = useState<number>(450);

  let uniquecolors_savings: any = [];
  if (lineData.length > 0 && lineData[0]) {
    const savings_ids = Object.keys(lineData[0]).map((item: any) => item);

    uniquecolors_savings = generateUniqueColors(savings_ids);
  }

  return (
    <>
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
                    .filter((key) => key !== "month_word" && 
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
    </>
  );
};

export default SavingProjection;
