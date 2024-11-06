import {Field} from 'formik';
import SelectNonCreatableComponent from '../SelectNonCreatableComponent';
import TooltipOne from '../ui/TooltipOne';

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
    toolTipText?:React.ReactNode;      
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
    disabled,
    toolTipText
    }:FormHolderProps){
        

        return (
            <>
            <div className='flex gap-2'>
            <label className="mb-[10px] block text-[16px] font-medium text-[#000000]">
                {label}
            </label>
            {toolTipText && <TooltipOne text={toolTipText} />}
            </div>
            <div className="relative">
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
            </>
        )

}