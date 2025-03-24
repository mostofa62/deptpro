"use client";
import FullPageLayout from "@/app/layout/FullPageLayout";
//import Chat from "./components/Chat";
import { useState, useEffect } from "react";
//import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/images/logo/logo.svg";
import {
  Formik,
  Form,
  Field,
  yupToFormErrors,
  validateYupSchema,
} from "formik";
import { useRouter } from "next/navigation";
import axios from "axios";
import loginSchema from "./loginSchema";
//import AuthContext from "@/app/context/auth-context";
//import { Metadata, ResolvingMetadata } from 'next';
import useAuth from "@/app/hooks/useAuth";
import { setCookie } from "cookies-next";
import Link from "next/link";
import Loading from "../images/icon/loading";

/*
export const metadata = {
  title: 'Login',
  description: 'Generated by create next app',
}
*/
const url = process.env.NEXT_PUBLIC_API_URL;
const app_name: any = process.env.app_name;

const Login = () => {
  const authContext = useAuth();
  const isLoggedIn = authContext.isLoggedIn;
  const router = useRouter();

  /*
  useEffect(()=>{
    if(isLoggedIn){
      router.push('/member/dashboard');
    }
  },[isLoggedIn,router])
  
*/

  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(0);
  const [loginMessage, setLoginMessage] = useState("");

  const user = {
    isEmail: "0",
    email: "",
    password: "",
  };

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
  
    try {
      const response = await axios.post(`${url}admin-loginpg`, values.user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.login_status === 1) {
        const expirationTime = new Date(
          new Date().getTime() + +response.data.expiresIn * 1000
        );
  
        authContext.loginAdmin(
          response.data.idToken,
          expirationTime,
          response.data.role,
          response.data.displayName,
          response.data.localId
        );
  
        setCookie("AUTH_DATA", {
          token: response.data.idToken,
          role: response.data.role,
        });
  
        setLoginStatus(response.data.login_status);
        setLoginMessage("");
        router.push("/admin/dashboard");
      } else {
        setLoginStatus(response.data.login_status);
        setLoginMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      setLoginStatus(0);
  
      if (error.response) {
        // Server responded with error status (e.g., 401, 500)
        setLoginMessage(
          error.response.data?.message || "Something went wrong. Please try again later."
        );
      } else if (error.request) {
        // Request was made but no response received (API server might be down)
        setLoginMessage(
          "Server is not responding. Please check your internet connection or try again later."
        );
      } else {
        // Something unexpected happened
        setLoginMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <FullPageLayout>
      <div className="sm:flex sm:items-center sm:justify-center p-1.5">
        <div className="lmd:h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] flex items-stretch sm:rounded-[50px] sm:my-[5%]  sm:shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          <div className="hidden lmd:block lg:block w-full xl:block xl:w-1/2 rounded-l-[50px]">
            <div className="flex h-full items-center justify-center px-10">
              <div className="h-65 w-65  rounded-full flex items-center justify-center bg-white">
                <a href="/">
                  <Image src={Logo} alt={app_name} height={100} />
                </a>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex sm:bg-[#E69A52] sm:w-1.5 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="absolute mt-5 px-5 py-2 rounded-r-[50px] text-white capitalize font-semibold bg-[#43ACD6] ring-1 shadow">
              welcome back, admin
            </div>
            <div className="hidden text-[#E69A52] w-1.5"></div>
          </div>

          <div className="w-full xl:w-1/2 bg-white h-[calc(100vh-4rem)] sm:h-auto rounded-xl sm:rounded-l-none  sm:rounded-r-[50px] md:rounded-r-[50px] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col items-center sm:mt-8 gap-2.5 sm:gap-1 w-full  sm:p-10.5 xl:p-12.5">
              <div className="sm:hidden w-full rounded-md flex items-center justify-center h-40 bg-[#43ACD6]">
                <div className="h-35 w-35  rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                  <a href="/">
                    <Image src={Logo} alt={app_name} height={100} />
                  </a>
                </div>
              </div>

              <h2 className="capitalize text-center font-bold text-[18px] sm:text-md mt-8 lmd:mt-18 sm:mt-0 text-[#43ACD6]">
                Sign In
              </h2>
              <div className="h-6 lmd:my-3">
                {(loginStatus > 1 || loginStatus < 1) && (
                  <span className="mb-3 font-semibold text-[#B45454]">
                    {loginMessage}
                  </span>
                )}
              </div>

              <Formik
                initialValues={{ user }}
                validationSchema={loginSchema}
                onSubmit={handleFormSubmit}
                render={({
                  isValid,
                  handleChange,
                  isSubmitting,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setFieldTouched,
                }) => (
                  <Form className="mt-3 flex flex-col w-full px-2 sm:px-0 sm:w-auto gap-4 sm:gap-2.5 lmd:gap-5">
                    <div className="">
                      {/* <label className="mb-2.5 block font-medium">Email</label> */}
                      <div className="relative">
                        <div className="flex flex-col gap-2">
                          <Field
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-2 pr-10 outline-none focus:border-[#43ACD6] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#43ACD6]"
                            name="user.email"
                            placeholder="Email"
                          />
                          <div className="h-6">
                            {errors.user &&
                              errors.user.email &&
                              touched.user &&
                              touched.user.email && (
                                <span className="font-semibold text-[#B45454] capitalize">
                                  {errors.user.email}
                                </span>
                              )}
                          </div>
                        </div>

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                fill="#0a4a82"
                              />
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="">
                      {/* <label className="mb-2.5 block font-medium">
                        Password
                      </label> */}
                      <div className="relative">
                        <div className="flex flex-col gap-2">
                          <Field
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-2 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#43ACD6]"
                            type="password"
                            name="user.password"
                            placeholder="Password"
                          />
                          <div className="h-6">
                            {errors.user &&
                              errors.user.password &&
                              touched.user &&
                              touched.user.password && (
                                <span className="font-semibold text-[#B45454] capitalize">
                                  {errors.user.password}
                                </span>
                              )}
                          </div>
                        </div>

                        <span className="absolute right-4 top-4">
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                fill="#0a4a82"
                              />
                              <path
                                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                fill="#0a4a82"
                              />
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 lmd:mt-8 sm:mt-0">
                      <button
                        type="submit"
                        className="text-[18px] sm:text-md flex justify-center items-center gap-1 w-full cursor-pointer rounded-lg border  bg-[#43ACD6] p-4 text-[#f5f5f8] transition hover:bg-opacity-90 md:font-bold"
                      >
                        {loading ? (
                          <Loading width={50} stroke="#E69A52" />
                        ) : (
                          <span className="capitalize">login</span>
                        )}
                      </button>
                      {/* <input
                                        type="submit"
                                        value="Sign In"
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-[#0a4a82] p-4 text-[#f5f5f8] transition hover:bg-opacity-90 md:font-bold"
                                      /> */}
                    </div>
                  </Form>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </FullPageLayout>
  );
};
/*
export async function generateMetadata() {
  // read route params then fetch data

  // return an object
  return {
    title: 'Login',
    //description: '',
  };
}
*/

export default Login;
