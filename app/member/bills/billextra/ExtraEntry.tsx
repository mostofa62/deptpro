import CardHolderDefault from "@/app/components/ui/CardHolderDefault";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DataLabel,
  DataSchema,
  ValidationSchema,
} from "./DataValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";
import FormikFieldInput from "@/app/components/form/FormikFieldInput";
import CheckComponent from "@/app/components/CheckComponent";
import FormikSelectInput from "@/app/components/form/FormikSelectInput";
import useApp from "@/app/hooks/useApp";
import Link from "next/link";
import FormikFormHolder from "@/app/components/form/FormikFormHolder";
import VideoComponent from "@/app/components/utils/VideoComponent";

const url = process.env.NEXT_PUBLIC_API_URL;

interface Options {
  label: string;
  value: string;
}

interface ExtraProps {
  user_id: number;
  admin_id: number;
  extraType: any[];
  billList: Options[];
}

const ExtraEntry = ({ user_id, admin_id, extraType, billList }: ExtraProps) => {
  const router = useRouter();

  const [fetchFomrData, setFetchFormData] = useState(DataSchema);
  const formRef = useRef<any>(null);

  const fetchdata = fetchFomrData;

  const handleFormSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    // alert(JSON.stringify(values));

    //const link:any = editData.id == ''?`${url}save-bill-extra`:`${url}update-bill-extra`;
    const link: any = `${url}save-bill-transactionpg`;

    try {
      const response = await axios.post(
        link,
        { user_id, admin_id, ...values.fetchdata },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.result > 0) {
        setSubmitting(false);
        toast.success(response.data.message);
        //resetForm();
        //cleanData();
        router.push("/member/bills");
      } else {
        setSubmitting(true);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            "Something went wrong. Please try again later."
        );
      } else if (error.request) {
        toast.error(
          "Server is not responding. Please check your internet connection or try again later."
        );
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = () => {
    formRef.current?.handleSubmit();
  };

  return (
    <div className="">
      <div className="mt-2.5  lmd:mt-5 md:mt-[32px]">
        <Formik
          innerRef={formRef}
          initialValues={{ fetchdata }}
          enableReinitialize
          validationSchema={ValidationSchema}
          onSubmit={handleFormSubmit}
          validateOnChange={false}
          validateOnBlur={false}
          render={({
            isValid,
            handleChange,
            isSubmitting,
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
          }: any) => (
            <FormikFormHolder>
              <div className="flex flex-col lmd:flex-row md:flex-row">
                <div className="w-0 lmd:w-0 md:w-[35%] flex justify-center items-center">
                  <div className="">
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
                  <div className="flex flex-col md:flex-row md:mt-[15px]">
                    <div className="w-full md:w-[50%]">
                      <FormikSelectInput
                        label={DataLabel.bill}
                        defaultValue={fetchdata.bill}
                        placeHolder={``}
                        isSearchable={true}
                        isClearable={true}
                        name="fetchdata.bill"
                        dataOptions={billList}
                        errorMessage={
                          errors.fetchdata &&
                          errors.fetchdata.bill &&
                          touched.fetchdata &&
                          touched.fetchdata.bill &&
                          errors.fetchdata.bill.label
                        }
                      />
                    </div>
                    <div className="w-full md:ml-6 md:w-[50%]">
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
                  </div>

                  <div className="flex flex-col md:flex-row md:mt-[15px]">
                    <div className="w-full md:w-[50%]">
                      <FormikSelectInput
                        label={DataLabel.type}
                        defaultValue={fetchdata.type}
                        placeHolder={``}
                        isSearchable={true}
                        isClearable={true}
                        name="fetchdata.type"
                        dataOptions={extraType}
                        errorMessage={
                          errors.fetchdata &&
                          errors.fetchdata.type &&
                          touched.fetchdata &&
                          touched.fetchdata.type &&
                          errors.fetchdata.type.value
                        }
                      />
                    </div>

                    <div className="w-full md:ml-6 md:w-[50%]">
                      <FormikFieldInput
                        type="date"
                        label={DataLabel.due_date}
                        name={`fetchdata.due_date`}
                        placeHolder={`${DataLabel.due_date}`}
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
                    <div className="w-full md:w-[50%]">
                      <FormikFieldInput
                        type="number"
                        step={"any"}
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
                        inputPreix={`$`}
                      />
                    </div>

                    <div className="w-full md:ml-6 md:w-[50%]">
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

                  {/* <div className="flex flex-row mt-[15px]">

                <div className="w-full">
                    
                    <FormikFieldInput 
                    label={DataLabel.comment} 
                    name={`fetchdata.comment`}
                    placeHolder={`${DataLabel.comment}`}
                    errorMessage ={ errors.fetchdata &&                                        
                        errors.fetchdata.comment &&
                        touched.fetchdata &&            
                        touched.fetchdata.comment &&  errors.fetchdata.comment}   
                    />
                    
                    
                    
                </div>

            </div> */}
                </div>
              </div>
            </FormikFormHolder>
          )}
        />
      </div>

      <div className="mt-2 lmd:mt-3.5 md:mt-10">
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
  );
};

export default ExtraEntry;
