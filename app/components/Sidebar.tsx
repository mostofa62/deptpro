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
        <Link
          href={
            Loguser && parseInt(Loguser) < 10
              ? "/admin/dashboard"
              : "/member/dashboard"
          }
        >
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
                  href={
                    Loguser && parseInt(Loguser) < 10
                      ? "/admin/dashboard"
                      : "/member/dashboard"
                  }
                  className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                    pathname.slice(-9) == "dashboard" &&
                    "bg-[#43ACD6] text-[#f5f5f8]"
                  }`}
                >
                  Dashboard
                </Link>
              </li>

              {Loguser && parseInt(Loguser) < 10 && (
                <>
                  <li key={20}>
                    <Link
                      href={"/admin/clients"}
                      className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                        pathname.includes("clients") &&
                        "bg-[#43ACD6] text-[#f5f5f8]"
                      }`}
                    >
                      Clients
                    </Link>
                  </li>
                </>
              )}

              {Loguser && parseInt(Loguser) < 2 && (
                <>
                  <li key={21}>
                    <Link
                      href={"/admin/admins"}
                      className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                        pathname.includes("admins") &&
                        "bg-[#43ACD6] text-[#f5f5f8]"
                      }`}
                    >
                      Admins
                    </Link>
                  </li>
                </>
              )}

              {Loguser && parseInt(Loguser) >= 10 && (
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
                                  <svg
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 217.794 217.794"
                                  >
                                    <path
                                      d="M113.595,133.642l-5.932-13.169c5.655-4.151,10.512-9.315,14.307-15.209l13.507,5.118c2.583,0.979,5.469-0.322,6.447-2.904
	l4.964-13.103c0.47-1.24,0.428-2.616-0.117-3.825c-0.545-1.209-1.547-2.152-2.788-2.622l-13.507-5.118
	c1.064-6.93,0.848-14.014-0.637-20.871l13.169-5.932c1.209-0.545,2.152-1.547,2.622-2.788c0.47-1.24,0.428-2.616-0.117-3.825
	l-5.755-12.775c-1.134-2.518-4.096-3.638-6.612-2.505l-13.169,5.932c-4.151-5.655-9.315-10.512-15.209-14.307l5.118-13.507
	c0.978-2.582-0.322-5.469-2.904-6.447L93.88,0.82c-1.239-0.469-2.615-0.428-3.825,0.117c-1.209,0.545-2.152,1.547-2.622,2.788
	l-5.117,13.506c-6.937-1.07-14.033-0.849-20.872,0.636L55.513,4.699c-0.545-1.209-1.547-2.152-2.788-2.622
	c-1.239-0.469-2.616-0.428-3.825,0.117L36.124,7.949c-2.518,1.134-3.639,4.094-2.505,6.612l5.932,13.169
	c-5.655,4.151-10.512,9.315-14.307,15.209l-13.507-5.118c-1.239-0.469-2.615-0.427-3.825,0.117
	c-1.209,0.545-2.152,1.547-2.622,2.788L0.326,53.828c-0.978,2.582,0.322,5.469,2.904,6.447l13.507,5.118
	c-1.064,6.929-0.848,14.015,0.637,20.871L4.204,92.196c-1.209,0.545-2.152,1.547-2.622,2.788c-0.47,1.24-0.428,2.616,0.117,3.825
	l5.755,12.775c0.544,1.209,1.547,2.152,2.787,2.622c1.241,0.47,2.616,0.429,3.825-0.117l13.169-5.932
	c4.151,5.656,9.314,10.512,15.209,14.307l-5.118,13.507c-0.978,2.582,0.322,5.469,2.904,6.447l13.103,4.964
	c0.571,0.216,1.172,0.324,1.771,0.324c0.701,0,1.402-0.147,2.054-0.441c1.209-0.545,2.152-1.547,2.622-2.788l5.117-13.506
	c6.937,1.069,14.034,0.849,20.872-0.636l5.931,13.168c0.545,1.209,1.547,2.152,2.788,2.622c1.24,0.47,2.617,0.429,3.825-0.117
	l12.775-5.754C113.607,139.12,114.729,136.16,113.595,133.642z M105.309,86.113c-4.963,13.1-17.706,21.901-31.709,21.901
	c-4.096,0-8.135-0.744-12.005-2.21c-8.468-3.208-15.18-9.522-18.899-17.779c-3.719-8.256-4-17.467-0.792-25.935
	c4.963-13.1,17.706-21.901,31.709-21.901c4.096,0,8.135,0.744,12.005,2.21c8.468,3.208,15.18,9.522,18.899,17.778
	C108.237,68.434,108.518,77.645,105.309,86.113z M216.478,154.389c-0.896-0.977-2.145-1.558-3.469-1.615l-9.418-0.404
	c-0.867-4.445-2.433-8.736-4.633-12.697l6.945-6.374c2.035-1.867,2.17-5.03,0.303-7.064l-6.896-7.514
	c-0.896-0.977-2.145-1.558-3.47-1.615c-1.322-0.049-2.618,0.416-3.595,1.312l-6.944,6.374c-3.759-2.531-7.9-4.458-12.254-5.702
	l0.404-9.418c0.118-2.759-2.023-5.091-4.782-5.209l-10.189-0.437c-2.745-0.104-5.091,2.023-5.209,4.781l-0.404,9.418
	c-4.444,0.867-8.735,2.433-12.697,4.632l-6.374-6.945c-0.896-0.977-2.145-1.558-3.469-1.615c-1.324-0.054-2.618,0.416-3.595,1.312
	l-7.514,6.896c-2.035,1.867-2.17,5.03-0.303,7.064l6.374,6.945c-2.531,3.759-4.458,7.899-5.702,12.254l-9.417-0.404
	c-2.747-0.111-5.092,2.022-5.21,4.781l-0.437,10.189c-0.057,1.325,0.415,2.618,1.312,3.595c0.896,0.977,2.145,1.558,3.47,1.615
	l9.417,0.403c0.867,4.445,2.433,8.736,4.632,12.698l-6.944,6.374c-0.977,0.896-1.558,2.145-1.615,3.469
	c-0.057,1.325,0.415,2.618,1.312,3.595l6.896,7.514c0.896,0.977,2.145,1.558,3.47,1.615c1.319,0.053,2.618-0.416,3.595-1.312
	l6.944-6.374c3.759,2.531,7.9,4.458,12.254,5.702l-0.404,9.418c-0.118,2.759,2.022,5.091,4.781,5.209l10.189,0.437
	c0.072,0.003,0.143,0.004,0.214,0.004c1.25,0,2.457-0.468,3.381-1.316c0.977-0.896,1.558-2.145,1.615-3.469l0.404-9.418
	c4.444-0.867,8.735-2.433,12.697-4.632l6.374,6.945c0.896,0.977,2.145,1.558,3.469,1.615c1.33,0.058,2.619-0.416,3.595-1.312
	l7.514-6.896c2.035-1.867,2.17-5.03,0.303-7.064l-6.374-6.945c2.531-3.759,4.458-7.899,5.702-12.254l9.417,0.404
	c2.756,0.106,5.091-2.022,5.21-4.781l0.437-10.189C217.847,156.659,217.375,155.366,216.478,154.389z M160.157,183.953
	c-12.844-0.55-22.846-11.448-22.295-24.292c0.536-12.514,10.759-22.317,23.273-22.317c0.338,0,0.678,0.007,1.019,0.022
	c12.844,0.551,22.846,11.448,22.295,24.292C183.898,174.511,173.106,184.497,160.157,183.953z"
                                    />
                                  </svg>

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
                                  <svg
                                    width={20}
                                    height={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                                    />
                                  </svg>

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
                                  <svg
                                    width={20}
                                    height={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                                    />
                                  </svg>

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
                                  <svg
                                    width={20}
                                    height={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                                    />
                                  </svg>

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
                          isCurrency={
                            transactionData.financial_frdom_target > 0
                          }
                          iconWidth={0}
                          iconHeight={0}
                        />
                      </div>
                    </li>
                  )}
                </>
              )}
            </ul>

            <ul className="flex space-x-4 p-2 md:p-0 bg-white absolute bottom-0 md:bottom-5 items-center justify-center">
              <li key={1}>
                <Link
                  href={"/"}
                  className="flex items-center text-sm font-medium duration-300 ease-in-out   hover:text-[#43ACD6]"
                >
                  Home
                </Link>
              </li>

              <li key={2}>
                <Link
                  href={
                    Loguser && parseInt(Loguser) < 10
                      ? "/admin/profile"
                      : "/member/profile"
                  }
                  className="flex items-center text-sm font-medium duration-300 ease-in-out   hover:text-[#43ACD6]"
                >
                  My Profile
                </Link>
              </li>
              <li key={3}>
                <button
                  onClick={logoutHandler}
                  className="flex items-center text-sm font-medium duration-300 ease-in-out hover:text-[#43ACD6]"
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
