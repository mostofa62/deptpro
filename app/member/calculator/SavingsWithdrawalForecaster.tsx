import React, { useState } from "react";
import InputField from "./InputField";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatLargeNumber } from "@/app/components/utils/Util";

// const CustomTooltipBar = ({ payload }: any) => {
//   if (payload && payload.length) {
//     const data = payload[0].payload; // Get the hovered data from payload
//     const fillColor = payload[0].fill; // Get the fill color of the hovered bar
//     const barName = payload[0].name; // Get the name of the hovered bar
//     const value = payload[0].value; // Get the value of the hovered bar

//     return (
//       <div style={{
//         color: '#ffffff',
//         backgroundColor: '#800080',
//         border: '1px solid #4f4f4f',
//         borderRadius: '5px',
//         padding: '8px',
//         fontSize: '14px',
//         minWidth: '120px'
//       }}>
//         <p><strong>{barName}</strong></p>
//         <p>
//           Value: {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}
//         </p>
//         <p>Color: <span style={{ color: fillColor }}>{fillColor}</span></p>
//       </div>
//     );
//   }

//   return null;
// };

const CustomTooltipBar = ({ payload, hoveredBar }: any) => {
  if (!payload || !payload.length || !hoveredBar) return null; // Hide tooltip if no hover

  const data = payload.find((p: any) => p.dataKey === hoveredBar); // Find hovered bar data
  if (!data) return null;

  return (
    <div style={{
      color: '#ffffff',
      backgroundColor: data.fill,
      border: '1px solid #4f4f4f',
      borderRadius: '5px',
      padding: '8px',
      fontSize: '14px',
      minWidth: '120px'
    }}>
      <p><strong>{data.name}</strong></p>
      <p>Value: ${Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.value)}</p>
      
    </div>
  );
};



const CustomBar = (props: any) => {
      const { fill, x, y, width, height, value } = props;
  
      const valueString = `$${formatLargeNumber(value)}`;
      const labelPadding = 10; // Space between the bar and the label
 

      return (
          <g>
              {/* Draw the bar */}
              <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  tabIndex={-1} // Prevent focus
                  style={{
                      outline: "none", // Remove any focus outline
                      transition: "none", // Remove hover transition effect
                  }}
              />
              {/* Add the rotated label above the bar */}
              <text
                  x={width/2+x-20}
                  y={y + 25}
                  textAnchor="top" // Center-align the text horizontally
                  fill="#fffff" // Text color
                  fontSize={12} // Font size
                  fontWeight="700" // Text styling
                   // Rotate around the label's position
              >
                  {valueString}
              </text>
          </g>
      );
  };

type InputsState = {
    existingBalance: number;
    newContributions: number;
    yearsContribute: number;
    annualReturn: number;
    inflation: number;
    yearsWithdraw: number;
    taxDuringContributions: number;
    taxDuringWithdrawals: number;
    contributionFrequency: "Monthly" | "Quarterly" | "Annually";
    withdrawalFrequency: "Monthly" | "Quarterly" | "Annually";
  };
  
  type AccountData = {
    year: number;
    balance: string;
  };
  
  type WithdrawalData = {
    year: number;
    withdrawal: string;
  };

  interface WithdrawalAll{
    taxedAccount:{ data: AccountData[]; finalBalance: number; }
    deferredAccount:{ data: AccountData[]; finalBalance: number; }
    freeAccount:{ data: AccountData[]; finalBalance: number; }
    taxedWithdrawal:WithdrawalData[];
    deferredWithdrawal: WithdrawalData[];
    freeWithdrawal: WithdrawalData[];
  }

  

const SavingsWithdrawalForecaster: React.FC = () => {

  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const handleMouseEnter = (e: any, barName: string) => {
    setHoveredBar(barName);
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
  };
  

  const [inputs, setInputs] = useState<InputsState>({
    existingBalance: 25000,
    newContributions: 500,
    yearsContribute: 20,
    annualReturn: 8,
    inflation: 2,
    yearsWithdraw: 10,
    taxDuringContributions: 25,
    taxDuringWithdrawals: 15,
    contributionFrequency: "Monthly",
    withdrawalFrequency: "Monthly",
  });

  const handleInputChange = (field: string, value: number) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [field]: value,
    }));
  };

  const [resultWithDraw, setResultWithDraw] = useState<WithdrawalAll>({
    taxedAccount:{ data: [], finalBalance: 0 },
    deferredAccount:{ data: [], finalBalance: 0 },
    freeAccount:{ data: [], finalBalance: 0 },
    taxedWithdrawal: [],
    deferredWithdrawal: [],
    freeWithdrawal: [],
  });

  const calculateSavings = (inputs: InputsState) => {
    const {
      existingBalance,
      newContributions,
      yearsContribute,
      annualReturn,
      inflation,
      yearsWithdraw,
      taxDuringContributions,
      taxDuringWithdrawals,
      contributionFrequency,
      withdrawalFrequency,
    } = inputs;

    const annualReturnP  = annualReturn / 100;
    const inflationP = inflation / 100;
    const taxDuringContributionsP = taxDuringContributions/ 100; 
    const taxDuringWithdrawalsP = taxDuringWithdrawals/ 100;
  
    // Adjust the annual return rate for inflation
    const realAnnualReturn = (1 + annualReturnP) / (1 + inflationP) - 1;
  
    // Calculate different account balances
    const taxedAccount = calculateAccount(
      existingBalance,
      newContributions,
      yearsContribute,
      realAnnualReturn,
      taxDuringContributionsP,
      "taxed",
      contributionFrequency
    );
  
    const deferredAccount = calculateAccount(
      existingBalance,
      newContributions,
      yearsContribute,
      realAnnualReturn,
      taxDuringContributionsP,
      "deferred",
      contributionFrequency
    );
  
    const freeAccount = calculateAccount(
      existingBalance,
      newContributions,
      yearsContribute,
      realAnnualReturn,
      0,
      "free",
      contributionFrequency
    );
  
    // Calculate withdrawals for each account
    const taxedWithdrawal = calculateWithdrawal(
      taxedAccount.finalBalance,
      yearsWithdraw,
      realAnnualReturn,
      taxDuringWithdrawalsP,
      "taxed",
      withdrawalFrequency
    );
  
    const deferredWithdrawal = calculateWithdrawal(
      deferredAccount.finalBalance,
      yearsWithdraw,
      realAnnualReturn,
      taxDuringWithdrawalsP,
      "deferred",
      withdrawalFrequency
    );
  
    const freeWithdrawal = calculateWithdrawal(
      freeAccount.finalBalance,
      yearsWithdraw,
      realAnnualReturn,
      0,
      "free",
      withdrawalFrequency
    );
  
    return {
      taxedAccount,
      deferredAccount,
      freeAccount,
      taxedWithdrawal,
      deferredWithdrawal,
      freeWithdrawal,
    };
  };
  
  const calculateAccount = (
    initialBalance: number,
    contribution: number,
    years: number,
    returnRate: number,
    taxRate: number,
    accountType: "taxed" | "deferred" | "free",
    frequency: "Monthly" | "Quarterly" | "Annually"
  ) => {
    const contributionMultiplier =
      frequency === "Monthly" ? 12 : frequency === "Quarterly" ? 4 : 1;
    const adjustedContribution = contribution * contributionMultiplier;
    let balance = initialBalance;
    const data: AccountData[] = [];
  
    for (let year = 0; year <= years; year++) {
      data.push({
        year,
        balance: balance.toFixed(2),
      });
  
      if (year < years) {
        const growth = balance * returnRate;
        const taxOnGrowth = accountType === "taxed" ? growth * taxRate : 0;
        balance += growth - taxOnGrowth + adjustedContribution;
      }
    }
  
    return { data, finalBalance: balance };
  };
  
  const calculateWithdrawal = (
    initialBalance: number,
    years: number,
    returnRate: number,
    taxRate: number,
    accountType: "taxed" | "deferred" | "free",
    frequency: "Monthly" | "Quarterly" | "Annually"
  ): WithdrawalData[] => {
    const withdrawalMultiplier =
      frequency === "Monthly" ? 12 : frequency === "Quarterly" ? 4 : 1;
    const data: WithdrawalData[] = [];
    let balance = initialBalance;
    const annualWithdrawal = balance / (years * withdrawalMultiplier);
  
    for (let year = 1; year <= years; year++) {
      const totalWithdrawal = annualWithdrawal * withdrawalMultiplier;
      const taxOnWithdrawal =
        accountType === "taxed" || accountType === "deferred"
          ? totalWithdrawal * taxRate
          : 0;
      const netWithdrawal = totalWithdrawal - taxOnWithdrawal;
  
      data.push({
        year,
        withdrawal: netWithdrawal.toFixed(2),
      });
  
      balance -= totalWithdrawal;
      balance += balance * returnRate;
    }
  
    return data;
  };

  
  

  const calculateResults = () => {
    const calsaving:WithdrawalAll =  calculateSavings(inputs);
    //console.log(calsaving)
    setResultWithDraw({
      taxedAccount:calsaving.taxedAccount,
      deferredAccount:calsaving.deferredAccount,
      freeAccount:calsaving.freeAccount,
      taxedWithdrawal:calsaving.taxedWithdrawal,
      deferredWithdrawal:calsaving.deferredWithdrawal,
      freeWithdrawal:calsaving.freeWithdrawal
    })
  };

  // const chartData = [
  //   {
  //     name: 'Annual Taxed Account',
  //     balance: resultWithDraw.taxedAccount.finalBalance,
  //     fill: 'rgba(255, 159, 0, 0.7)',
  //   },
  //   {
  //     name: 'Tax-Deferred Account',
  //     balance: resultWithDraw.deferredAccount.finalBalance,
  //     fill: 'rgba(66, 172, 216, 0.7)',
  //   },
  //   {
  //     name: 'Tax-Free Account',
  //     balance: resultWithDraw.freeAccount.finalBalance,
  //     fill: 'rgba(49, 196, 162, 0.7)',
  //   },
  // ];

  const chartData = [
    {
      name: 'Final Balance',
      taxedBalance: resultWithDraw.taxedAccount.finalBalance,
      deferredBalance: resultWithDraw.deferredAccount.finalBalance,
      freeBalance: resultWithDraw.freeAccount.finalBalance,
    },
  ];

  const withdrawalChartData=[

    {
      name: 'Final Withdrawal',
      taxedWithdrawal: resultWithDraw.taxedWithdrawal,
      deferredBalance: resultWithDraw.deferredAccount.finalBalance,
      freeBalance: resultWithDraw.freeAccount.finalBalance,
    },
    
  ]

  

  return (
    <div className="p-6 mx-auto rounded-md shadow-md border">
      <h1 className="text-2xl font-bold text-[#42acd8] mb-4 text-center">
        Savings and Withdrawal Forecaster
      </h1>
      <div className="gap-1">
        <InputField
          label="Existing Balance ($)"
          id="existingBalance"
          min={0}
          max={1000000000}
          step={0.01}
          value={inputs.existingBalance}
          onChange={(value) => handleInputChange("existingBalance", value)}
        />
        <InputField
          label="New Contributions ($)"
          id="newContributions"
          min={0}
          max={1000000}
          step={0.01}

          value={inputs.newContributions}
          onChange={(value) => handleInputChange("newContributions", value)}
          
        />

        <div className="flex flex-col space-y-2 mb-6">
        <label htmlFor="contributionFrequency" className="text-sm font-medium text-gray-700">
            Contribution Frequency
        </label>
        <select
            id="contributionFrequency"
            value={inputs.contributionFrequency}
            onChange={(e:any) => handleInputChange("contributionFrequency", e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
        >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
        </select>
        </div>


        <InputField
          label="Years to Contribute"
          id="yearsContribute"
          min={1}
          max={100}
          step={1}

          value={inputs.yearsContribute}
          onChange={(value) => handleInputChange("yearsContribute", value)}
                    
        />
        <InputField
          label="Annual Return (%)"
          id="annualReturn"
          min={0}
          max={20}
          step={0.1}
          value={inputs.annualReturn}
          onChange={(value) => handleInputChange("annualReturn", value)}
         
        />
        <InputField
          label="Inflation Rate (%)"
          id="inflation"
          min={0}
          max={100}
          step={0.1}
          value={inputs.inflation}
          onChange={(value) => handleInputChange("inflation", value)}
        />
        <InputField
          label="Years of Withdrawals"
          id="yearsWithdraw"
          min={1}
          max={100}
          step={1}
          value={inputs.yearsWithdraw}
          onChange={(value) => handleInputChange("yearsWithdraw", value)}
        />


        <div className="flex flex-col space-y-2 mb-6">
        <label htmlFor="withdrawalFrequency" className="text-sm font-medium text-gray-700">
            Withdrawal Frequency
        </label>
        <select
            id="withdrawalFrequency"
            value={inputs.withdrawalFrequency}
            onChange={(e:any) => handleInputChange("withdrawalFrequency", e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
        >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
        </select>
        </div>

        <InputField
          label="Tax During Contributions (%)"
          id="taxDuringContributions"
          min={0}
          max={90}
          step={0.1}
          value={inputs.taxDuringContributions}
          onChange={(value) => handleInputChange("taxDuringContributions", value)}
        />
        <InputField
          label="Tax During Withdrawals (%)"
          id="taxDuringWithdrawals"
          min={0}
          max={90}
          step={0.1}
          value={inputs.taxDuringWithdrawals}
          onChange={(value) => handleInputChange("taxDuringWithdrawals", value)}
        />

        <div className="flex justify-center gap-3">
            <button
               onClick={calculateResults}
                className="px-4 py-2 w-[50%] bg-[#42acd8] text-white rounded-md hover:bg-[#3798c0]"
            >
                Calculate Savings and Withdrawals
            </button>

        </div>
      </div>


      <h2 className="bg-[#e6e6e6] text-lg font-semibold text-center p-3 my-4 text-[#4a4a4a]">Savings Growth</h2>

      <div className="p-1">

      <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}
      
      margin={{
        top: 0 ,
        right: 0,
        left: 0,
        bottom: 0,
        }}>
        
        <XAxis 
        dataKey="name" 
        tickLine={false} 
        axisLine={false}  
        />
        <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`}/>
     
        <Tooltip content={<CustomTooltipBar hoveredBar={hoveredBar} />} cursor={{ fill: "transparent" }} />
        <Legend iconType={"star"} // Square icon for legend
          layout="horizontal"/>
        <Bar
          dataKey="taxedBalance"
          fill="rgba(255, 159, 0, 0.7)"
          name="Annual Taxed Account"
          
          shape={<CustomBar/>} 
          key="taxedBalanceBar"
          onMouseEnter={(e) => handleMouseEnter(e, "taxedBalance")}
          onMouseLeave={handleMouseLeave}
         
        />
        <Bar
          dataKey="deferredBalance"
          fill="rgba(66, 172, 216, 0.7)"
          name="Tax-Deferred Account"
          
          shape={<CustomBar/>} 
          key="deferredBalanceBar"

          onMouseEnter={(e) => handleMouseEnter(e, "deferredBalance")}
          onMouseLeave={handleMouseLeave}
        />
        <Bar
          dataKey="freeBalance"
          fill="rgba(49, 196, 162, 0.7)"
          name="Tax-Free Account"
          
          shape={<CustomBar/>}
          key="freeBalanceBar"
          onMouseEnter={(e) => handleMouseEnter(e, "freeBalance")}
          onMouseLeave={handleMouseLeave}
        />
        
      </BarChart>
    </ResponsiveContainer>

      </div>


      <div className="gap-1">
        <table className="table-auto border-collapse border border-gray-300 w-full mt-4 text-left"> 
          <tr className="bg-[#f2f2f2] font-bold text-sm">
            <th className="p-2 border-[1px] border-[#ddd]">Year</th>
            <th className="p-2 border-[1px] border-[#ddd]">Annual Taxed Account</th>
            <th className="p-2 border-[1px] border-[#ddd]">Tax-Deferred Account</th>
            <th className="p-2 border-[1px] border-[#ddd]">Tax-Free Account</th>
          </tr>

          {
            resultWithDraw.taxedAccount.data.map((row, index) =>(

              <tr key={index} style={{ backgroundColor: index %2==0 ? '#f9f9f9':'#ffffff'}}>
                <td className="p-2 border-[1px] border-[#ddd]">{row.year}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.taxedAccount.data[index].balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.deferredAccount.data[index].balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.freeAccount.data[index].balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))
          }

          </table>
      </div>


      <h2 className="bg-[#e6e6e6] text-lg font-semibold text-center p-3 my-4 text-[#4a4a4a]">Withdrawal Amounts</h2>

      
      <div className="p-1">

<ResponsiveContainer width="100%" height={300}>
<BarChart data={chartData}

margin={{
  top: 0 ,
  right: 0,
  left: 0,
  bottom: 0,
  }}>
  
  <XAxis 
  dataKey="name" 
  tickLine={false} 
  axisLine={false}  
  />
  <YAxis tick={{ fontSize:12 }} tickFormatter={(value) => `$${formatLargeNumber(value)}`}/>

  <Tooltip content={<CustomTooltipBar hoveredBar={hoveredBar} />} cursor={{ fill: "transparent" }} />
  <Legend iconType={"star"} // Square icon for legend
    layout="horizontal"/>
  <Bar
    dataKey="taxedBalance"
    fill="rgba(255, 159, 0, 0.7)"
    name="Annual Taxed Account"
    
    shape={<CustomBar/>} 
    key="taxedBalanceBar"
    onMouseEnter={(e) => handleMouseEnter(e, "taxedBalance")}
    onMouseLeave={handleMouseLeave}
   
  />
  <Bar
    dataKey="deferredBalance"
    fill="rgba(66, 172, 216, 0.7)"
    name="Tax-Deferred Account"
    
    shape={<CustomBar/>} 
    key="deferredBalanceBar"

    onMouseEnter={(e) => handleMouseEnter(e, "deferredBalance")}
    onMouseLeave={handleMouseLeave}
  />
  <Bar
    dataKey="freeBalance"
    fill="rgba(49, 196, 162, 0.7)"
    name="Tax-Free Account"
    
    shape={<CustomBar/>}
    key="freeBalanceBar"
    onMouseEnter={(e) => handleMouseEnter(e, "freeBalance")}
    onMouseLeave={handleMouseLeave}
  />
  
</BarChart>
</ResponsiveContainer>

</div>




      <div className="gap-1">
        <table className="table-auto border-collapse border border-gray-300 w-full mt-4 text-left"> 
          <tr className="bg-[#f2f2f2] font-bold text-sm">
            <th className="p-2 border-[1px] border-[#ddd]">Year</th>
            <th className="p-2 border-[1px] border-[#ddd]">Annual Taxed Account Withdrawal</th>
            <th className="p-2 border-[1px] border-[#ddd]">Tax-Deferred Account Withdrawal</th>
            <th className="p-2 border-[1px] border-[#ddd]">Tax-Free Account Withdrawal</th>
          </tr>

          {
            resultWithDraw.taxedWithdrawal.map((row, index) =>(

              <tr key={index} style={{ backgroundColor: index %2==0 ? '#f9f9f9':'#ffffff'}}>
                <td className="p-2 border-[1px] border-[#ddd]">{row.year}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.taxedWithdrawal[index].withdrawal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.deferredWithdrawal[index].withdrawal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-2 border-[1px] border-[#ddd]">${parseFloat(resultWithDraw.freeWithdrawal[index].withdrawal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))
          }

          </table>
      </div>
      
    </div>
  );
};

export default SavingsWithdrawalForecaster;
