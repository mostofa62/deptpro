import React, { useState, useEffect } from 'react';

// Type definition for the option structure with value being string or number
interface Option {
  label: string;
  value: string | number;  // value can be a string or a number
}

// Type definition for the props
interface SelectProps {
  options: Option[];  // options passed in as props
  onChange: (value: string | number) => void; // onChange callback passed in as prop
  defaultValue?: string | number;  // default value to set initially
}

const DropDownComponent: React.FC<SelectProps> = ({ options, onChange, defaultValue }) => {
  // State to hold the selected value (it can be string or number)
  const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue || '');

  // Effect to update the selected value when defaultValue changes
  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  // Handler to manage the change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    const value = isNaN(Number(selectedOption)) ? selectedOption : Number(selectedOption);  // Convert to number if possible
    setSelectedValue(value);
    onChange(value);  // Calling the passed in onChange function
  };

  return (
    <>
      {/* <h3>Custom Select Component</h3> */}
      <select className='p-2 bg-[#43ACD6] font-semibold text-white' value={selectedValue} onChange={handleChange}>
        <option className='text-gray' value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* {selectedValue && (
        <p>You selected: {selectedValue}</p>
      )} */}
    </>
  );
};

export default DropDownComponent;
