import React, { useState } from "react";
import InputField from "./InputField";

const SavingsWithdrawalForecaster: React.FC = () => {
  const [existingBalance, setExistingBalance] = useState(25000);
  const [newContributions, setNewContributions] = useState(500);
  const [yearsContribute, setYearsContribute] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [inflation, setInflation] = useState(2);
  const [yearsWithdraw, setYearsWithdraw] = useState(10);
  const [taxDuringContributions, setTaxDuringContributions] = useState(25);
  const [taxDuringWithdrawals, setTaxDuringWithdrawals] = useState(15);

  const [inputs, setInputs] = useState({
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
  

  const calculateResults = () => {
    const results = {
      futureBalance: existingBalance * Math.pow(1 + annualReturn / 100, yearsContribute),
      inflationAdjusted:
        existingBalance * Math.pow(1 + (annualReturn - inflation) / 100, yearsContribute),
    };
    return results;
  };

  const { futureBalance, inflationAdjusted } = calculateResults();

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
               
                className="px-4 py-2 w-[50%] bg-[#42acd8] text-white rounded-md hover:bg-[#3798c0]"
            >
                Calculate Savings and Withdrawals
            </button>

        </div>
      </div>
      <div className="mt-8 p-6 border-t">
        <h2 className="text-xl font-semibold">Results</h2>
        <p className="mt-4">Future Balance: ${futureBalance.toFixed(2)}</p>
        <p>Inflation-Adjusted Balance: ${inflationAdjusted.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SavingsWithdrawalForecaster;
