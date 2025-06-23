"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import SavingsWithdrawalForecaster from "../SavingsWithdrawalForecaster";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <SavingsWithdrawalForecaster />
      </div>
    </DefaultLayout>
  );
}
