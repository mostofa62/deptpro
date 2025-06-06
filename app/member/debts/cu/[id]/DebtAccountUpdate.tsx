const url = process.env.NEXT_PUBLIC_API_URL;
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DataSchema,
  DataLabelUpdate,
  ValidationSchemaUpdate,
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
import useApp from "@/app/hooks/useApp";
import FormikSelectCreatableInput from "@/app/components/form/FormikSelectCreatableInput";
interface DebtProps {
  debt_acc_id: number;
  user_id: number;
  admin_id: number;
  tab_number: number;
}

const DebtAccountUpdate = ({
  debt_acc_id,
  user_id,
  admin_id,
  tab_number,
}: DebtProps) => {
  const router = useRouter();
  const appCtx = useApp();

  const formRef = useRef<any>(null);
  const [fetchFomrData, setFetchFormData] = useState(DataSchema);
  const [payoffOrder, setPayoffOrder] = useState([]);
  const [reminderDays, setReminderDays] = useState([]);

  const [monthlyInterest, setMonthlyInterest] = useState(0);

  const DeptTypeData = useFetchDropDownData({
    urlSuffix: `debttype-dropdownpg/${user_id}`,
  });

  const fetchDataCallback = useCallback(async () => {
    //console.log(id);
    const response = await axios.get(`${url}debtpg/${debt_acc_id}`);
    //return response.data.user;
    setFetchFormData(response.data.debtaccounts);
    setPayoffOrder(response.data.payoff_order);
    setReminderDays(response.data.reminder_days);
    setMonthlyInterest(response.data.debtaccounts.monthly_interest);
  }, [debt_acc_id]);
  useEffect(() => {
    //if(tab_number){
    fetchDataCallback();
    //}
  }, [fetchDataCallback, tab_number]);

  const fetchdata = fetchFomrData;

  const debtsAccountsScreen = appCtx.debtsAccountsScreen;

  const handleFormSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    //alert(JSON.stringify(values));

    await axios
      .post(
        `${url}update-debt-accountpg/${debt_acc_id}`,
        { user_id, admin_id, ...values.fetchdata },
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
          appCtx.setDebtsAccountsScreen(
            debtsAccountsScreen < 1 ? 1 : debtsAccountsScreen + 1
          );
          setMonthlyInterest(response.data.monthly_interest);
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
              action: "delete-debtpg",
              data: { id: id, admin_id: admin_id, key: 1 },
            }).then((deletedData) => {
              //console.log(deletedData)
              AlertBox(deletedData.message, deletedData.deleted_done);
              if (deletedData.deleted_done > 0) {
                router.push("/member/debts");
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
    <div className="flex flex-col md:grid md:grid-flow-row">
      <div className="lmd:mt-2.5 md:mt-2.5">
        <Formik
          innerRef={formRef}
          initialValues={{ fetchdata }}
          enableReinitialize
          validationSchema={ValidationSchemaUpdate}
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
            <Form className="mt-1">
              <p className="text-sm lmd:text-sm lmd:text-center md:text-[16px] uppercase font-medium text-center md:text-left">
                Account Details
              </p>

              <hr className="mt-2 border-stroke" />

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[48%]">
                  <FormikFieldInput
                    label={DataLabelUpdate.name}
                    name={`fetchdata.name`}
                    placeHolder={`${DataLabelUpdate.name}`}
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

                <div className="w-full md:ml-[24px] md:w-[48%]">
                  <FormikSelectCreatableInput
                    label={DataLabelUpdate.debt_type}
                    defaultValue={fetchdata.debt_type}
                    placeHolder={`Select ${DataLabelUpdate.debt_type}`}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.debt_type"
                    dataOptions={DeptTypeData}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.debt_type &&
                      touched.fetchdata &&
                      touched.fetchdata.debt_type &&
                      errors.fetchdata.debt_type.label
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[34%]">
                  <FormikFieldInput
                    type="number"
                    step={"any"}
                    label={DataLabelUpdate.balance}
                    name={`fetchdata.balance`}
                    placeHolder={`${DataLabelUpdate.balance}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.balance &&
                      touched.fetchdata &&
                      touched.fetchdata.balance &&
                      errors.fetchdata.balance
                    }
                    inputPreix={`$`}
                  />
                </div>

                <div className="w-full md:w-[34%] md:ml-[24px]">
                  <FormikFieldInput
                    type="number"
                    step={"any"}
                    label={DataLabelUpdate.highest_balance}
                    name={`fetchdata.highest_balance`}
                    placeHolder={`${DataLabelUpdate.highest_balance}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.highest_balance &&
                      touched.fetchdata &&
                      touched.fetchdata.highest_balance &&
                      errors.fetchdata.highest_balance
                    }
                    inputPreix={`$`}
                  />
                </div>

                <div className="w-full md:ml-[24px] md:w-[30%]">
                  <FormikFieldInput
                    type="date"
                    label={DataLabelUpdate.due_date}
                    name={`fetchdata.due_date`}
                    placeHolder={`${DataLabelUpdate.due_date}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.due_date &&
                      touched.fetchdata &&
                      touched.fetchdata.due_date &&
                      errors.fetchdata.due_date
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full lmd:w-[50%] md:w-[32%]">
                  <FormikFieldInput
                    type="number"
                    step={"any"}
                    label={DataLabelUpdate.monthly_payment}
                    name={`fetchdata.monthly_payment`}
                    placeHolder={`${DataLabelUpdate.monthly_payment}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.monthly_payment &&
                      touched.fetchdata &&
                      touched.fetchdata.monthly_payment &&
                      errors.fetchdata.monthly_payment
                    }
                    inputPreix={`$`}
                  />
                </div>

                <div className="w-full lmd:w-[50%] md:ml-[24px] md:w-[32%]">
                  <FormikFieldInput
                    type="date"
                    label={DataLabelUpdate.start_date}
                    name={`fetchdata.start_date`}
                    placeHolder={`${DataLabelUpdate.start_date}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.start_date &&
                      touched.fetchdata &&
                      touched.fetchdata.start_date &&
                      errors.fetchdata.start_date
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[50%]">
                  <FormikFieldInput
                    type="number"
                    step={"any"}
                    label={DataLabelUpdate.interest_rate}
                    name={`fetchdata.interest_rate`}
                    placeHolder={`${DataLabelUpdate.interest_rate}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.interest_rate &&
                      touched.fetchdata &&
                      touched.fetchdata.interest_rate &&
                      errors.fetchdata.interest_rate
                    }
                    inputSuffix={`%`}
                  />
                </div>

                <div className="w-full md:ml-[24px] md:w-[50%]">
                  <FormikFieldInput
                    type="number"
                    step={"any"}
                    label={DataLabelUpdate.credit_limit}
                    name={`fetchdata.credit_limit`}
                    placeHolder={`${DataLabelUpdate.credit_limit}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.credit_limit &&
                      touched.fetchdata &&
                      touched.fetchdata.credit_limit &&
                      errors.fetchdata.credit_limit
                    }
                    inputPreix={`$`}
                  />
                </div>
              </div>

              <div className="flex flex-grow border border-gray my-4">
                <div className="px-4 py-2">
                  <p className="text-sm md:text-[18px] font-semibold">
                    {DataLabelUpdate.monthly_interest}
                  </p>
                </div>

                <div className="px-4 py-2">
                  <p className="text-sm md:text-[18px] font-semibold">
                    {monthlyInterest}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px]">
                <div className="w-full md:w-[50%]">
                  <FormikFieldInput
                    label={DataLabelUpdate.note}
                    name={`fetchdata.note`}
                    placeHolder={`${DataLabelUpdate.note}`}
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

              <p className="text-sm lmd:text-sm md:text-[16px] uppercase font-medium mt-2 md:mt-4">
                Account Settings
              </p>

              <hr className="my-2 border-stroke" />

              <div className="flex flex-col gap-2 md:flex-row mt-2.5 md:mt-[15px]">
                <div className="w-full md:w-[48%]">
                  <Field
                    component={CheckComponent}
                    name="fetchdata.inlclude_payoff"
                    label={DataLabelUpdate.inlclude_payoff}
                    checked={values.fetchdata.inlclude_payoff === 1}
                    errorClass={
                      errors.fetchdata &&
                      errors.fetchdata.inlclude_payoff &&
                      touched.fetchdata &&
                      touched.fetchdata.inlclude_payoff &&
                      "font-semibold text-[#B45454]"
                    }
                    onChange={(e: any) => {
                      const { checked, name } = e.target;

                      if (checked) {
                        setFieldTouched(name, true);

                        setFieldValue(name, 1);
                      } else {
                        setFieldTouched(name, false);
                        setFieldValue(name, 0);
                      }
                    }}
                  />
                </div>
                <div className="w-full md:ml-[24px] md:w-[48%]">
                  <Field
                    component={CheckComponent}
                    name="fetchdata.autopay"
                    label={DataLabelUpdate.autopay}
                    checked={values.fetchdata.autopay === 1}
                    errorClass={
                      errors.fetchdata &&
                      errors.fetchdata.autopay &&
                      touched.fetchdata &&
                      touched.fetchdata.autopay &&
                      "font-semibold text-[#B45454]"
                    }
                    onChange={(e: any) => {
                      const { checked, name } = e.target;

                      if (checked) {
                        setFieldTouched(name, true);

                        setFieldValue(name, 1);
                      } else {
                        setFieldTouched(name, false);
                        setFieldValue(name, 0);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:mt-[15px] mt-2.5 gap-1">
                <div className="w-full md:w-[48%]">
                  <FormikSelectInput
                    label={DataLabelUpdate.payoff_order}
                    defaultValue={fetchdata.payoff_order}
                    placeHolder={``}
                    isSearchable={true}
                    isClearable={true}
                    name="fetchdata.payoff_order"
                    dataOptions={payoffOrder}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.payoff_order &&
                      touched.fetchdata &&
                      touched.fetchdata.payoff_order &&
                      errors.fetchdata.payoff_order.label
                    }
                  />
                </div>

                <div className="w-full md:ml-[24px] mt-2.5 md:w-[48%]">
                  <FormikSelectInput
                    label={DataLabelUpdate.reminder_days}
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
                    toolTipText={
                      <div className="flex flex-col items-start justify-center gap-0">
                        <p className="whitespace-normal leading-normal">
                          Change email or phone numbers in profile section
                        </p>
                      </div>
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

      <div className="mt-5 lmd:mt-8 md:mt-10">
        <div className="flex flex-row justify-center gap-2 md:gap-4">
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
                deleteAction(debt_acc_id);
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

export default DebtAccountUpdate;
