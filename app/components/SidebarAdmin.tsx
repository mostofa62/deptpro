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

const SidebarAdmin = ({
  sidebarOpen,
  setSidebarOpen,
  transactionData,
}: SidebarProps) => {
  const pathname = usePathname();
  const authCtx = useAuth();
  const router = useRouter();

  let Loguser: any = authCtx.adminRole;
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
        authCtx.logoutAdmin();
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
        
        <Link
          href={
           "/admin/dashboard"             
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
                    "/admin/dashboard"                     
                  }
                  className={`capitalize text-sm group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#43ACD6] duration-300 ease-in-out hover:bg-[#43ACD6] hover:text-[#f5f5f8] dark:hover:bg-meta-4 ${
                    pathname.slice(-9) == "dashboard" &&
                    "bg-[#43ACD6] text-[#f5f5f8]"
                  }`}
                >
                  Dashboard
                </Link>
              </li>

             
                  <li key={2}>
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
                  href={
                    "/admin/profile"
                     
                  }
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

export default SidebarAdmin;
