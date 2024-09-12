"use client";
import Select, { components } from 'react-select';
import React from 'react';
import CreatableSelect from 'react-select/creatable';


import {useField} from 'formik';

interface SelectProps{
    defaultValueArray:any,
    placeholder:string,
    name:string,
    isMulti? :boolean,
    isClearable?:boolean,
    isSearchable?:boolean,
    options:Array<Object>,
    onParentChange:(value:any,name:any)=>void,
    //onChange:(value:any)=>void,
    onBlur?:(e:any)=>void
  }

const containerStyle = "flex flex-col gap-4 w-full bg-white dark:bg-form-input";
const controlStyles="z-25 w-full appearance-none rounded border border-stroke bg-transparent pt-1 px-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input";
const valueContainerStyle="text-black dark:text-white";
const placeholderStyle="text-center text-black dark:text-white";
const singleValueStyle="text-black dark:text-white";


const selectInputStyles = "relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input";
const menuStyles = "p-1 mt-0 border";
const menuListStyle="dark:border-form-strokedark dark:bg-form-input";
const optionStyle="dark:bg-form-input";


const customStyles = {
  control: (provided:any, state:any) => ({
    ...provided,
    boxShadow: 'none',    
    borderColor: state.isFocused ? '#0a4a82' : '#DFDFDF', // Change the border color here
    
    '&:hover': {
      borderColor: state.isFocused ? '#0a4a82' : '#DFDFDF', // Change the border color on hover
    },
  }),
  input: (provided:any) => ({
    ...provided,
    boxShadow: 'none', // Remove the outline from the input element
  }),

  option: (provided:any, state:any) => ({
    ...provided,
    //fontSize: state.data.isChild ? '14px' : '16px', // Smaller font for children
    marginLeft: state.data.isChild ? '10px' : '0px', // Indent children
  }),
};

// Custom Option component to detect parent/child
const CustomOption = (props:any) => {
  return (
    <components.Option {...props}>
      <span style={{ fontWeight: props.data.isChild ? 'normal' : '500' }}>
        {props.data.label}
      </span>
    </components.Option>
  );
};

const SelectComponent = (props:SelectProps) => {
    const [field, state, { setValue, setTouched }] = useField(props.name);

  return (
    <>
      <CreatableSelect
      components={{ Option: CustomOption }}
      classNames={{
        /*
        control: ({ isFocused }) =>
          clsx(
            controlStyles,
            isFocused ? "logo-font-color1" : "border-gray-300",
          ),
          */
         control:()=>controlStyles,
          input: () => singleValueStyle,
          menu: () => menuStyles,
          container:()=>containerStyle,
          valueContainer:()=>valueContainerStyle,
          placeholder:()=>placeholderStyle,
          singleValue:()=>singleValueStyle,
          menuList:()=>menuListStyle,
          option:()=>optionStyle
         

      }}
      styles={customStyles}
      defaultValue={props.defaultValueArray}
      placeholder={props.placeholder||"Type to search"}      
      isMulti={props.isMulti || false}
      isClearable={props.isClearable || false}
      isSearchable={props.isSearchable || false}
        name={props.name}
        /*value={field.value}*/ 
               
        value={state?.value} 
        
        onChange={(value, action) => {
          //alert(action.action)
          
          setTouched(true)
          if(action.action == 'clear'){
            setValue(props.defaultValueArray)
            props.onParentChange(props.defaultValueArray,action.name)
          }else{
            setValue(value)
            props.onParentChange(value,action.name)
          }
          
        }}
        options={props.options}
        onBlur={() =>{} }
      />
     {/*  <ErrorMessage name={name} /> */}
    </>
  );

};



export default SelectComponent;