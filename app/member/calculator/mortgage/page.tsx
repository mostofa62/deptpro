"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import MortgageCalculator from "../MortgageCalculator";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <MortgageCalculator />
      </div>
    </DefaultLayout>
  );
}
