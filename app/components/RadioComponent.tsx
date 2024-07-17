import React, { useState } from 'react';

interface RadioType{
  field:any;
  checked:any;
  label:string;
  value:any;
  labelFor:string;
  onChange:()=>{};
  onClick:()=>{};
}

const RadioComponent = ({
  field,
  checked,
  labelFor,  
  label,
  onChange,
  onClick,
}:RadioType)=>{

        return (
            <>
              <label
                htmlFor={labelFor}
                className="flex cursor-pointer select-none items-center"
              >
              <div className='relative'>
              <input className="sr-only" {...field} 
                type="radio" 
                checked={checked} 
                onChange={onChange} 
                onClick={onClick}
                />                
                 
              </div>
              <div
              className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              checked && 'border-primary'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                checked && '!bg-primary'
              }`}
            >
              {' '}
            </span>
          </div>
              {label}
          </label>
          </>
        );

    
}
export default RadioComponent;