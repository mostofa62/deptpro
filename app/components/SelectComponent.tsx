import { useField } from "formik";
import { useState } from "react";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";

interface SelectProps {
  defaultValueArray: any;
  placeholder: string;
  name: string;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: Array<Object>;
  onParentChange: (value: any, name: any) => void;
  onBlur?: (e: any) => void;
  deleteSelectedOption?: (data: any) => void; // Optional delete function
}

const containerStyle = "flex flex-col gap-4 w-full bg-white dark:bg-form-input";
const controlStyles =
  "z-25 w-full appearance-none rounded border border-stroke bg-transparent pt-1 px-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input";
const valueContainerStyle = "text-black dark:text-white";
const placeholderStyle = "text-center text-black dark:text-white";
const singleValueStyle = "text-black dark:text-white";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: "none",
    borderColor: state.isFocused ? "#0a4a82" : "#DFDFDF", // Change the border color here
    "&:hover": {
      borderColor: state.isFocused ? "#0a4a82" : "#DFDFDF", // Change the border color on hover
    },
  }),
  input: (provided: any) => ({
    ...provided,
    boxShadow: "none", // Remove the outline from the input element
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    marginLeft: state.data.isChild ? "10px" : "0px", // Indent children
  }),
};

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps, isFocused } = props;
  const [isHovered, setIsHovered] = useState(false); // Track hover state for each option

  // Check if the option has the `bysystem` field and it is set to 1
  const isBySystem = data.bysystem;
  //console.log('isBySystem',isBySystem,data.bysystem)

  // Destructure the `deleteSelectedOption` from props
  const { deleteSelectedOption, setValue, onParentChange, fieldName } =
    innerProps;

  return (
    <components.Option {...props}>
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center justify-between p-2 hover:bg-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span style={{ fontWeight: data.isChild ? "normal" : "500" }}>
          {data.label}
        </span>
        {!isBySystem && isHovered && (
          <svg
            className="w-5 h-5 text-[#ff0000] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (deleteSelectedOption) {
                deleteSelectedOption(data);
                setValue(null); // Call delete function if passed
                onParentChange(null, fieldName);
              }
              //console.log(`Delete option: ${data.label}`);
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    </components.Option>
  );
};

const SelectComponent = (props: SelectProps) => {
  const [field, state, { setValue, setTouched }] = useField(props.name);
  const { deleteSelectedOption, onParentChange } = props;

  const [menuIsOpen, setMenuIsOpen] = useState(false); // State to control menu open/close

  const handleMenuToggle = () => {
    setMenuIsOpen((prevState) => !prevState); // Toggle menu open/close state
  };

  return (
    <CreatableSelect
      components={{
        Option: (props) => (
          <CustomOption
            {...props} // Ensure all props (including data) are passed
            innerProps={{
              ...props.innerProps,
              deleteSelectedOption,
              setValue,
              onParentChange,
              fieldName: field.name,
            }} // Pass deleteSelectedOption inside innerProps
          />
        ),
      }}
      styles={customStyles}
      defaultValue={props.defaultValueArray}
      placeholder={props.placeholder || "Type to search"}
      isMulti={props.isMulti || false}
      isClearable={props.isClearable || false}
      isSearchable={props.isSearchable || false}
      name={props.name}
      value={state?.value}
      onChange={(value, action) => {
        setTouched(true);
        if (action.action === "clear") {
          setValue(props.defaultValueArray);
          props.onParentChange(props.defaultValueArray, action.name);
        } else {
          setValue(value);
          props.onParentChange(value, action.name);
        }
      }}
      options={props.options}
      //onBlur={handleMenuToggle}
      menuIsOpen={menuIsOpen} // Pass the state to control whether the menu is open
      onMenuOpen={handleMenuToggle} // Open the menu
      onMenuClose={handleMenuToggle} // Close the menu
    />
  );
};

export default SelectComponent;
