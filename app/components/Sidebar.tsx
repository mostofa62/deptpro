"use client";

import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/app/images/logo/logo.svg";

import useAuth from "@/app/hooks/useAuth";
import SidebarLinkGroup from "./SidebarLinkGroup";
import axios from "axios";
import InfoBox from "./InfoBox";
import Setting from "../images/icon/setting";
import CurveUp from "../images/icon/curve-up";
import ProjectionBar from "../images/icon/projection-bar";
import Ordering from "../images/icon/ordering";

const url = process.env.NEXT_PUBLIC_API_URL;

const app_name: any = process.env.app_name;

type TransactionData = {
  debt_total_balance: number;
  month_debt_free: string;
  financial_frdom_date: string;
  financial_frdom_target: number;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  transactionData?: TransactionData;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  transactionData,
}: SidebarProps) => {
  const pathname = usePathname();
  const authCtx = useAuth();
  const router = useRouter();

  let Loguser: any = authCtx.role;
  let urlSuffix =
    Loguser && parseInt(Loguser) < 10 ? "admin-logout" : "member-logout";
  let redirect = Loguser && parseInt(Loguser) < 10 ? "/admin" : "/member";

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  let storedSidebarExpanded: any = null;

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);

    const clickOutsideHandler = (event: MouseEvent) => {
      if (sidebar.current && !sidebar.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", clickOutsideHandler);

    return () => {
      document.removeEventListener("keydown", keyHandler);
      document.removeEventListener("click", clickOutsideHandler);
    };
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const handleClickReload = (e: any, href: string) => {
    e.preventDefault();

    // Force a reload by navigating to the current URL
    router.replace(href);
  };

  const logoutHandler = async () => {
    await axios
      .post(
        `${url}${urlSuffix}`,
        { token: authCtx.token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        authCtx.logout();
        router.push(redirect);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  return (
    <aside
      ref={sidebar}
      style={{ boxShadow: "0px 1px 5px 0px #dbdbdb" }}
      className={`bg-white absolute left-0 top-0 z-9999 flex h-screen w-2/3 md:w-65 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex flex-col md:flex-row py-2 items-center justify-between md:py-2 gap-2 md:px-6">
        {/*
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
        */}
        <Link href={"/member/dashboard"}>
          <Image src={Logo} alt={app_name} className="" height={50} />
        </Link>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6 lg:py-8 min-h-screen">
          {/* <!-- Menu Group --> */}
          <div>
            {/*
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
    */}

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Calendar --> */}

              <li key={1}>
                <Link
                  href={"/member/dashboard"}
                  className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                    pathname.slice(-9) == "dashboard" &&
                    "bg-[#43ACD6] text-[#f5f5f8]"
                  }`}
                >
                  Dashboard
                </Link>
              </li>

              <>
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/income" || pathname.includes("income")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                            (pathname === "/income" ||
                              pathname.includes("income")) &&
                            "bg-[#43ACD6] text-[#f5f5f8]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="">income</span>
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li key={301}>
                              <Link
                                href={"/member/income"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-6) == "income"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={20}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                  />
                                </svg>

                                <p>Income Dashboard</p>
                              </Link>
                            </li>

                            <li key={302}>
                              <Link
                                href={"/member/income/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-9) == "income/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add Income</p>
                              </Link>
                            </li>

                            <li key={303}>
                              <Link
                                href={"/member/income/bst/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-13) == "income/bst/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add Income Boost</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/debts" || pathname.includes("debts")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                            (pathname === "/debts" ||
                              pathname.includes("debts")) &&
                            "bg-[#43ACD6] text-[#f5f5f8]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="">Debt</span>
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li key={101}>
                              <Link
                                href={"/member/debts"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-5) == "debts"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={20}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                  />
                                </svg>

                                <p>Debt Dashboard</p>
                              </Link>
                            </li>

                            <li key={103}>
                              <Link
                                href={"/member/debts/settings"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-8) == "settings"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <Setting width={20} height={20} />

                                <p>Set Debt Budget</p>
                              </Link>
                            </li>

                            <li key={102}>
                              <Link
                                href={"/member/debts/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-8) == "debts/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add a Debt</p>
                              </Link>
                            </li>

                            <li key={109}>
                              <Link
                                href={"/member/debts/paymentboost"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-12) == "paymentboost"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <CurveUp width={20} height={20} />

                                <p>Payment Boost</p>
                              </Link>
                            </li>

                            <li key={104}>
                              <Link
                                href={"/member/debts/payoffstrategy"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-14) == "payoffstrategy"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <ProjectionBar width={20} height={20} />

                                <p>Payoff Strategy</p>
                              </Link>
                            </li>

                            <li key={105}>
                              <Link
                                href={"/member/debts/payoffcustom"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-12) == "payoffcustom"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <Ordering width={20} height={20} />

                                <p>Custom Payoff</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/bills" || pathname.includes("bills")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                            (pathname === "/bills" ||
                              pathname.includes("bills")) &&
                            "bg-[#43ACD6] text-[#f5f5f8]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="">Bills</span>
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li key={211}>
                              <Link
                                href={"/member/bills"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-5) == "bills"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={20}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                  />
                                </svg>

                                <p>Bill Dashboard</p>
                              </Link>
                            </li>

                            <li key={222}>
                              <Link
                                href={"/member/bills/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-8) == "bills/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add a Bill</p>
                              </Link>
                            </li>

                            <li key={228}>
                              <Link
                                href={"/member/bills/billextra"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-15) == "bills/billextra"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Extra Bill Payment </p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/saving" || pathname.includes("saving")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                            (pathname === "/saving" ||
                              pathname.includes("saving")) &&
                            "bg-[#43ACD6] text-[#f5f5f8]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="">Savings</span>
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li key={501}>
                              <Link
                                href={"/member/saving"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-6) == "saving"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={20}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                  />
                                </svg>

                                <p>Savings Dashboard</p>
                              </Link>
                            </li>

                            <li key={502}>
                              <Link
                                href={"/member/saving/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-9) == "saving/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add a Savings</p>
                              </Link>
                            </li>

                            <li key={503}>
                              <Link
                                href={"/member/saving/bst/cu"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out  hover:text-[#43ACD6] ${
                                  pathname.slice(-13) == "saving/bst/cu"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>

                                <p>Add Saving Boost</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                
                
                

                <li key={50}>
                  <Link
                    href={"/member/calender"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-8) == "calender" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    Calender
                  </Link>
                </li>
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/calculator" ||
                    pathname.includes("calculator")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                            (pathname === "/calculator" ||
                              pathname.includes("calculator")) &&
                            "bg-[#43ACD6] text-[#f5f5f8]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <span className="">Calculators</span>
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li key={601}>
                              <Link
                                href={"/member/calculator/fianncialfreedom"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-16) == "fianncialfreedom"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Financial Freedom Calculator</p>
                              </Link>
                            </li>

                            <li key={602}>
                              <Link
                                href={"/member/calculator/savewithdrawlforcast"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-20) == "savewithdrawlforcast"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Savings & Withdrawal Forecaster</p>
                              </Link>
                            </li>

                            <li key={603}>
                              <Link
                                href={"/member/calculator/stockcalculator"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-15) == "stockcalculator"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Stock Calculator</p>
                              </Link>
                            </li>

                            <li key={604}>
                              <Link
                                href={"/member/calculator/cryptoreturn"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-12) == "cryptoreturn"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Crypto Calculator</p>
                              </Link>
                            </li>

                            <li key={605}>
                              <Link
                                href={"/member/calculator/mortgage"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-8) == "mortgage"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Amortization Mortgage & Loan Calculator</p>
                              </Link>
                            </li>

                            <li key={606}>
                              <Link
                                href={"/member/calculator/creditcardpayment"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-17) == "creditcardpayment"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Credit Card Payment Calculator</p>
                              </Link>
                            </li>

                            <li key={607}>
                              <Link
                                href={"/member/calculator/lifeinsurance"}
                                className={`text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out   hover:text-[#43ACD6] ${
                                  pathname.slice(-13) == "lifeinsurance"
                                    ? "text-[#43ACD6]"
                                    : "text-[#4F4F4F]"
                                }`}
                              >
                                <p>Life Insurance Needs Calculator</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                        
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/*
                <li key={51}>
                  <Link
                    href={"/member/calculator"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-9) == "calculator" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    Calculators
                  </Link>
                </li>
                */}

                <li key={52}>
                  <Link
                    href={"/member/trainings"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-9) == "trainings" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    Trainings
                  </Link>
                </li>

                <li key={53}>
                  <Link
                    href={"/member/faq"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-3) == "faq" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    FAQ
                  </Link>
                </li>
                <li key={54}>
                  <Link
                    href={"/member/testimonials"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-12) == "testimonials" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    Testimonials
                  </Link>
                </li>
                <li key={55}>
                  <Link
                    href={"/member/contactus"}
                    className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                      pathname.slice(-9) == "contactus" &&
                      "bg-[#43ACD6] text-[#f5f5f8]"
                    }`}
                  >
                    contact us
                  </Link>
                </li>

                {transactionData && (
                  <li className="md:hidden lg:hidden xl:hidden">
                    <div className="md:hidden lg:hidden xl:hidden flex flex-col px-4 py-1 gap-1 w-full bg-[#43ACD6] rounded-sm">
                      <InfoBox
                        title="DEBT BALANCE"
                        value={Intl.NumberFormat("en-US").format(
                          transactionData.debt_total_balance
                        )}
                        isCurrency
                        iconHeight={0}
                      />
                      <InfoBox
                        title="DEBT FREE DATE"
                        value={transactionData.month_debt_free}
                        iconWidth={0}
                        iconHeight={0}
                      />

                      <InfoBox
                        title="FINANCIAL FREEDOM DATE"
                        value={transactionData.financial_frdom_date}
                        iconHeight={0}
                      />
                      <InfoBox
                        title="FINANCIAL FREEDOM TARGET"
                        value={
                          transactionData.financial_frdom_target > 0
                            ? Intl.NumberFormat("en-US").format(
                                transactionData.financial_frdom_target
                              )
                            : transactionData.financial_frdom_target
                        }
                        isCurrency={transactionData.financial_frdom_target > 0}
                        iconWidth={0}
                        iconHeight={0}
                      />
                    </div>
                  </li>
                )}
              </>
            </ul>

            <ul className="flex items-center justify-center gap-2.5 py-2 capitalize w-full bg-white bg-opacity-60 absolute bottom-0 left-0 rounded-t-lg border-t border-[#A7DAF0] backdrop-blur-md">
              <li key={1}>
                <Link
                  href={"/"}
                  className="flex items-center text-sm font-semibold md:font-medium duration-300 ease-in-out   hover:text-[#43ACD6]"
                >
                  Home
                </Link>
              </li>

              <li key={2}>
                <Link
                  href={"/member/profile"}
                  className="flex items-center text-sm font-semibold md:font-medium duration-300 ease-in-out   hover:text-[#43ACD6]"
                >
                  My Profile
                </Link>
              </li>
              <li key={3}>
                <button
                  onClick={logoutHandler}
                  className="flex items-center text-sm font-semibold md:font-medium duration-300 ease-in-out hover:text-[#43ACD6]"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
