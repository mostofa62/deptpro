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
    }:FormHolderProps){
        

        return (
            <>
            <label className="mb-2.5 block font-bold text-[#4F4F4F]">
                {label}
            </label>
            <div className="relative">
                {onParentChangeSelect ?
            <SelectNonCreatableComponent defaultValueArray={defaultValue}
                                 placeholder={`Select ${placeHolder}`}
                                 isSearchable={isSearchable}
                                 isClearable={isClearable}                                 
                                  name={name} 
                                  options={dataOptions}
                                  onParentChange={onParentChangeSelect} 
                                  
                      />: <SelectNonCreatableComponent defaultValueArray={defaultValue}
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