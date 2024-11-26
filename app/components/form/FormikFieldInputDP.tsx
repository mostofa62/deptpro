import { Field, useFormikContext, useField } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface FormHolderProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label:string;
    name:string;
    placeHolder:string;   
    errorMessage:string|false|undefined;
    onChangeField?:(e:any)=>void,
    inputPreix?:string;
    inputSuffix?:string;

}

export default function FormikFieldInputDP({
    label,
    name,
    placeHolder,    
    errorMessage,
    onChangeField,
    inputPreix,
    inputSuffix,    
    ...props
    }:FormHolderProps){

        
       
        const { setFieldValue } = useFormikContext(); // Get Formik's context to manually set field value
        const [field] = useField(name); // Get field props using useField

        

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

            const { value, name } = e.target;
            setFieldValue(name, value); // Update the field value manually

            
            if (onChangeField) {
                onChangeField(e);
            }
            

            
        }

        
        

        return (
            <div className='border-[#5dcbcf] border-[2px]'>
                <label className="bg-[#fe992c] capitalize p-1 block text-[14px] font-semibold text-[#4f4f4f] text-center">
                    {label}
                </label>
                <div className="relative">

                    {inputPreix && 
                    <span className=' absolute left-2 top-[10px] text-[#31c4a2] font-semibold text-[16px]'>
                        {inputPreix}
                    </span>}   
                    <Field                    
                    className="text-center w-full border-t-[4px] border-[#5dcbcf] bg-transparent py-2 pl-6 pr-10 outline-none text-[#31c4a2] font-semibold text-[16px]"
                    name={name} placeholder={placeHolder.length > 0? `${placeHolder}`:''} onChange={handleInputChange} {...props} />
                    {inputSuffix && 
                    <span className=' absolute right-2 top-[10px] text-[#31c4a2] font-semibold text-[16px]'>
                        {inputSuffix}
                    </span>
                    } 
                    {errorMessage &&

                        <span className="bg-[#B45454] font-semibold text-white text-[14px] flex justify-center items-center text-center">
                            {errorMessage}
                        </span>  
                    }
                    

                                            
                </div>
            </div>
        )

}