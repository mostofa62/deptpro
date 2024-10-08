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

const CheckComponent = ({
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
              <label
                htmlFor={labelFor}
                className={`flex cursor-pointer select-none items-center ${errorClass}`}
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
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              checked && 'border-primary bg-gray dark:bg-transparent'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${checked && 'bg-primary'}`}
            ></span>
          </div>
              {label}
          </label>
          </>
        );

    
}
export default CheckComponent;