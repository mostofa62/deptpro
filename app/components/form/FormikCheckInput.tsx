import React, { useState } from 'react';

interface CheckType{
  field:any;
  checked:any;
  label:string;
  value:any;
  labelFor:string;
  onChange:()=>{};
  onClick:()=>{};
  errorClass:string;
}

const FormikCheckInput = ({
  field,
  checked,
  labelFor,  
  label,
  onChange,
  onClick,
  errorClass
}:CheckType)=>{

        return (
            <>
            <div className='mb-[10px] block h-[20px]'></div>
            <div className='relative'>
              <label
                htmlFor={labelFor}
                className={`py-4 pl-2 pr-10 flex cursor-pointer select-none items-center text-[16px] font-medium text-[#000000] ${errorClass}`}
              >
                <div className='relative'>
                <input className="sr-only" {...field} 
                    type="checkbox" 
                    checked={checked} 
                    onChange={onChange} 
                    onClick={onClick}
                    />                
                    
                </div>
              

                <div
                    className={`mr-4 flex h-6 w-6 items-center justify-center rounded border  ${
                    checked ? 'border-[#43ACD6] bg-gray dark:bg-transparent':'border-[#0a4a82]'
                    }`}
                >
                    <span
                    className={`h-3 w-3 rounded-sm ${checked && 'bg-[#43ACD6]'}`}
                    ></span>
                </div>
                <div>{label}</div>
          </label>
          </div>
          </>
        );

    
}
export default FormikCheckInput;