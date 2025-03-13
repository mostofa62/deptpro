"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Field, Formik } from "formik";
import {
  DataSchema,
  DataLabel,
  ValidationSchema,
} from "./DataValidationSchema";

import FormikFormHolder from "@/app/components/form/FormikFormHolder";

import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";

import toast from "react-hot-toast";
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import Image from "next/image";
import FormikCheckInput from "@/app/components/form/FormikCheckInput";
import VideoComponent from "@/app/components/utils/VideoComponent";
import HolderOne from "@/app/layout/HolderOne";
import DashGrid from "@/app/images/icon/dash-grid";
import useFetchDropDownObjects from "@/app/hooks/useFetchDropDownObjects";

const url = process.env.NEXT_PUBLIC_API_URL;

interface optionFreq {
  value: string | number;
  label: string;
}
interface BillTypePayloads {
  bill_types: any[];
  repeat_frequency: optionFreq[];
  reminder_days: optionFreq[];
}

export default function InsuranceCreate() {
  const authCtx = useAuth();
  const router = useRouter();
  const formRef = useRef<any>(null);

  const [fetchFomrData, setFetchFormData] = useState(DataSchema);

  const user_id = authCtx.userId;
  const admin_id = authCtx.adminId;

  const payload: BillTypePayloads = {
    bill_types: [],
    repeat_frequency: [],
    reminder_days: [],
  };

  const billTypeData: any = useFetchDropDownObjects({
    urlSuffix: `billtype-dropdownpg/${user_id}`,
    payLoads: payload,
  });

  const fetchdata = fetchFomrData;

  const handleFormSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    //alert(JSON.stringify(values));

    await axios
      .post(
        `${url}save-bill-accountpg`,
        { user_id,admin_id, ...values.fetchdata },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        //console.log(response);

        if (response.data.result > 0) {
          setSubmitting(false);
          toast.success(response.data.message);
          //resetForm();
          router.push("/member/bills");
        } else {
          setSubmitting(true);
          toast.error(response.data.message);
        }
      })
      .catch(function (error) {
        toast.error(error);
        //console.log(error);
      });
  };

  const handleSubmit = () => {
    formRef.current?.handleSubmit();
  };

  return (
    <>
      <DefaultLayout>
        <div className="flex flex-col">
          <HolderOne
            title="add bill"
            linkItems={[
              {
                link: "/member/bills",
                title: "your bill dashboard",
                icon: <DashGrid width={16} height={16} />,
              },
            ]}
          />

          <div className="lmd:mt-3 md:mt-[32px]">
            <Formik
              innerRef={formRef}
              initialValues={{ fetchdata }}
              validationSchema={ValidationSchema}
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
                <FormikFormHolder>
                  <div className="flex flex-col lmd:flex-row md:flex-row">
                    <div className="hidden lmd:hidden lmd:w-0 md:w-[35%] md:flex justify-center items-center">
                      <div>
                        <VideoComponent
                          src="/animated/billentry.mp4"
                          width={`350`}
                          controls={false} // Disable default video controls (optional)
                          autoplay={true}
                          loop={true}
                          showControls={false}
                        />
                      </div>
                    </div>

                    <div className="w-full lmd:w-full md:w-[65%]">
                      <div className="flex flex-col lmd:flex-row md:flex-row md:mt-[15px]">
                        <div className="w-full md:w-[50%]">
                          <FormikFieldInput
                            label={DataLabel.payor}
                            name={`fetchdata.payor`}
                            placeHolder={`${DataLabel.payor}`}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.payor &&
                              touched.fetchdata &&
                              touched.fetchdata.payor &&
                              errors.fetchdata.payor
                            }
                            onChangeField={(e: any) => {
                              const { value, name } = e.target;
                              setFieldValue(name, value);
                            }}
                          />
                        </div>
                        <div className="w-full md:ml-[24px] md:w-[50%]">
                          <FormikFieldInput
                            label={DataLabel.name}
                            name={`fetchdata.name`}
                            placeHolder={`${DataLabel.name}`}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.name &&
                              touched.fetchdata &&
                              touched.fetchdata.name &&
                              errors.fetchdata.name
                            }
                            onChangeField={(e: any) => {
                              const { value, name } = e.target;
                              setFieldValue(name, value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lmd:flex-row md:flex-row md:mt-[15px]">
                        <div className="w-full md:w-[50%]">
                          <FormikSelectInput
                            label={DataLabel.bill_type}
                            defaultValue={fetchdata.bill_type}
                            placeHolder={`Select ${DataLabel.bill_type}`}
                            isSearchable={true}
                            isClearable={true}
                            name="fetchdata.bill_type"
                            dataOptions={billTypeData.bill_types}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.bill_type &&
                              touched.fetchdata &&
                              touched.fetchdata.bill_type &&
                              errors.fetchdata.bill_type.label
                            }
                          />
                        </div>
                        <div className="w-full md:ml-[24px] md:w-[50%]">
                          <FormikFieldInput
                            type="number"
                            label={DataLabel.default_amount}
                            name={`fetchdata.default_amount`}
                            placeHolder={`${DataLabel.default_amount}`}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.default_amount &&
                              touched.fetchdata &&
                              touched.fetchdata.default_amount &&
                              errors.fetchdata.default_amount
                            }
                            inputPreix={`$`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lmd:flex-row md:flex-row md:mt-[15px]">
                        <div className="w-full md:w-[50%]">
                          <FormikFieldInput
                            type="date"
                            label={DataLabel.next_due_date}
                            name={`fetchdata.next_due_date`}
                            placeHolder={`${DataLabel.next_due_date}`}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.next_due_date &&
                              touched.fetchdata &&
                              touched.fetchdata.next_due_date &&
                              errors.fetchdata.next_due_date
                            }
                          />
                        </div>

                        <div className="w-full md:ml-[24px] md:w-[50%]">
                          <FormikSelectInput
                            label={DataLabel.repeat_frequency}
                            defaultValue={fetchdata.repeat_frequency}
                            placeHolder={``}
                            isSearchable={true}
                            isClearable={true}
                            name="fetchdata.repeat_frequency"
                            dataOptions={billTypeData.repeat_frequency}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.repeat_frequency &&
                              touched.fetchdata &&
                              touched.fetchdata.repeat_frequency &&
                              errors.fetchdata.repeat_frequency.label
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lmd:flex-row md:flex-row md:mt-[15px]">
                        <div className="w-full md:w-[50%]">
                          <FormikSelectInput
                            label={DataLabel.reminder_days}
                            defaultValue={fetchdata.reminder_days}
                            placeHolder={``}
                            isSearchable={true}
                            isClearable={true}
                            name="fetchdata.reminder_days"
                            dataOptions={billTypeData.reminder_days}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.reminder_days &&
                              touched.fetchdata &&
                              touched.fetchdata.reminder_days &&
                              errors.fetchdata.reminder_days.label
                            }
                            toolTipText={
                              <div className="flex flex-col items-start justify-center gap-0">
                                <p className="whitespace-normal leading-normal">
                                  Change email or phone numbers in profile
                                  section
                                </p>
                              </div>
                            }
                          />
                        </div>
                        <div className="w-full md:ml-[24px] md:w-[50%]">
                          <FormikFieldInput
                            label={DataLabel.note}
                            name={`fetchdata.note`}
                            placeHolder={`${DataLabel.note}`}
                            errorMessage={
                              errors.fetchdata &&
                              errors.fetchdata.note &&
                              touched.fetchdata &&
                              touched.fetchdata.note &&
                              errors.fetchdata.note
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*
<div className="flex flex-row">
    {JSON.stringify(values)}
    {JSON.stringify(errors)}
</div>
*/}
                </FormikFormHolder>
              )}
            />
          </div>

          <div className="mt-2 lmd:mt-3 md:mt-10">
            <div className="flex flex-row-reverse gap-4">
              <div className="relative right-5 top-0">
                <button
                  type="button"
                  className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
              <div className="relative right-[30px] top-[10px]">
                <Link
                  href={"/member/bills"}
                  className={`text-[15px] h-[40px] capitalize text-center px-4 py-2.5  font-semibold bg-[#43ACD6] rounded bg-opacity-5 text-[#43ACD6]`}
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
