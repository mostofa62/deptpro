"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import Script from "next/script";
import useAuth from "@/app/hooks/useAuth";
import { useCallback, useEffect, useRef, useState } from "react";
import HolderOne from "@/app/layout/HolderOne";
import BasicCalendar from "@/app/components/BasicCalender";
import moment from "moment";
import AdvancedCalendar from "@/app/components/AdvancedCalender";
import axios from "axios";
import Link from "next/link";

const url = process.env.NEXT_PUBLIC_API_URL;

type InputItem = {
  _id: string;
  event_date: string;
  module_id: string;
  module_name: string;
  month: string;
  month_word: string;
  data: {
    data_id: string;
    description: string;
    name: string;
  };
};

type ExtraDayDataItem = {
  date: string;
  title: any;
  description: any;
};

const RouteModule: any = {
  bill: "/member/bills/",
  debt: "/member/debts/",
  income: "/member/income/",
  saving: "/member/saving/",
};

export default function CalenderPage() {
  const authCtx = useAuth();

  const userid: any = authCtx.userId;

  const currentDate = moment().format("YYYY-MM-DD");

  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));

  const [monthData, setMonthData] = useState<ExtraDayDataItem[]>([]);

  const module_wise_color: any = {
    bill: { bg: "bg-[#FF6347] text-white", txt: "text-[#FF6347]" },
    debt: { bg: "bg-[#FF8C00] text-white", txt: "text-[#FF8C00]" },
    income: { bg: "bg-[#4169E1] text-white", txt: "text-[#4169E1]" },
    saving: { bg: "bg-[#228B22] text-white", txt: "text-[#228B22]" },
  };

  function formattedTitle(module_id: string, title: string, data_id: string) {
    let url: string = RouteModule[module_id];

    return (
      <Link
        className={`${module_wise_color[module_id].txt}`}
        href={`${url}${data_id}`}
      >
        {title}
      </Link>
    );
  }

  const formatData = useCallback(
    (
      inputArray: {
        event_date: string;
        module_id: string;
        module_name: string;
        data: {
          data_id: string;
          name: string;
          description: string;
        };
        month_word: string;
      }[]
    ): { date: string; title: JSX.Element; description: string }[] => {
      return inputArray.map((item) => ({
        date: item.event_date,
        title: formattedTitle(
          item.module_id,
          `${item.module_name} : ${item.data.name}`,
          item.data.data_id
        ),
        description: `${item.data.description} at ${item.month_word}`,
      }));
    },
    []
  );

  const fetchDataCallback = useCallback(async () => {
    const urlSuffix = `calender-data/${userid}/${currentMonth}`;
    //console.log(id);
    const response = await axios.get(`${url}${urlSuffix}`);

    const inputArray: InputItem[] = response.data.rows;

    //console.log(inputArray)

    const formattedArray = formatData(inputArray);
    //console.log(response.data)
    //return response.data.user;
    setMonthData(formattedArray);
  }, [currentMonth, formatData, userid]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const onChangeMonth = (month: any) => {
    setCurrentMonth(month.format("YYYY-MM"));
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col">
        <HolderOne
          title="calender"
          linkItems={
            [
              //   {
              //     link:'/',
              //     title:''
              //   },
            ]
          }
        />

        <div className="mt-3 bg-[#fafafa] rounded-lg p-5">
          {/* {currentMonth} */}
          <AdvancedCalendar
            extraDayData={monthData}
            onChangeMonth={onChangeMonth}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
