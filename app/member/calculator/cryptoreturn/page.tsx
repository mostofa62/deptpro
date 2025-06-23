"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import CryptoReturnCalculator from "../CryptoReturnCalculator";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <CryptoReturnCalculator />
      </div>
    </DefaultLayout>
  );
}
