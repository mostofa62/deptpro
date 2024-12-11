import { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';

const CreditCardCalculator = () => {
  // State to manage inputs
  const [balance, setBalance] = useState<number>(3000);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [apr, setApr] = useState<number>(15);
  const [repaymentType, setRepaymentType] = useState<string>('Minimum Payment Only');
  const [fixedPayment, setFixedPayment] = useState<number | null>(null);

  // State to manage the calculated data
  const [projectedData, setProjectedData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  // Calculate projected data
  const handleCalculate = () => {
    let balanceLeft = balance;
    let cumulativeInterest = 0;
    let totalPayment = 0;
    let data: any[] = [];
    let graph: any[] = [];

    const monthlyInterestRate = (apr / 100) / 12;
    const months = 12; // Let's project for 12 months

    for (let i = 1; i <= months; i++) {
      let interest = balanceLeft * monthlyInterestRate;
      let principalPayment = repaymentType === 'Fixed Payment' ? fixedPayment! - interest : 0;
      let minPayment = repaymentType === 'Minimum Payment Only' ? balanceLeft * 0.03 : fixedPayment!;
      let payment = repaymentType === 'Fixed Payment' ? fixedPayment! : minPayment;
      let remainingBalance = balanceLeft - principalPayment;

      if (remainingBalance < 0) remainingBalance = 0;

      // Collect data for table
      data.push({
        Date: moment().add(i, 'months').format('MM/DD/YYYY'),
        MinPayment: minPayment.toFixed(2),
        Payment: payment.toFixed(2),
        Principal: principalPayment.toFixed(2),
        Interest: interest.toFixed(2),
        RemainingBalance: remainingBalance.toFixed(2),
      });

      // Prepare data for the graph
      totalPayment += payment;
      cumulativeInterest += interest;

      graph.push({
        month: moment().add(i, 'months').format('MM/DD/YYYY'),
        balance: remainingBalance,
        paymentAmount: payment,
        cumulativeInterest,
      });

      balanceLeft = remainingBalance;
    }

    setProjectedData(data);
    setGraphData(graph);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-4">
        {/* Input fields */}
        <div>
          <label htmlFor="balance" className="block">Credit Card Balance ($)</label>
          <input
            type="number"
            id="balance"
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
            className="input"
            placeholder="Enter credit card balance"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date: Date) => setDueDate(date)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="apr" className="block">APR (%)</label>
          <input
            type="number"
            id="apr"
            value={apr}
            onChange={(e) => setApr(parseFloat(e.target.value))}
            className="input"
            placeholder="Enter APR"
          />
        </div>

        <div>
          <label htmlFor="repaymentType" className="block">Repayment Type</label>
          <select
            id="repaymentType"
            value={repaymentType}
            onChange={(e) => setRepaymentType(e.target.value)}
            className="input"
          >
            <option value="Minimum Payment Only">Minimum Payment Only</option>
            <option value="Fixed Payment">Fixed Payment</option>
          </select>
        </div>

        {repaymentType === 'Fixed Payment' && (
          <div>
            <label htmlFor="fixedPayment" className="block">Fixed Payment ($)</label>
            <input
              type="number"
              id="fixedPayment"
              value={fixedPayment || ''}
              onChange={(e) => setFixedPayment(parseFloat(e.target.value))}
              className="input"
              placeholder="Enter fixed payment"
            />
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Calculate
        </button>
      </div>

      {/* Graph */}
      <div className="my-6">
        <ResponsiveContainer width="100%" height={300}>
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

      {/* Projected Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Date</th>
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
                <td className="px-4 py-2 border">{data.Date}</td>
                <td className="px-4 py-2 border">{data.MinPayment}</td>
                <td className="px-4 py-2 border">{data.Payment}</td>
                <td className="px-4 py-2 border">{data.Principal}</td>
                <td className="px-4 py-2 border">{data.Interest}</td>
                <td className="px-4 py-2 border">{data.RemainingBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditCardCalculator;
