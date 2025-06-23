"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import StockCStockCalculator from "../StockCalculator";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <StockCStockCalculator />
      </div>
    </DefaultLayout>
  );
}
