import {Field} from 'formik';
import CheckComponent from '../CheckComponent';
import RadioComponent from '../RadioComponent';
import {useFormikContext} from 'formik';




interface FormHolderProps{    
    name:string;
    placeHolder:string;   
    errorMessage:string|false|undefined;
    onChangeField?:(e:any)=>void,    
    filedType?:string,
    optionData:any,
    checkedValue:any
}

export default function FormikRadioCheckInput({    
    name,    
    errorMessage,
    onChangeField,
    filedType,
    optionData,
    checkedValue
    }:FormHolderProps){

        const { setFieldValue, setFieldTouched }:any = useFormikContext();
        

        return (
            <>           
            <div className="relative">
            {optionData.map((v:any,i:any)=>{
                <div key={i}>
                    <Field 
                        label={v.label}
                        component={filedType && filedType =='radio'?RadioComponent:CheckComponent}                  
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
                        name={name}
                        checked={checkedValue === v.value}                         
                        onChange={onChangeField ? onChangeField:(e:any)=>{
                            const {checked, name} = e.target;
                            if (checked) {
                                setFieldTouched(name,true);
              
                                setFieldValue(
                                    name,
                                    {value:v.value, label:v.label}
                                );
                                
                            }else{
                                setFieldTouched(name,false);
                                setFieldValue(
                                    name,
                                    {value:'', label:''}
                                );
            
                            }
                        }}
                    />
                </div>



            })}
            

            
                   {errorMessage &&

                        <span className="mt-5 ml-1 font-semibold text-[#B45454]">
                                                {errorMessage}
                                            </span>  
                    }
                  

                                         
            </div>
            </>
        )

}