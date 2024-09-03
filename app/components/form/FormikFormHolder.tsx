import {Form} from 'formik';
import { ReactNode } from 'react';
interface FormHolderProps{
    legend:string;
    children:ReactNode
}

export default function FormikFormHolder({legend,children}:FormHolderProps){


    return(
        <>
        <span className="text-[#43ACD6] font-medium relative uppercase top-[10px] left-[22px] px-[6px] bg-white  text-[20px] text-center">
                {legend}
        </span>
        <Form className="cuform border-[1px] rounded border-[#C3C9CE] px-[24px] pt-[36px] pb-[24px]">

           
            {children}
        </Form>
        </>
    )

}