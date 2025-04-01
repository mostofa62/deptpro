import React, { useState, useEffect } from "react";

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
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value); // Sync value prop with local state
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  const sliderFillPercent = ((sliderValue - min) / (max - min)) * 100;

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
          className="p-2 border border-gray-300 focus:border-[#42acd8] hover:border-[#42acd8] active:border-[#42acd8] focus:outline-none rounded-md"
        />

        <div className="relative w-full h-2 bg-gray-300 rounded-full">
          {/* Filled portion (progress bar) */}
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${sliderFillPercent}%`,
              background: "#42acd8", // Your custom color
              borderTopRightRadius: sliderFillPercent === 100 ? "8px" : "0", // Rounded right edge when at 100%
              borderBottomRightRadius: sliderFillPercent === 100 ? "8px" : "0", // Rounded right edge when at 100%
            }}
          />
          {/* Slider input */}
          <input
            type="range"
            id={`${id}Slider`}
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-transparent cursor-pointer absolute z-10"
            style={{
              WebkitAppearance: "none", // Removes default WebKit styles
              appearance: "none", // Removes default styles
            }}
          />
        </div>
      </div>

      {/* Custom CSS for slider thumb */}
      <style jsx>{`
        #${id}Slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #42acd8; /* Thumb color */
          border-radius: 50%;
          cursor: pointer;
        }

        #${id}Slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #42acd8; /* Thumb color */
          border-radius: 50%;
          cursor: pointer;
        }

        #${id}Slider::-ms-thumb {
          width: 20px;
          height: 20px;
          background: #42acd8; /* Thumb color */
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default InputField;
