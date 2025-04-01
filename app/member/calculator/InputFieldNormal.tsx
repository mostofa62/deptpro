import React from "react";

interface InputFieldNormalProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  unit?: string;
  onChangeData: (value: number) => void;
}

const InputFieldNormal: React.FC<InputFieldNormalProps> = ({
  label,
  value,
  unit = "",
  onChangeData,
  ...props // <-- Correct syntax (three dots, no extra dot)
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-6">
      <label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-col space-y-2">
        <input
          value={value}
          onChange={(e) => onChangeData(Number(e.target.value))}
          className="p-2 border border-gray-300 focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none rounded-md"
          {...props}
        />
      </div>
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
    </div>
  );
};

export default InputFieldNormal;
