import React from "react";

interface InputFieldProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  min,
  max,
  step,
  value,
  unit = "",
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-6">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-col space-y-2">
        <input
          type="number"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="range"
          id={`${id}Slider`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
      {/* {unit && <span className="text-sm text-gray-500">{unit}</span>} */}
    </div>
  );
};

export default InputField;
