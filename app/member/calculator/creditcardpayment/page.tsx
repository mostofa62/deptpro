"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import HolderOne from "@/app/layout/HolderOne";
import CreditCardCalculator from "../CreditCardPaymentCalculator";

export default function Page() {
  return (
    <DefaultLayout>
      <div className="flex flex-col">
        <HolderOne
          title="calculators"
          linkItems={
            [
              //   {
              //     link:'/',
              //     title:''
              //   },
            ]
          }
        />
      </div>
      <div className="my-4">
        <CreditCardCalculator />
      </div>
    </DefaultLayout>
  );
}
