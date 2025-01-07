import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const SavingsForecaster = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      existingBalance: "",
      newContributions: "",
      contributionFrequency: "Monthly",
      yearsToContribute: "",
      annualRateOfReturn: "",
      inflationRate: "",
      yearsOfWithdrawals: "",
      withdrawalFrequency: "Monthly",
      taxDuringContributions: "",
      taxDuringWithdrawals: "",
    },
    validationSchema: Yup.object({
      existingBalance: Yup.number()
        .required("Required")
        .min(0, "Must be positive"),
      newContributions: Yup.number()
        .required("Required")
        .min(0, "Must be positive"),
      contributionFrequency: Yup.string().required("Required"),
      yearsToContribute: Yup.number()
        .required("Required")
        .min(1, "Must be at least 1 year"),
      annualRateOfReturn: Yup.number()
        .required("Required")
        .min(0)
        .max(100, "Must be between 0 and 100"),
      inflationRate: Yup.number()
        .required("Required")
        .min(0)
        .max(100, "Must be between 0 and 100"),
      yearsOfWithdrawals: Yup.number()
        .required("Required")
        .min(1, "Must be at least 1 year"),
      withdrawalFrequency: Yup.string().required("Required"),
      taxDuringContributions: Yup.number()
        .required("Required")
        .min(0)
        .max(100, "Must be between 0 and 100"),
      taxDuringWithdrawals: Yup.number()
        .required("Required")
        .min(0)
        .max(100, "Must be between 0 and 100"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
      // Handle calculation logic and graph rendering here
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Savings and Withdrawal Forecaster
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Existing Balance */}
        <div>
          <label
            htmlFor="existingBalance"
            className="block text-sm font-medium text-gray-700"
          >
            Existing Balance ($)
          </label>
          <input
            id="existingBalance"
            name="existingBalance"
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formik.values.existingBalance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.existingBalance && formik.errors.existingBalance ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.existingBalance}
            </p>
          ) : null}
        </div>

        {/* New Contributions */}
        <div>
          <label
            htmlFor="newContributions"
            className="block text-sm font-medium text-gray-700"
          >
            New Contributions ($)
          </label>
          <input
            id="newContributions"
            name="newContributions"
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formik.values.newContributions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.newContributions && formik.errors.newContributions ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.newContributions}
            </p>
          ) : null}
        </div>

        {/* Contribution Frequency */}
        <div>
          <label
            htmlFor="contributionFrequency"
            className="block text-sm font-medium text-gray-700"
          >
            Contribution Frequency
          </label>
          <select
            id="contributionFrequency"
            name="contributionFrequency"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formik.values.contributionFrequency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </select>
        </div>

        {/* Repeat similar blocks for remaining fields */}
        <div>
          <label htmlFor="annualRateOfReturn" className="block text-sm font-medium text-gray-700">
            Annual Rate of Return (%)
          </label>
          <input
            id="annualRateOfReturn"
            name="annualRateOfReturn"
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formik.values.annualRateOfReturn}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.annualRateOfReturn && formik.errors.annualRateOfReturn ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.annualRateOfReturn}
            </p>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Calculate Savings and Withdrawals
        </button>
      </form>
    </div>
  );
};

export default SavingsForecaster;
