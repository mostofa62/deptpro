import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import TooltipOne from "@/app/components/ui/TooltipOne";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import InputFieldNormal from "./InputFieldNormal";
import { formatLargeNumber } from "@/app/components/utils/Util";

type AmortizationEntry = {
  paymentNumber: number;
  paymentDate: string;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  remainingBalance: number;
  year: number;
  month: number;
};

type LoanState = {
  loanType: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  startDate: Date;
  amortizationSchedule: AmortizationEntry[];
};

const MortgageCalculator: React.FC = () => {
  const [loanState, setLoanState] = useState<LoanState>({
    loanType: "purchase",
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0,
    startDate: moment().toDate(),
    amortizationSchedule: [],
  });

  const handleInputChange = <K extends keyof LoanState>(
    field: K,
    value: LoanState[K]
  ) => {
    setLoanState((prev) => ({ ...prev, [field]: value }));
  };

  const calculateMortgage = () => {
    const { loanAmount, interestRate, loanTerm, startDate } = loanState;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      //alert("Please enter valid values for loan amount, interest rate, and loan term.");
      return;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    const monthlyPayment =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalPayments))) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    let remainingBalance = loanAmount;
    let totalInterest = 0;
    const schedule: AmortizationEntry[] = [];

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalInterest += interestPayment;
      remainingBalance -= principalPayment;

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + month - 1);

      schedule.push({
        paymentNumber: month,
        paymentDate: paymentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest,
        remainingBalance: Math.max(0, remainingBalance),
        year: paymentDate.getFullYear(),
        month: paymentDate.getMonth(),
      });
    }

    setLoanState((prev) => ({ ...prev, amortizationSchedule: schedule }));
  };

  // Filter schedule for yearly intervals
  const yearlySchedule = loanState.amortizationSchedule.filter(
    (item) => item.month === loanState.startDate.getMonth()
  );

  return (
    <div className="bg-white p-8 rounded-md shadow-md w-full border flex flex-col gap-1">
      <h1 className="text-center text-[#42acd8] font-semibold text-2xl mb-1 flex gap-2 items-center justify-center">
        Mortgage & Loan Amortization Calculator
      </h1>

      <p className="flex gap-2 items-center justify-center">
        <span>Estimate how long it will take to pay off your loans</span>
        <span>
          <TooltipOne
            text={
              <div className="flex flex-col gap-1 items-start justify-center">
                <p className="whitespace-normal leading-normal">
                  Disclosure: This is an estimate only as terms will vary.
                </p>
                <p className="whitespace-normal leading-normal">
                  Vendors can have different types of APR interest, how they are
                  applied, penalties, fees, balance variations, minimum payment
                  requirements, loan terms, calculator variances, etc.
                </p>
                <p className="whitespace-normal leading-normal">
                  Please contact your lender for any questions you may have.
                </p>
              </div>
            }
          />
        </span>
      </p>

      {/* Inputs */}
      <div className="flex flex-col gap-2 items-center text-md mt-5">
        <div className="flex w-full items-center justify-center gap-4">
          <div className="w-[50%] flex flex-col space-y-2 mb-6">
            <label htmlFor="loanType">Loan Type</label>
            <select
              value={loanState.loanType}
              onChange={(e: any) =>
                handleInputChange("loanType", e.target.value)
              }
              className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8] p-2"
            >
              <option value="purchase">Mortgage Purchase</option>
              <option value="refinance">Refinance</option>
              <option value="auto">Auto Loan</option>
              <option value="business">Business Loan</option>
              <option value="personal">Personal Loan</option>
            </select>
          </div>

          <div className="w-[50%] flex flex-col">
            <InputFieldNormal
              type="number"
              label="Loan Amount ($)"
              value={loanState.loanAmount}
              onChangeData={(value) => handleInputChange("loanAmount", value)}
              min={10}
            />
          </div>
        </div>

        <div className="flex w-full p-2 items-center justify-center gap-4">
          <div className="w-[50%] flex flex-col gap-1">
            <InputFieldNormal
              type="number"
              label="Interest Rate (%)"
              value={loanState.interestRate}
              onChangeData={(value) => handleInputChange("interestRate", value)}
              min={10}
            />
          </div>
          <div className="w-[50%] flex flex-col gap-1">
            <InputFieldNormal
              type="number"
              label="Loan Term (years)"
              value={loanState.loanTerm}
              onChangeData={(value) => handleInputChange("loanTerm", value)}
              min={10}
            />
          </div>
        </div>

        <div className="flex w-full p-2 gap-4">
          <div className="w-[50%] flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={loanState.startDate}
              onChange={(value) =>
                handleInputChange("startDate", value as Date)
              }
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="p-2 border focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8] rounded-md w-full"
            />
          </div>
        </div>

        <div className="flex w-full p-2 items-center justify-center gap-4 mt-4">
          <button
            onClick={calculateMortgage}
            className="px-4 py-2 w-[50%] bg-[#42acd8] text-white rounded-md hover:bg-[#3798c0]"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Yearly Chart */}
      {yearlySchedule.length > 0 && (
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yearlySchedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="paymentDate" />
              <YAxis
                tick={{ fontSize: 15 }}
                tickFormatter={(value) => `$${formatLargeNumber(value)}`}
              />
              <Legend />
              <Tooltip
                formatter={(value) =>
                  `$${Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(value.toLocaleString()))}`
                }
              />
              <Line
                type="monotone"
                dataKey="remainingBalance"
                stroke="#42acd8"
                name="Remaining Principal"
              />
              <Line
                type="monotone"
                dataKey="totalInterest"
                stroke="#ff9f00"
                name="Cumulative Interest"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {loanState.amortizationSchedule.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 mt-4">
          <table className="w-full text-left border-collapse border border-[#ddd]">
            <thead>
              <tr className="bg-[#f2f2f2] uppercase text-sm leading-normal">
                <th className="py-2 px-4 border border-[#ddd]">
                  Payment Number
                </th>
                <th className="py-2 px-4 border border-[#ddd]">Payment Date</th>
                <th className="py-2 px-4 border border-[#ddd]">Payment</th>
                <th className="py-2 px-4 border border-[#ddd]">Principal</th>
                <th className="py-2 px-4 border border-[#ddd]">Interest</th>
                <th className="py-2 px-4 border border-[#ddd]">
                  Total Interest
                </th>
                <th className="py-2 px-4 border border-[#ddd]">
                  Remaining Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {loanState.amortizationSchedule.map((data, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 == 0 ? "#f9f9f9" : "#fffff",
                  }}
                >
                  <td className="py-2 px-4 border border-[#ddd] text-center">
                    {data.paymentNumber}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
                    {data.paymentDate}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
                    $
                    {Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(data.payment)}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
                    $
                    {Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(data.principal)}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
                    $
                    {Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(data.interest)}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
                    $
                    {Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(data.totalInterest)}
                  </td>
                  <td className="py-2 px-4 border border-[#ddd]">
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
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;
