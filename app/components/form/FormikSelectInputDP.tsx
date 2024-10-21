import {Field} from 'formik';
import SelectNonCreatableComponent from '../SelectNonCreatableComponent';

interface FormHolderProps{
    label:string;
    name:string;
    placeHolder:string;   
    errorMessage:string|false|undefined;
    defaultValue:{};
    dataOptions:{}[];
    isSearchable:boolean;
    isClearable:boolean;
    disabled?:boolean;
    onParentChangeSelect?:(value:any, name:any)=>void;       
}

export default function FormikSelectInput({
    label,
    name,
    placeHolder,    
    errorMessage,
    defaultValue,
    dataOptions,
    isSearchable,
    isClearable,
    onParentChangeSelect,
    disabled
    }:FormHolderProps){
        

        return (
            <div className='border-[#5dcbcf] border-[2px]'>
            <label className="bg-[#fe992c] capitalize p-1 block text-[14px] font-semibold text-[#4f4f4f] text-center">
                {label}
            </label>
            <div className="relative border-t-[4px] border-[#5dcbcf]">
                {onParentChangeSelect ?
            <SelectNonCreatableComponent 
            disabled={disabled}
            defaultValueArray={defaultValue}
                                 placeholder={`Select ${placeHolder}`}
                                 isSearchable={isSearchable}
                                 isClearable={isClearable}                                 
                                  name={name} 
                                  options={dataOptions}
                                  onParentChange={onParentChangeSelect} 
                                  
                      />: <SelectNonCreatableComponent 
                      disabled={disabled}
                      defaultValueArray={defaultValue}
                      placeholder={`Select ${placeHolder}`}
                      isSearchable={isSearchable}
                      isClearable={isClearable}                                 
                       name={name} 
                       options={dataOptions}
                       onParentChange={(v:any,n:any)=>{}} 
                       
           />}
             
                   {errorMessage &&

                        <span className="mt-5 ml-1 font-semibold text-[#B45454]">
                                                {errorMessage}
                                            </span>  
                    }
                  

                                         
            </div>
            </div>
        )

}