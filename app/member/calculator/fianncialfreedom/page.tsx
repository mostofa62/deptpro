"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import FinancialFreedomCalculator from "../FinancialFreedomCalculator";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <FinancialFreedomCalculator />
      </div>
    </DefaultLayout>
  );
}
