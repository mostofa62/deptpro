import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import TooltipOne from "@/app/components/ui/TooltipOne";
import { formatLargeNumber } from "@/app/components/utils/Util";

const CreditCardCalculator = () => {
  // State to manage inputs
  const [balance, setBalance] = useState<number>(5000); // Example initial balance
  const [dueDate, setDueDate] = useState<Date | null>(
    moment().add(1, "months").toDate()
  );
  const [apr, setApr] = useState<number>(18.99);
  const [repaymentType, setRepaymentType] = useState<number>(1); // 1: Minimum Payment, 2: Fixed Payment
  const [fixedPayment, setFixedPayment] = useState<number | null>(null); // For Fixed Payment input

  // State to manage the calculated data
  const [projectedData, setProjectedData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  const [minPayment, setminPayment] = useState<string>("");
  const [principalBalance, setprincipalBalance] = useState<string>("");
  const [interestPaid, setinterestPaid] = useState<string>("");
  const [totalPaidAmount, settotalPaidAmount] = useState<string>("");

  // Formatter for currency
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    [] // Empty dependency array ensures this is only created once
  );

  // Calculate the payments based on the logic provided
  const handleCalculate = useCallback(() => {
    const balanceInput = balance;
    const aprInput = apr / 100;
    const monthlyRate = aprInput / 12;
    const paymentType = repaymentType;
    const fixedPaymentAmount = fixedPayment;
    const startDate = new Date(dueDate!); // Start from the actual due date

    let currentBalance = balanceInput;
    let totalInterest = 0;
    let totalPaid = 0;
    let month = 0;
    const payments: any[] = [];
    const graph: any[] = [];

    while (currentBalance > 1 && month < 360) {
      // Limit to 30 years max
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + month); // Increment by the month count from the due date

      const interest = currentBalance * monthlyRate;

      // Minimum payment calculation
      let minPayment = Math.max(
        Math.min(currentBalance * 0.01 + interest, currentBalance + interest),
        25
      );
      let payment: number;

      // Apply Fixed Payment or Minimum Payment logic
      if (paymentType === 1) {
        payment = minPayment; // For minimum payment type
      } else {
        payment = Math.min(fixedPaymentAmount!, currentBalance + interest); // For fixed payment type
      }

      // Principal paid is the total payment minus the interest
      const principal = payment - interest;
      currentBalance -= principal;
      totalInterest += interest;
      totalPaid += payment;

      // Save the monthly data for the table
      payments.push({
        month: moment(currentDate).format("MMM YYYY"), // Format as "Jan 2025"
        minPayment: minPayment.toFixed(2),
        payment: payment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        remainingBalance: currentBalance.toFixed(2),
      });

      // Save the monthly data for the graph
      graph.push({
        month: moment(currentDate).format("MMM YYYY"), // Format as "Jan 2025"
        balance: currentBalance,
        paymentAmount: payment,
        cumulativeInterest: totalInterest,
      });

      month++;
    }

    setProjectedData(payments);
    setGraphData(graph);

    // Update the summary boxes with values
    setminPayment(formatter.format(payments[0].payment));
    setprincipalBalance(formatter.format(balanceInput));
    setinterestPaid(formatter.format(totalInterest));
    settotalPaidAmount(formatter.format(totalPaid));
  }, [apr, balance, dueDate, fixedPayment, formatter, repaymentType]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white p-8 rounded-md shadow-md w-full border flex flex-col gap-2">
      <h1 className="text-center text-[#42acd8] font-semibold text-2xl mb-1 flex gap-2 items-center justify-center">
        Mortgage & Loan Amortization Calculator
      </h1>

      <p className="flex gap-2 items-center justify-center">
        <span>Credit Card Payment Calculator</span>
        <span>
          <TooltipOne
            text={
              <div className="flex flex-col gap-1 items-start justify-center">
                <p className="whitespace-normal leading-normal">
                  Disclosure: This is an estimate only as terms will vary.
                </p>
                <p className="whitespace-normal leading-normal">
                  IE: Vendors can have different types of APR interest, how they
                  are applied, penalties, fees, balance variations, minimum
                  payment requirments, credit ratings etc.
                </p>
                <p className="whitespace-normal leading-normal">
                  Please contact your credit card company for any questions you
                  may have.
                </p>
              </div>
            }
          />
        </span>
      </p>

      {/* Input fields */}

      <div className="flex flex-col gap-2">
        <label htmlFor="balance">Credit Card Balance ($)</label>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(parseFloat(e.target.value))}
          className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none p-2"
          placeholder="Enter credit card balance"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="dueDate">Due Date</label>
        <DatePicker
          selected={dueDate}
          onChange={(date: Date) => setDueDate(date)}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none p-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="apr">APR (%)</label>
        <input
          type="number"
          value={apr}
          onChange={(e) => setApr(parseFloat(e.target.value))}
          className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none p-2"
          placeholder="Enter APR"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="repaymentType">Repayment Type</label>
        <select
          value={repaymentType}
          onChange={(e) => setRepaymentType(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none p-2"
        >
          <option value={1}>Minimum Payment Only</option>
          <option value={2}>Fixed Payment</option>
        </select>
      </div>

      {repaymentType === 2 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="fixedPayment">Fixed Payment ($)</label>
          <input
            type="number"
            value={fixedPayment || ""}
            onChange={(e) => setFixedPayment(parseFloat(e.target.value))}
            className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
            placeholder="Enter fixed payment"
          />
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center items-center mt-5">
        <button
          onClick={handleCalculate}
          className="bg-[#42acd8] text-white py-2 px-6 rounded-md text-center"
        >
          Calculate
        </button>
      </div>

      {/* Summary Boxes */}
      <div className="my-6 flex flex-col gap-4 text-white">
        <div className="flex gap-4">
          <div className="w-[32%] bg-[#42acd8] flex flex-col items-center p-4 border rounded">
            <h3 className="text-lg font-semibold">Minimum Payment</h3>
            <span className="text-2xl font-bold">{minPayment}</span>
          </div>
          <div className="w-[32%] bg-[#ff9f00] flex flex-col items-center p-4 border rounded">
            <h3 className="text-lg font-semibold">Principal Balance</h3>
            <span className="text-2xl font-bold">{principalBalance}</span>
          </div>

          <div className="w-[32%] bg-[#31c4a2] flex flex-col items-center p-4 border rounded">
            <h3 className="text-lg font-semibold">Interest Paid</h3>
            <span className="text-2xl font-bold">{interestPaid}</span>
          </div>
        </div>
        <div className="bg-[#a777e3] flex flex-col items-center p-4 border rounded col-span-2">
          <h3 className="text-lg font-semibold">Total Paid</h3>
          <span className="text-2xl font-bold">{totalPaidAmount}</span>
        </div>
      </div>

      {/* Graph */}
      {graphData.length > 0 && (
        <div className="my-6">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tick={{ fontSize: 15 }}
                tickFormatter={(value) => `$${formatLargeNumber(value)}`}
              />
              <Tooltip
                formatter={(value) =>
                  `$${Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(value.toLocaleString()))}`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                name="Balance"
              />
              <Line
                type="monotone"
                dataKey="paymentAmount"
                stroke="#82ca9d"
                name="Payment Amount"
              />
              <Line
                type="monotone"
                dataKey="cumulativeInterest"
                stroke="#ff7300"
                name="Cumulative Interest"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Projected Data Table */}
      {projectedData.length > 0 && (
        <table className="table-auto border-collapse border border-[#ddd] rounded-lgw-full mt-4">
          <thead className="bg-[#f2f2f2]">
            <tr className="border border-[#ddd] text-left">
              <th className="px-4 py-2 border border-[#ddd]">Month</th>
              <th className="px-4 py-2 border border-[#ddd]">Min Payment</th>
              <th className="px-4 py-2 border border-[#ddd]">Payment</th>
              <th className="px-4 py-2 border border-[#ddd]">Principal</th>
              <th className="px-4 py-2 border border-[#ddd]">Interest</th>
              <th className="px-4 py-2 border border-[#ddd]">
                Remaining Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {projectedData.map((data, index) => (
              <tr
                key={index}
                className="text-left"
                style={{
                  backgroundColor: index % 2 == 0 ? "#f9f9f9" : "#fffff",
                }}
              >
                <td className="px-4 py-2 border border-[#ddd]">{data.month}</td>
                <td className="px-4 py-2 border border-[#ddd]">
                  $
                  {Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(data.minPayment)}
                </td>
                <td className="px-4 py-2 border border-[#ddd]">
                  $
                  {Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(data.payment)}
                </td>
                <td className="px-4 py-2 border border-[#ddd]">
                  $
                  {Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(data.principal)}
                </td>
                <td className="px-4 py-2 border border-[#ddd]">
                  $
                  {Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(data.interest)}
                </td>
                <td className="px-4 py-2 border border-[#ddd]">
                  $
                  {Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(data.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreditCardCalculator;
