"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";

import LifeInsuranceCalculator from "../LifeInsuranceCalculator";

export default function Page() {
  return (
    <DefaultLayout>      
      <div className="my-4">
        <LifeInsuranceCalculator />
      </div>
    </DefaultLayout>
  );
}
