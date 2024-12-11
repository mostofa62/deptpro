import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import TooltipOne from '@/app/components/ui/TooltipOne';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MortgageCalculator: React.FC = () => {
  const [loanType, setLoanType] = useState<string>('purchase');
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(moment().toDate());
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  const calculateMortgage = () => {


    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment =
      loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    let remainingBalance = loanAmount;
    let totalInterest = 0;
    const schedule: any[] = [];

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalInterest += interestPayment;
      remainingBalance -= principalPayment;

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + month - 1);

      schedule.push({
        paymentNumber: month,
        paymentDate: paymentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest,
        remainingBalance: Math.max(0, remainingBalance),
        year: paymentDate.getFullYear(),
        month: paymentDate.getMonth(),
      });
    }

    setAmortizationSchedule(schedule);
  };

  // Filter schedule for yearly intervals
  const yearlySchedule = amortizationSchedule.filter(
    (item, index, array) =>
      index === 0 || // Include the first payment
      item.month === startDate.getMonth() // Include payments on the start month
  );

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md gap-3">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-[15px] font-bold">Mortgage & Loan Amortization Calculator</h1>
        
        <p className="flex gap-1">
          <span className='text-sm'>
            Estimate how long it will take to pay off your loans
          </span>
          <span>
            <TooltipOne text={<div className='flex flex-col gap-1 items-start justify-center'>
            <p className="whitespace-normal leading-normal">Disclosure: This is an estimate only as terms will vary.</p>
            <p className="whitespace-normal leading-normal">Vendors can have different types of APR interest, how they are applied, penalties, fees, balance variations, minimum payment requirements, loan terms, calculator variances, etc.</p>
            <p className="whitespace-normal leading-normal">Please contact your lender for any questions you may have.</p>
          </div>} />
          </span>  
        </p>
        
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4 items-center text-[15px]">
        <div className="flex w-full p-2 items-center justify-center gap-4">
          <div className="w-[40%] flex flex-col gap-1">
            <label className="font-medium">Loan Type</label>
            <select
              className="border-gray rounded-sm shadow-sm focus:ring-[#43acd6] focus:border-[#43acd6] p-2"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              <option value="purchase">Mortgage Purchase</option>
              <option value="refinance">Refinance</option>
              <option value="auto">Auto Loan</option>
              <option value="business">Business Loan</option>
              <option value="personal">Personal Loan</option>
            </select>
          </div>
          <div className="w-[40%] flex flex-col gap-1">
            <label className="font-medium">Loan Amount ($)</label>
            <input
              type="number"
              className="border-gray rounded-sm shadow-sm focus:ring-[#43acd6] focus:border-[#43acd6] p-1"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex w-full p-2 items-center justify-center gap-4">
          <div className="w-[40%] flex flex-col gap-1">
            <label className="font-medium">Interest Rate (%)</label>
            <input
              type="number"
              className="border-gray rounded-sm shadow-sm focus:ring-[#43acd6] focus:border-[#43acd6] p-1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div className="w-[40%] flex flex-col gap-1">
            <label className="font-medium">Loan Term (years)</label>
            <input
              type="number"
              className="border-gray rounded-sm shadow-sm focus:border-[#43acd6] p-1"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex w-full p-2 items-center justify-center gap-4">
          <div className="w-[40%] flex flex-col gap-1">
            <label className="font-medium">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="border-gray w-full rounded-sm shadow-sm focus:ring-[#43acd6] focus:border-[#43acd6] p-1"
            />
          </div>
          <div className="w-[40%] flex justify-center">
            <button
              onClick={calculateMortgage}
              className="bg-[#43acd6] text-white py-2 px-2 mt-4 rounded-sm hover:bg-[#43acd6]"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>

      {/* Yearly Chart */}
      {yearlySchedule.length > 0 && (
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yearlySchedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="paymentDate" />
              <YAxis />
              <Legend />
              <Tooltip formatter={(value) => `$${parseFloat(value.toLocaleString()).toFixed(2)}`} />
              <Line type="monotone" dataKey="remainingBalance" stroke="#42acd8" name="Remaining Principal" />
              <Line type="monotone" dataKey="totalInterest" stroke="#ff9f00" name="Cumulative Interest" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

{amortizationSchedule.length > 0 && (
            <div className='flex flex-col items-center justify-center gap-3'>
                <h3 className="font-semibold text-[15px]">Amortization Schedule</h3>
          <table className="w-full text-left border-collapse border border-gray">
            <thead>
              <tr className="bg-gray uppercase text-sm leading-normal">
                <th className="py-2 px-4 border border-gray-300">Payment Number</th>
                <th className="py-2 px-4 border border-gray-300">Payment Date</th>
                <th className="py-2 px-4 border border-gray-300">Payment</th>
                <th className="py-2 px-4 border border-gray-300">Principal</th>
                <th className="py-2 px-4 border border-gray-300">Interest</th>
                <th className="py-2 px-4 border border-gray-300">Total Interest</th>
                <th className="py-2 px-4 border border-gray-300">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((data, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-gray-300 text-center">{data.paymentNumber}</td>
                  <td className="py-2 px-4 border border-gray-300">{data.paymentDate}</td>
                  <td className="py-2 px-4 border border-gray-300">${data.payment.toFixed(2)}</td>
                  <td className="py-2 px-4 border border-gray-300">${data.principal.toFixed(2)}</td>
                  <td className="py-2 px-4 border border-gray-300">${data.interest.toFixed(2)}</td>
                  <td className="py-2 px-4 border border-gray-300">${data.totalInterest.toFixed(2)}</td>
                  <td className="py-2 px-4 border border-gray-300">${data.remainingBalance.toFixed(2)}</td>
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
