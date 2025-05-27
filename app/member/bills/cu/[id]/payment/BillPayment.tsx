import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { Form, Formik } from "formik";

import { useState } from "react";
import { DataLabel, ValidationSchema } from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";

interface paymentProps {
  bill_acc_id: number;
  trans_id: number;
  amount: number;
  pay_date: string;
  cleanData: () => void;
  admin_id:number;
  user_id:number;
}

const url = process.env.NEXT_PUBLIC_API_URL;
const BillPayment = ({
  bill_acc_id,
  trans_id,
  amount,
  pay_date,
  cleanData,
  admin_id,
  user_id
}: paymentProps) => {
  const [fetchFomrData, setFetchFormData] = useState({ amount, pay_date });

  //setFetchFormData({amount,pay_date})

  const fetchdata = fetchFomrData;

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    //alert(JSON.stringify(values));

    await axios
      .post(
        `${url}pay-billpg/${bill_acc_id}`,
        { trans_id,user_id, admin_id,...values.fetchdata },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        //console.log(response);

        if (response.data.result > 0) {
          toast.success(response.data.message);
          resetForm();
          cleanData();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (error) {
        toast.error(error);
        //console.log(error);
      });
  };

  return (
    <CardHolderDefault>
      <p className="text-sm md:text-[16px] text-center md:text-left uppercase font-medium">
        Add a Bill Payment
      </p>

      <hr className="md:mt-2 border-stroke" />

      <div className="flex flex-col">
        <Formik
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
            <Form className="flex flex-col gap-2.5 md:mt-5">
              <div className="flex flex-row">
                <div className="w-full">
                  <FormikFieldInput
                    type="date"
                    label={DataLabel.pay_date}
                    name={`fetchdata.pay_date`}
                    placeHolder={`${DataLabel.pay_date}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.pay_date &&
                      touched.fetchdata &&
                      touched.fetchdata.pay_date &&
                      errors.fetchdata.pay_date
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-full">
                  <FormikFieldInput
                    label={DataLabel.amount}
                    name={`fetchdata.amount`}
                    placeHolder={`${DataLabel.amount}`}
                    errorMessage={
                      errors.fetchdata &&
                      errors.fetchdata.amount &&
                      touched.fetchdata &&
                      touched.fetchdata.amount &&
                      errors.fetchdata.amount
                    }
                    type="number"
                    max={values.fetchdata.amount}
                    min={0}
                    inputPreix={`$`}
                  />
                </div>
              </div>

              <hr className="mt-2 lmd:mt-3 md:mt-8 border-stroke" />

              <div className="flex flex-row-reverse justify-center items-center gap-8 md:gap-2 my-1 md:mt-4">
                <div className="w-full flex justify-start md:justify-center lmd:justify-center">
                  <button
                    type="submit"
                    className="text-[15px] h-[40px] bg-[#43ACD6] rounded text-white px-4  capitalize text-center font-semibold"
                  >
                    Save
                  </button>
                </div>
                <div className="w-full flex justify-end md:justify-center lmd:justify-center">
                  <button
                    type="button"
                    onClick={cleanData}
                    className="text-[15px] h-[40px] bg-[#43ACD6] rounded bg-opacity-5 text-[#43ACD6] px-4  capitalize text-center font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    </CardHolderDefault>
  );
};

export default BillPayment;
