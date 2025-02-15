const url = process.env.NEXT_PUBLIC_API_URL;
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DataSchemaType,
  DataLabel,
  ValidationSchema,
} from "../DataValidationSchema";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import useFetchDropDownData from "@/app/hooks/useFetchDropDownData";
import { Field, Form, Formik } from "formik";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import axios from "axios";
import toast from "react-hot-toast";
import CheckComponent from "@/app/components/CheckComponent";
import { confirmAlert } from "react-confirm-alert";
import {
  AlertBox,
  DeleteActionGlobal,
} from "@/app/components/grid/useFetchGridData";
import { useRouter } from "next/navigation";
interface BillProps {
  bill_acc_id: number;
  user_id: number;
  tab_number: number;
  setParentData?: (data: any) => void;
}

interface BillAccProps {
  bill_acc_id: number;
  user_id: number;
  fetchFomrData: DataSchemaType;
  repeatFrequency: any[];
  reminderDays: any[];
  billTypes: any[];
}

const BillAccountUpdate = ({
  bill_acc_id,
  user_id,
  fetchFomrData,
  repeatFrequency,
  reminderDays,
  billTypes,
}: BillAccProps) => {
  const router = useRouter();

  const formRef = useRef<any>(null);

  const fetchdata = fetchFomrData;

  const handleFormSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    //alert(JSON.stringify(values));

    await axios
      .post(
        `${url}update-bill-accountpg/${bill_acc_id}`,
        { user_id, ...values.fetchdata },
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

  const deleteAction = async (id: number) => {
    confirmAlert({
      title: "Do you want to delete this data?",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            DeleteActionGlobal({
              action: "delete-bill",
              data: { id: id },
            }).then((deletedData) => {
              //console.log(deletedData)
              AlertBox(deletedData.message, deletedData.deleted_done);
              if (deletedData.deleted_done > 0) {
                router.push("/member/bills");
              }
            });
          },
        },
        {
          label: "No",
          onClick: () => () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="md:mt-[10px]">
        <Formik
          innerRef={formRef}
          initialValues={{ fetchdata }}
          enableReinitialize
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
            <Form className="flex flex-col md:mt-1">
              <p className="text-sm md:text-[16px] text-center md:text-left lmd:text-left uppercase font-medium">
                Account Details
              </p>

              <hr className="mt-1 md:mt-2 border-stroke" />

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[50%]">
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

                <div className="w-full md:ml-[24px] md:w-[50%]">
                  <FormikSelectInput
                    label={DataLabel.bill_type}
                    defaultValue={fetchdata.bill_type}
                    placeHolder={`Select ${DataLabel.bill_type}`}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.bill_type"
                    dataOptions={billTypes}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.bill_type &&
                      touched.fetchdata &&
                      touched.fetchdata.bill_type &&
                      errors.fetchdata.bill_type.label
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[50%]">
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

                <div className="w-full md:ml-[24px] md:w-[50%]">
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
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
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

              <p className="text-sm md:text-[16px] text-center md:text-left lmd:text-left uppercase font-medium md:mt-4">
                Account Settings
              </p>

              <hr className="mt-1 md:mt-2 border-stroke" />

              <div className="flex flex-col md:flex-row md:mt-[15px] gap-1">
                {/* <div className="w-[30%]">

<FormikSelectInput
        label={DataLabel.repeat_count}
        defaultValue={fetchdata.repeat_count}
        placeHolder={``}
        isSearchable={true}
        isClearable={true}
        name="fetchdata.repeat_count"
        dataOptions={repeatCount}
        errorMessage={errors.fetchdata &&
            errors.fetchdata.repeat_count &&
            touched.fetchdata &&
            touched.fetchdata.repeat_count &&
            errors.fetchdata.repeat_count.label
        }
    />

</div> */}

                <div className="w-full md:w-[48%]">
                  <FormikSelectInput
                    label={DataLabel.repeat_frequency}
                    defaultValue={fetchdata.repeat_frequency}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.repeat_frequency"
                    dataOptions={repeatFrequency}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.repeat_frequency &&
                      touched.fetchdata &&
                      touched.fetchdata.repeat_frequency &&
                      errors.fetchdata.repeat_frequency.label
                    }
                  />
                </div>

                <div className="w-full md:w-[48%]">
                  <FormikSelectInput
                    label={DataLabel.reminder_days}
                    defaultValue={fetchdata.reminder_days}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.reminder_days"
                    dataOptions={reminderDays}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.reminder_days &&
                      touched.fetchdata &&
                      touched.fetchdata.reminder_days &&
                      errors.fetchdata.reminder_days.label
                    }
                  />
                </div>
              </div>

              {/*
<div className="flex flex-row">
{JSON.stringify(values)}
{JSON.stringify(errors)}
</div>
*/}
            </Form>
          )}
        />
      </div>

      <div className="mt-3 lmd:mt-5 md:mt-10">
        <div className="flex flex-row justify-center gap-4">
          <div className="md:relative md:top-0">
            <button
              className="flex flex-row text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-2.5 py-2  capitalize text-center font-semibold"
              onClick={handleSubmit}
            >
              <svg
                className="mt-1"
                width={15}
                height={15}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>

              <span className="ml-1.5">Save Updates</span>
            </button>
          </div>
          <div className="md:relative md:left-[30px]">
            <button
              className="flex flex-row text-[15px] h-[40px] bg-gray rounded text-black px-2.5 py-2  capitalize text-center font-semibold"
              onClick={() => {
                deleteAction(bill_acc_id);
              }}
            >
              <svg
                className="mt-1"
                width={15}
                height={15}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <span className="ml-1.5">Delete Accounts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillAccountUpdate;
