import TooltipOne from "@/app/components/ui/TooltipOne";
import { formatLargeNumber } from "@/app/components/utils/Util";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InputField from "./InputField";


const CustomTooltipLine = ({ payload,label }:any) => {
    if (!payload || payload.length === 0) return null;
    return (
      <div className="bg-white border p-2 rounded shadow-lg text-sm">
        <div><strong>Year </strong> {label}</div>
        {payload.map((entry:any, index:number) => (
          <div key={`item-${index}`} style={{ color: entry.stroke }}>
            <strong>{entry.dataKey}:</strong> ${Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,maximumFractionDigits: 0}).format(entry.value)}
          </div>
        ))}
      </div>
    );
  };

type ChartData = {
    year: number;
    totalContributingBalance: number;
    totalAccumulation: number;
    afterTaxInflationBalance: number;
  };

const FinancialFreedomCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    target: 1000000,
    currentDate: new Date().toISOString().split("T")[0], // Default to today
    currentAge: 30,
    targetAge: 65,
    currentSavings: 10000,
    monthlyContribution: 500,
    inflation: 2,
    returnRate: 7,
    taxRate: 25,
  });

  const [result, setResult] = useState({
    yearsToTarget: 0,
    targetAgeResult: 0,
    freedomDate: '',
    monthlySavingsNeeded: 0,
    additionalSavings:0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (id: string, value: number) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  function calculateYearsToTarget(target:number, current:number, monthlyContribution:number, returnRate:number, taxRate:number) {
    const monthlyReturn = returnRate / 12;
    const afterTaxReturn = monthlyReturn * (1 - taxRate);

    // If already at or above target
    if (current >= target) return 0;

    // Use iterative approach for more accuracy
    let balance = current;
    let years = 0;
    const maxYears = 100; // Prevent infinite loop
    
    while (balance < target && years < maxYears) {
        let prevBalance = balance;
        for (let month = 0; month < 12; month++) {
            balance = balance * (1 + afterTaxReturn) + monthlyContribution;
        }
        if (balance <= prevBalance) break; // If no progress is being made
        years++;
    }
    
    return years;
  }

  function calculateMonthlyNeeded(target:number, currentSavings:number, returnRate:number, inflation:number, yearsToTarget:number) {
    const adjustedReturnRate = (1 + returnRate) / (1 + inflation) - 1; // Adjust for inflation
    const monthlyReturnRate = adjustedReturnRate / 12;
  
    const monthsToTarget = yearsToTarget * 12;
  
    // If no months left, return 0
    if (monthsToTarget <= 0) return 0;
  
    // Calculate using future value of series formula
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyReturnRate, monthsToTarget);
  
    // If target can already be achieved with current savings
    if (futureValueOfCurrentSavings >= target) return 0;
  
    const remainingTarget = target - futureValueOfCurrentSavings;
  
    const monthlyNeeded = remainingTarget * monthlyReturnRate / (Math.pow(1 + monthlyReturnRate, monthsToTarget) - 1);
  
    return monthlyNeeded;
  }

  function formatCurrency(value:number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  
  
  function calculateChartData(
    initial: number,
    monthly: number,
    return_rate: number,
    inflation: number,
    tax_rate: number,
    years: number
  ): ChartData[] {
    const data: ChartData[] = [];
    let balance = initial;
    let contributions = initial;
    const monthlyAfterTaxReturn = (return_rate / 12) * (1 - tax_rate);
  
    for (let year = 0; year <= years; year++) {
      const yearlyContribution = monthly * 12;
      
      // More accurate compound interest calculation
      let yearEndBalance = balance;
      for (let month = 0; month < 12; month++) {
        yearEndBalance *= (1 + monthlyAfterTaxReturn);
        yearEndBalance += monthly;
      }
      
      if (year > 0) {
        contributions += yearlyContribution;
      }
      balance = yearEndBalance;
  
      data.push({
        year: year,
        totalContributingBalance: contributions,
        totalAccumulation: balance,
        afterTaxInflationBalance: balance * Math.pow(1 - inflation, year),
      });
    }
  
    return data;
  }

  const calculate = () => {
    const {
      target,
      currentDate,
      currentAge,
      targetAge,
      currentSavings,
      monthlyContribution,
      inflation,
      returnRate,
      taxRate,
    } = inputs;

    const inflationP = inflation/ 100;
    const returnRateP = returnRate / 100;
    const taxRateP = taxRate / 100;

    const yearsToTarget = calculateYearsToTarget(
        target,
        currentSavings,
        monthlyContribution,
        returnRateP,
        taxRateP
    );

    // Calculate freedom date
    const currentDateP = new Date(currentDate);
    const freedomDate = new Date(currentDateP.setFullYear(currentDateP.getFullYear() + yearsToTarget));
    // Calculate freedom age
    const freedomAge = currentAge + yearsToTarget;

    const monthlySavingsNeeded = calculateMonthlyNeeded(target, currentSavings, returnRateP, inflationP, yearsToTarget)

    const additionalSavings = Math.max(0, monthlySavingsNeeded - monthlyContribution);

    setResult({
      yearsToTarget,
      targetAgeResult:freedomAge,
      freedomDate:freedomDate.toLocaleDateString(),
      monthlySavingsNeeded: isFinite(monthlySavingsNeeded)
      ? monthlySavingsNeeded
      : 0,
      additionalSavings:additionalSavings
    });

    const chartDataArray = calculateChartData(currentSavings, monthlyContribution, returnRateP, inflationP, taxRateP, yearsToTarget);
    setChartData(chartDataArray)
  };

  useEffect(()=>{
    calculate();
  })

  return (
    <div className="p-6 mx-auto rounded-md shadow-md border">
      <h1 className="text-2xl font-bold text-[#42acd8] mb-4 text-center">
        Financial Freedom Calculator
      </h1>
      <p className='flex items-center justify-center gap-2'>
        <span>Calculate the estimated time you will reach your Financial Freedom Goal</span>
        <TooltipOne text={<div className='flex flex-col gap-1 items-start justify-center'>
            <p className="whitespace-normal leading-normal">Disclosure: Financial Freedom Calculator</p>
            <p className="whitespace-normal leading-normal">For general information purposes only. Report any errors.</p>
            <p className="whitespace-normal leading-normal">This is an estimate of monthly amount needed to reach financial target before taxes and inflation.</p>
            <p className="whitespace-normal leading-normal">Adjust the calculator if you want to reach your target after taxes and inflation.</p>
            <p className="whitespace-normal leading-normal">Taxes and inflation are an estimate and will vary with US economy and world market changes.</p>
            <p className="whitespace-normal leading-normal">Savings is being reflected as accruing each month, presuming no loss and may not represent real world values.</p>
            <p className="whitespace-normal leading-normal">You are responsible for your own financial and tracking results through your various financial efforts.</p>
                         
            </div>} />
      </p>
      <div className="flex flex-col gap-1 mt-5">
        <div className="flex justify-center gap-3">

            <div className="w-[50%]">
                <InputField
                label="Your Financial Freedom Target ($)"
                id="target"
                min={0}
                max={100000000}
                step={1000}
                value={inputs.target}
                onChange={(value) => handleInputChange("target", value)}
                />
            </div>
            <div className="w-[50%]">
                <div className="flex flex-col gap-2">
                <label htmlFor="currentDate" className="text-sm font-medium text-gray-700">
                    Current Date
                </label>
                <input
                    type="date"
                    id="currentDate"
                    value={inputs.currentDate}
                    onChange={(e:any) => handleInputChange("currentDate", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />
                </div>
            </div>

            
        </div>

        <div className="flex justify-center gap-3">
        <div className="w-[50%]">
        <InputField
            label="Current Age"
            id="currentAge"
            min={0}
            max={100}
            step={1}
            value={inputs.currentAge}
            onChange={(value) => handleInputChange("currentAge", value)}
            />
            </div>

            <div className="w-[50%]">

<InputField
            label="Financial Freedom Target Age"
            id="targetAge"
            min={0}
            max={100}
            step={1}
            value={inputs.targetAge}
            onChange={(value) => handleInputChange("targetAge", value)}
            />
</div>

        </div>

        <div className="flex justify-center gap-3">
            
        <div className="w-[50%]">
            <InputField
            label="Current Amount Saved ($)"
            id="currentSavings"
            min={0}
            max={1000000}
            step={100}
            value={inputs.currentSavings}
            onChange={(value) => handleInputChange("currentSavings", value)}
            />
            </div>
            <div className="w-[50%]">
            <InputField
            label="Monthly Contribution ($)"
            id="monthlyContribution"
            min={0}
            max={10000}
            step={100}
            value={inputs.monthlyContribution}
            onChange={(value) => handleInputChange("monthlyContribution", value)}
            />
            </div>


        </div>
        
        <div className="flex justify-center gap-3">
        <div className="w-[50%]">
        
        <InputField
          label="Annual Rate of Inflation (%)"
          id="inflation"
          min={0}
          max={100}
          step={0.1}
          value={inputs.inflation}
          onChange={(value) => handleInputChange("inflation", value)}
        />

        </div>

        <div className="w-[50%]">
        <InputField
          label="Annual Rate of Return (%)"
          id="returnRate"
          min={0}
          max={100}
          step={0.1}
          value={inputs.returnRate}
          onChange={(value) => handleInputChange("returnRate", value)}
        />
        </div>
        </div>


        <div className="flex gap-3">
            <div className="w-[50%]">
            <InputField
            label="Tax Rate (%)"
            id="taxRate"
            min={0}
            max={100}
            step={0.1}
            value={inputs.taxRate}
            onChange={(value) => handleInputChange("taxRate", value)}
            />
            </div>
        </div>
        <div className="flex justify-center gap-3">
            <button
                onClick={calculate}
                className="px-4 py-2 w-[50%] bg-[#42acd8] text-white rounded-md hover:bg-[#3798c0]"
            >
                Calculate
            </button>

            </div>

      </div>

      <div className="flex gap-1 mt-6">

        <div className="w-[33%] py-3 rounded-lg text-white flex flex-col items-center justify-center" 
        style={{ background:'linear-gradient(135deg, #42acd8, #3798c0)' }}>
            <h3 className="font-semibold">Financial Freedom Date</h3>
            <p>{result.freedomDate}</p>
        </div>

        <div className="w-[33%] py-3 rounded-lg text-white px-1 flex flex-col items-center justify-center"
        style={{ background:'linear-gradient(135deg, #ff9f00, #f39000)' }}
        >
            <h3 className="font-semibold">By Age</h3>
            <p>{result.targetAgeResult}</p>
        </div>

        <div className="w-[33%] py-3 rounded-lg text-white px-1 flex flex-col items-center justify-center"
        style={{ background:'linear-gradient(135deg, #31c4a2, #27a589)' }}
        >
            <h3 className="font-semibold">Number of Years</h3>
            <p>{result.yearsToTarget}</p>
        </div>

      </div>


      <div className="flex my-6">

      <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tickFormatter={(tick) => `Year ${tick}`} />
        <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`}  />
        <Tooltip content={<CustomTooltipLine />} />
        <Legend 
          iconType="square" // Square icon for legend
          layout="horizontal" // Legend layout (can be "horizontal" or "vertical")
        />
        <Line type="monotone" dataKey="totalContributingBalance" stroke="rgba(255, 159, 0, 1)" name="Total Contributing Balance" />
        <Line type="monotone" dataKey="totalAccumulation" stroke="rgba(66, 172, 216, 1)" name="Total Accumulation" />
        <Line type="monotone" dataKey="afterTaxInflationBalance" stroke="rgba(49, 196, 162, 1)" name="After Tax & Inflation Balance" />
      </LineChart>
    </ResponsiveContainer>

      </div>




      <div className="flex gap-1 mt-6">

        <div className="w-[50%] py-3 rounded-lg text-white flex flex-col items-center justify-center" 
        style={{ background:'linear-gradient(135deg, #31c4a2, #27a589)' }}>
            <h3 className="font-semibold">Minimum Monthly Savings Needed</h3>
            <p>{formatCurrency(result.monthlySavingsNeeded)}</p>
        </div>

        <div className="w-[50%] py-3 rounded-lg text-white px-1 flex flex-col items-center justify-center"
        style={{ background:'linear-gradient(135deg, #31c4a2, #27a589)' }}
        >
            <h3 className="font-semibold">Additional Monthly Savings Needed</h3>
            <p>{formatCurrency(result.additionalSavings)}</p>
        </div>

        

      </div>
      
    </div>
  );
};

export default FinancialFreedomCalculator;
