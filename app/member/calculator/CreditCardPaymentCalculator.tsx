import { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';

const CreditCardCalculator = () => {
  // State to manage inputs
  const [balance, setBalance] = useState<number>(5000); // Example initial balance
  const [dueDate, setDueDate] = useState<Date | null>(moment().add(1, 'months').toDate());
  const [apr, setApr] = useState<number>(18.99);
  const [repaymentType, setRepaymentType] = useState<number>(1); // 1: Minimum Payment, 2: Fixed Payment
  const [fixedPayment, setFixedPayment] = useState<number | null>(null); // For Fixed Payment input

  // State to manage the calculated data
  const [projectedData, setProjectedData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  const [minPayment, setminPayment] = useState<string>('');
  const [principalBalance, setprincipalBalance] = useState<string>('');
  const [interestPaid, setinterestPaid] = useState<string>('');
  const [totalPaidAmount, settotalPaidAmount] = useState<string>('');

  // Formatter for currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Calculate the payments based on the logic provided
  const handleCalculate = () => {
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

    while (currentBalance > 1 && month < 360) { // Limit to 30 years max
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + month); // Increment by the month count from the due date

      const interest = currentBalance * monthlyRate;

      // Minimum payment calculation
      let minPayment = Math.max(Math.min(currentBalance * 0.01 + interest, currentBalance + interest), 25);
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
        month: moment(currentDate).format('MMM YYYY'), // Format as "Jan 2025"
        minPayment: minPayment.toFixed(2),
        payment: payment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        remainingBalance: currentBalance.toFixed(2),
      });

      // Save the monthly data for the graph
      graph.push({
        month: moment(currentDate).format('MMM YYYY'), // Format as "Jan 2025"
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-4">
        {/* Input fields */}
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-2 w-[30%]">
            <label htmlFor="balance">Credit Card Balance ($)</label>
            <input
              type="number"
              
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
              placeholder="Enter credit card balance"
            />
          </div>

          <div className="flex flex-col gap-2 w-[30%]">
            <label htmlFor="dueDate">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date) => setDueDate(date)}
              className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
            />
          </div>

          <div className="flex flex-col gap-2 w-[30%]">
            <label htmlFor="apr">APR (%)</label>
            <input
              type="number"
              
              value={apr}
              onChange={(e) => setApr(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
              placeholder="Enter APR"
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-[30%]">
            <label htmlFor="repaymentType">Repayment Type</label>
            <select
              
              value={repaymentType}
              onChange={(e) => setRepaymentType(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
            >
              <option value={1}>Minimum Payment Only</option>
              <option value={2}>Fixed Payment</option>
            </select>
          </div>

          {repaymentType === 2 && (
            <div className="flex flex-col gap-2 w-[30%]">
              <label htmlFor="fixedPayment">Fixed Payment ($)</label>
              <input
                type="number"
                
                value={fixedPayment || ''}
                onChange={(e) => setFixedPayment(parseFloat(e.target.value))}
                className="border border-gray-300 rounded-md shadow-sm focus:border-[#42acd8] focus:ring-1 focus:ring-[#42acd8] p-2"
                placeholder="Enter fixed payment"
              />
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={handleCalculate}
            className="bg-[#42acd8] text-white py-2 px-6 rounded-md text-center"
          >
            Calculate
          </button>
        </div>
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#8884d8" />
              <Line type="monotone" dataKey="paymentAmount" stroke="#82ca9d" />
              <Line type="monotone" dataKey="cumulativeInterest" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Projected Data Table */}
      {projectedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className='bg-[#f2f2f2] text-[#4a4a4a] font-semibold'>
              <tr>
                <th className="px-4 py-2 border">Month</th>
                <th className="px-4 py-2 border">Min Payment</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Principal</th>
                <th className="px-4 py-2 border">Interest</th>
                <th className="px-4 py-2 border">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {projectedData.map((data, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{data.month}</td>
                  <td className="px-4 py-2 border">${data.minPayment}</td>
                  <td className="px-4 py-2 border">${data.payment}</td>
                  <td className="px-4 py-2 border">${data.principal}</td>
                  <td className="px-4 py-2 border">${data.interest}</td>
                  <td className="px-4 py-2 border">${data.remainingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreditCardCalculator;
