import TooltipOne from "@/app/components/ui/TooltipOne";
import React, { useCallback, useEffect, useState } from "react";
import { string } from "yup";
import InputField from "./InputField";
interface LifeInsuranceCalculatorProps {}

interface resulType {
  incomeNeeded: string;
  mortgageResult: string;
  debtsResult: string;
  totalDebts: string;
  finalExpensesResult: string;
  childcareResult: string;
  educationResult: string;
  charityResult: string;
  totalObligations: string;
  savingsResult: string;
  existingInsuranceResult: string;
  liquidAssets: string;
  recommendedCoverage: string;
}

const resultLabel = {
  incomeNeeded: "Income Replacement Needed",
  mortgageResult: "Outstanding Mortgage",
  debtsResult: "Other Debts",
  totalDebts: "Total Debts",
  finalExpensesResult: "Final Expenses",
  childcareResult: "Childcare Costs",
  educationResult: "Education Costs",
  charityResult: "Charitable/Inheritance Amount",
  totalObligations: "Total Financial Obligations",
  savingsResult: "Current Savings",
  existingInsuranceResult: "Existing Life Insurance",
  liquidAssets: "Less Liquid Assets",
  recommendedCoverage: "Recommended Life Insurance Coverage",
};

const LifeInsuranceCalculator: React.FC<LifeInsuranceCalculatorProps> = () => {
  const [inputs, setInputs] = useState({
    annualIncome: 50000,
    yearsNeeded: 20,
    mortgage: 0,
    debts: 100000,
    finalExpenses: 10000,
    childcare: 12000,
    education: 100000,
    charity: 0,
    savings: 50000,
    existingInsurance: 100000,
    inflation: 2.5,
    taxRate: 25,
  });

  const [results, setResults] = useState({
    incomeNeeded: 0,
    mortgageResult: 0,
    debtsResult: 0,
    totalDebts: 0,
    finalExpensesResult: 0,
    childcareResult: 0,
    educationResult: 0,
    charityResult: 0,
    totalObligations: 0,
    savingsResult: 0,
    existingInsuranceResult: 0,
    liquidAssets: 0,
    recommendedCoverage: 0,
  });

  const handleInputChange = (key: string, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const calculateInsurance = useCallback(() => {
    const {
      annualIncome,
      yearsNeeded,
      mortgage,
      debts,
      finalExpenses,
      childcare,
      education,
      charity,
      savings,
      existingInsurance,
      inflation,
      taxRate,
    } = inputs;

    const returnRate = 0.05; // Assuming a constant return rate for simplicity
    const realRate = (1 + returnRate) / (1 + inflation / 100) - 1;
    const presentValueFactor =
      (1 - Math.pow(1 + realRate, -yearsNeeded)) / realRate;
    const incomeNeeded =
      annualIncome * presentValueFactor * (1 / (1 - taxRate / 100));
    const totalDebts = mortgage + debts;
    const childcareCost = childcare * yearsNeeded;
    const totalObligations =
      incomeNeeded +
      totalDebts +
      finalExpenses +
      childcare * yearsNeeded +
      education +
      charity;
    const liquidAssets = savings + existingInsurance;
    const recommendedCoverage = Math.max(0, totalObligations - liquidAssets);

    // Update results state
    setResults({
      incomeNeeded,
      mortgageResult: mortgage,
      debtsResult: debts,
      totalDebts,
      finalExpensesResult: finalExpenses,
      childcareResult: childcareCost,
      educationResult: education,
      charityResult: charity,
      totalObligations,
      savingsResult: savings,
      existingInsuranceResult: existingInsurance,
      liquidAssets,
      recommendedCoverage,
    });
  }, [inputs]);

  useEffect(() => {
    calculateInsurance();
  }, [calculateInsurance]);

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md border  mx-auto">
      <h1 className="text-2xl font-bold text-[#42acd8] mb-4 text-center">
        Life Insurance Needs Calculator
      </h1>
      <p className="text-center">
        Financial security begins by planning for the predictable &
        unpredictable.
      </p>
      <p className="flex items-center justify-center gap-2">
        <span>
          Use this tool to estimate the needs of you and your loved ones.
        </span>
        <TooltipOne
          text={
            <div className="flex flex-col gap-1 items-start justify-center">
              <p className="whitespace-normal leading-normal">
                Disclosure: This is a simple educational tool to assist your
                life insurance needs.
              </p>
              <p className="whitespace-normal leading-normal">
                Your life insurance options will vary by state, carrier, health
                &amp; lifestyle underwriting.
              </p>
              <p className="whitespace-normal leading-normal">
                This is for educational purposes only to be used as a general
                guide.
              </p>
              <p className="whitespace-normal leading-normal">
                We are not tax advisors or legal consultant attorneys.
              </p>
              <p className="whitespace-normal leading-normal">
                Please consult a life &amp; financial advisor for your life
                insurance options.
              </p>
              <p className="whitespace-normal leading-normal">
                Consult a tax advisor, CPA for tax concerns.
              </p>
              <p className="whitespace-normal leading-normal">
                Consult an estate planning attorney for trusts etc.
              </p>
            </div>
          }
        />
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateInsurance();
        }}
        className="space-y-4 mt-5"
      >
        <InputField
          label="How much annual income would your dependents need? ($)"
          id="annualIncome"
          min={0}
          max={500000}
          step={1000}
          value={inputs.annualIncome}
          onChange={(value) => handleInputChange("annualIncome", value)}
        />
        <InputField
          label="How long would they need financial support? (Years)"
          id="yearsNeeded"
          min={0}
          max={50}
          step={1}
          value={inputs.yearsNeeded}
          onChange={(value) => handleInputChange("yearsNeeded", value)}
        />
        <InputField
          label="How much do you owe on your mortgage? ($)"
          id="mortgage"
          min={0}
          max={1000000}
          step={1000}
          value={inputs.mortgage}
          onChange={(value) => handleInputChange("mortgage", value)}
        />
        <InputField
          label="How much total debts do you need to pay off? ($)"
          id="debts"
          min={0}
          max={1000000}
          step={1000}
          value={inputs.debts}
          onChange={(value) => handleInputChange("debts", value)}
        />
        <InputField
          label="Estimate Final Expenses ($)"
          id="finalExpenses"
          min={0}
          max={100000}
          step={1000}
          value={inputs.finalExpenses}
          onChange={(value) => handleInputChange("finalExpenses", value)}
        />
        <InputField
          label="Estimated child care ($)"
          id="childcare"
          min={0}
          max={50000}
          step={500}
          value={inputs.childcare}
          onChange={(value) => handleInputChange("childcare", value)}
        />
        <InputField
          label="Estimate college/post education for your children ($)"
          id="education"
          min={0}
          max={500000}
          step={5000}
          value={inputs.education}
          onChange={(value) => handleInputChange("education", value)}
        />
        <InputField
          label="Would you like to leave something for your heirs or charity? ($)"
          id="charity"
          min={0}
          max={1000000}
          step={1000}
          value={inputs.charity}
          onChange={(value) => handleInputChange("charity", value)}
        />
        <InputField
          label="How much savings do you have? ($)"
          id="savings"
          min={0}
          max={1000000}
          step={1000}
          value={inputs.savings}
          onChange={(value) => handleInputChange("savings", value)}
        />
        <InputField
          label="Enter total coverage amount of existing life insurance ($)"
          id="existingInsurance"
          min={0}
          max={2000000}
          step={10000}
          value={inputs.existingInsurance}
          onChange={(value) => handleInputChange("existingInsurance", value)}
        />
        <InputField
          label="Inflation Rate (between 0% and 50%)"
          id="inflation"
          min={0}
          max={50}
          step={0.1}
          value={inputs.inflation}
          unit="%"
          onChange={(value) => handleInputChange("inflation", value)}
        />
        <InputField
          label="Income Tax Rate - State and Federal (between 0% and 100%)"
          id="taxRate"
          min={0}
          max={100}
          step={0.1}
          value={inputs.taxRate}
          unit="%"
          onChange={(value) => handleInputChange("taxRate", value)}
        />
        <button
          type="submit"
          className="w-full mt-5 py-2 px-4 bg-[#42acd8] text-white font-semibold rounded-lg shadow-md hover:bg-[#42acd8] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Calculate
        </button>
      </form>

      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <tbody>
          {Object.entries(results).map(([key, value]) => (
            <tr key={key}>
              <td
                className={` border-b border-gray-300 px-4 py-2 capitalize ${
                  key == "recommendedCoverage"
                    ? "bg-[#42acd8] font-semibold text-white"
                    : "bg-[#f8f9fa] text-black"
                }`}
              >
                {resultLabel[key as keyof resulType]}
              </td>
              <td
                className={` border-b border-gray-300 px-4 py-2 capitalize ${
                  key == "recommendedCoverage"
                    ? "bg-[#42acd8] font-semibold text-white"
                    : "bg-[#f8f9fa] text-black"
                }`}
              >
                $
                {Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LifeInsuranceCalculator;
