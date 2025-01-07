import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './StockCalculator.module.css';
// Currency formatter
const currencyFormatter = (amount: number, currencySymbol: string) => {
  return `${currencySymbol} ${amount.toFixed(2)}`;
};

const StockCalculator = () => {
  const [spreadsheetData, setSpreadsheetData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);
  const [currency, setCurrency] = useState<string>('USD'); // default currency is USD

  const validationSchema = Yup.object({
    shares: Yup.number().min(1, 'Shares must be at least 1').required('Shares are required'),
    purchasePrice: Yup.number().min(0, 'Purchase price cannot be negative').required('Purchase price is required'),
    sellingPrice: Yup.number().min(0, 'Selling price cannot be negative').required('Selling price is required'),
    buyCommission: Yup.number().min(0, 'Commission cannot be negative').required('Buy commission is required'),
    sellCommission: Yup.number().min(0, 'Commission cannot be negative').required('Sell commission is required'),
    taxRate: Yup.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100').required('Tax rate is required'),
    buyCommissionType: Yup.string().oneOf(['amount', 'percentage']).required('Buy commission type is required'),
    sellCommissionType: Yup.string().oneOf(['amount', 'percentage']).required('Sell commission type is required'),
  });

  const handleSubmit = (values: any) => {
    const {
      shares,
      purchasePrice,
      sellingPrice,
      buyCommission,
      sellCommission,
      buyCommissionType,
      sellCommissionType,
      taxRate,
    } = values;

    let buyCommissionAmount: number, sellCommissionAmount: number;

    if (buyCommissionType === 'percentage') {
      buyCommissionAmount = (shares * purchasePrice) * (buyCommission / 100);
    } else {
      buyCommissionAmount = buyCommission;
    }

    if (sellCommissionType === 'percentage') {
      sellCommissionAmount = (shares * sellingPrice) * (sellCommission / 100);
    } else {
      sellCommissionAmount = sellCommission;
    }

    const totalCost = (shares * purchasePrice) + buyCommissionAmount;
    const totalRevenue = (shares * sellingPrice) - sellCommissionAmount;
    let profit = totalRevenue - totalCost;
    const taxAmount = profit > 0 ? profit * (taxRate / 100) : 0;
    profit -= taxAmount;
    const roi = (profit / totalCost) * 100;
    const breakEvenPrice = (totalCost + sellCommissionAmount) / shares;
    const netProfitLoss = profit;

    const data = {
      totalCost,
      totalRevenue,
      profit,
      taxAmount,
      roi,
      breakEvenPrice,
      buyCommissionAmount,
      sellCommissionAmount,
      netProfitLoss,
    };

    setSpreadsheetData(data);

    // Prepare chart data
    setChartData([
      { name: 'Purchase Price', value: purchasePrice },
      { name: 'Selling Price', value: sellingPrice },
      { name: 'Break-even Price', value: breakEvenPrice },
      { name: 'Net Profit/Loss', value: netProfitLoss },
    ]);
  };
  const [highlighted, setHighlighted] = useState<string>('');

  const highlightInvested = () => {
    setHighlighted('totalCost')
  };

  const highlightEarned = () => {
    setHighlighted('netProfit')
  };

  

  return (
    <div className="mx-auto p-6 bg-white rounded-sm shadow-md flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-center text-[#42acd8]">Stock Calculator</h1>
      <h5 className='text-center'>Estimate the value of buying and selling stock</h5>
      <Formik
        initialValues={{
          shares: 1,
          purchasePrice: 0,
          sellingPrice: 0,
          buyCommission: 0,
          sellCommission: 0,
          buyCommissionType: 'amount',
          sellCommissionType: 'amount',
          taxRate: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className='flex flex-col w-full gap-4 items-center'>
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Shares Purchased</label>
                <Field
                  type="number"
                  name="shares"
                  className="mt-2 w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                />
                <ErrorMessage name="shares" component="div" className="text-[#ff6666] text-xs mt-1" />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Purchase Price Per Share</label>
                <Field
                  type="number"
                  name="purchasePrice"
                  className="mt-2 w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                />
                <ErrorMessage name="purchasePrice" component="div" className="text-[#ff6666] text-xs mt-1" />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Selling Price Per Share</label>
                <Field
                  type="number"
                  name="sellingPrice"
                  className="mt-2 w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                />
                <ErrorMessage name="sellingPrice" component="div" className="text-[#ff6666] text-xs mt-1" />
              </div>

              {/* Buy Commission Fee */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Buy Commission Fee</label>
                <div className="flex gap-4 items-center">
                  <div className='w-[90%]'>
                    <Field
                        type="number"
                        name="buyCommission"
                        className="w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                    />
                  </div>
                  <div className='w-[10%]'>
                    <Field as="select" name="buyCommissionType" className="px-3 py-2.5 border border-[#ddd]-300 rounded-md">
                        <option value="amount">$</option>
                        <option value="percentage">%</option>
                    </Field>
                  </div>
                </div>
                <ErrorMessage name="buyCommission" component="div" className="text-[#ff6666] text-xs mt-1" />
              </div>

              {/* Sell Commission Fee */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Sell Commission Fee</label>
                <div className="flex gap-4 items-center">
                    <div className='w-[90%]'>
                        <Field
                            type="number"
                            name="sellCommission"
                            className="w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                        />
                    </div>
                    <div className='w-[10%]'>
                        <Field as="select" name="sellCommissionType" className="px-3 py-2.5 border border-[#ddd]-300 rounded-md">
                            <option value="amount">$</option>
                            <option value="percentage">%</option>
                        </Field>
                    </div>
                </div>
                <ErrorMessage name="sellCommission" component="div" className="text-red text-xs mt-1" />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Capital Gain Tax Rate (%)</label>
                <Field
                  type="number"
                  name="taxRate"
                  className="mt-2 w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                />
                <ErrorMessage name="taxRate" component="div" className="text-[#ff6666] text-xs mt-1" />
              </div>

              {/* Currency Selector */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Select Currency</label>
                <select
                  className="mt-2 w-full px-3 py-2 border border-[#ddd]-300 rounded-md"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-1/2 bg-[#42acd8] text-white py-2 rounded-md hover:bg-blue-400"
              >
                Calculate
              </button>
            </div>
          </Form>
        )}
      </Formik>


      {/* Display the chart */}
      {chartData.length > 0 && (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {spreadsheetData &&

      <div className='flex items-center justify-center gap-5'>
            <button
        className="bg-[#f0f8ff] border-2 border-[#42acd8] text-[#42acd8] py-2 px-5 rounded-md text-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#42acd8] hover:text-white"
        onClick={highlightInvested}
        >
        Amount Invested
        </button>

        <button
        className="bg-[#f0f8ff] border-2 border-[#42acd8] text-[#42acd8] py-2 px-5 rounded-md text-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#42acd8] hover:text-white"
        onClick={highlightEarned}
        >
        Net Amount Earned
        </button>

      </div>
    }

      {/* Display the results */}
      {spreadsheetData && (
        <div className="mt-6">
          <table className="min-w-full text-left  border border-[#ddd] rounded-lg">
            <tbody>
            <tr className=' border border-[#ddd]'>
                <th className="px-4 py-2 bg-[#e6f7ff] border border-[#ddd]">Item</th>
                <th className="px-4 py-2 bg-[#e6f7ff] border border-[#ddd]">Value</th>
            </tr>
                <tr
                    className={`${styles.tableRow} ${highlighted === 'totalCost' ? styles.highlight : ''}`}
                >
                <td className="px-4 py-2 border border-[#ddd]">Total Cost (Amount Invested)</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.totalCost, currency)}</td>
            </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Total Revenue</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.totalRevenue, currency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Profit/Loss</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.profit, currency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Tax Amount</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.taxAmount, currency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">ROI</td>
                <td className="px-4 py-2 border border-[#ddd]">{spreadsheetData.roi.toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Break-even Price</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.breakEvenPrice, currency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Buy Commission</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.buyCommissionAmount, currency)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-[#ddd]">Sell Commission</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.sellCommissionAmount, currency)}</td>
              </tr>
              <tr
                className={`${styles.tableRow} ${highlighted === 'netProfit' ? styles.highlight : ''}`}
            >
                <td className="px-4 py-2 border border-[#ddd]">Net Profit/Loss</td>
                <td className="px-4 py-2 border border-[#ddd]">{currencyFormatter(spreadsheetData.netProfitLoss, currency)}</td>
            </tr>
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
};

export default StockCalculator;
