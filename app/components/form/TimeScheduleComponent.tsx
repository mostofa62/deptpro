import {Formik, Form, Field, yupToFormErrors, validateYupSchema} from 'formik';
import { object, array, string, number, StringSchema } from "yup";
import useAuth from '@/app/hooks/useAuth';
import { useRouter, usePathname } from "next/navigation";
import {useState, useEffect} from 'react';
import axios from 'axios';
import DatePicker,{CalendarContainer} from 'react-datepicker';
import  moment from 'moment';
import 'moment/locale/en-gb'


import 'react-datepicker/dist/react-datepicker.css';
import './time-schedule-style.css'
const url = process.env.api_url;
const max_schedule_count:any = process.env.max_schedule_count;

function responseOperation(response:any, authCtx:any, router:any){

    if(typeof window !== 'undefined' 
    && 
    response.data.user_contact_status > 0 
    && 
    response.data.contact_question_status > 0
    &&
    response.data.contact_schedule_id != null
    ){
      authCtx.activeMobileNumber = null;
      authCtx.selectedMobile(null);
      localStorage.removeItem("MobileNumber")
      authCtx.activeContactId = null;
      authCtx.selectedContactId(null);
      localStorage.removeItem("ContactID")
      localStorage.removeItem('data');
      //remove skip rules
      authCtx.redirect =null;
      authCtx.setRedirect(null);
      authCtx.focusElement = null;
      authCtx.setFocusElement(null);
      localStorage.removeItem("redirect")
      localStorage.removeItem('focusElement');
      localStorage.removeItem('last_section');
      localStorage.removeItem('schedule_count');
      localStorage.removeItem('boundaryReached');
      localStorage.removeItem('snowball');
      localStorage.removeItem('snowball_count');


      authCtx.boundaryReached = null;
      authCtx.setBoundaryReached(null)

      router.push('/dashboard/callinterface')  
    }

}

const TimeScheduleComponent = ()=>{
    const router = useRouter();
    const pathname = usePathname();
    const authCtx = useAuth();
    const userid = authCtx.userId;
    const mobile_no = authCtx.activeMobileNumber;
    let boundary_reached = authCtx.boundaryReached;
    let dispose_status:any = null;

    
    const [scheduleCount, setScheduleCount] = useState(0)
    const [maxscheduleCount, setMaxScheduleCount] = useState(max_schedule_count)

    const ContactStatus = {
        schedule_time:''       
    }
    const ContactStatusSchema = object().shape({
        schedule_time:string().required('You must pick a time'),
    });

    useEffect(()=>{
      if(typeof window!='undefined'){
        const sc_count = localStorage.getItem("schedule_count")
        const snowball = localStorage.getItem("snowball_count")
        if(sc_count!=null){
          setScheduleCount(parseInt(sc_count));
        }
        if(snowball!=null){
          setMaxScheduleCount(max_schedule_count+1)
        }
      }
    },[])

    const handleFormSubmit =async(values:any)=>{
        //console.log(values);
        const last_section = pathname.substring(pathname.lastIndexOf('/') + 1)
        //console.log(last_section)

        
        const schedule_time = moment(values.schedule_time).format('YYYY-MM-DD HH:mm');

        //alert(schedule_time)
        

        let data = typeof window !='undefined'? localStorage.getItem('data'):null;
        if(data !=null){
            data = JSON.parse(data);
        }

        if(boundary_reached != null){
          dispose_status = {"value":14,"label":"14 কোটা পূর্ণ হয়ে গেছে"};
          boundary_reached = JSON.parse(boundary_reached)
        }

        
        await axios.post(`${url}contact-schedule-time`, 
        {
        userid:userid,
        schedule_time:schedule_time,
        mobile_no:mobile_no,
        questionid:authCtx.activeContactId,
        data:data,
        last_section:last_section,
        dispose_status:dispose_status,
        boundary_reached:boundary_reached        
        }, 
        {    
          headers: {
            'Content-Type': 'application/json'
          }
        }
        ) .then(function (response) {            
            responseOperation(response,authCtx,router);            
        })

        
        
        
    }

    function onKeyDown(keyEvent:any) {
      if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
        keyEvent.preventDefault();
      }
    }

    return(
      scheduleCount < parseInt(maxscheduleCount) ?
      <Formik 
              initialValues={ContactStatus}
              validationSchema={ContactStatusSchema} 
              onSubmit={handleFormSubmit}
              render={({isValid, isSubmitting,values,errors, touched, setFieldValue, setFieldTouched})=>(
              
                <Form onKeyDown={onKeyDown} >
<div className="w-full">
<label className="mb-3 block text-black dark:text-white">
                  Select Date and Time
                </label>

                
                <Field name="schedule_time">
            {({ field, form }:{field:any, form:any}) => (
              <DatePicker                
                {...field}
                
                showIcon
                isClearable
                selected={field.value}
                onChange={(date:any) => form.setFieldValue(field.name, date)}
                dateFormat="yyyy-MM-dd HH:mm"                
                //showTimeSelect
                //timeFormat="HH:mm"
                //timeIntervals={15}
                //timeCaption="Time"
                //locale="en_GB"
                //showTimeSelect
                //timeFormat="HH:mm"
                
                showTimeInput
                timeInputLabel="Time:"
                minDate={new Date()}
                
                
                
                popperPlacement="top-end"
                
                //popperPlacement="bottom-start"
                popperModifiers={{
                  strategy: "fixed",
                  offset: {
                    enabled: true,
                    offset: '0px, 12px'
                  },
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false, 
                    boundariesElement: 'viewport'
                  }
                }}
          
                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            )}
          </Field>
{
    errors.schedule_time
    &&
    touched.schedule_time && ( 
        <span className="mb-3 font-semibold text-[#B45454]">
            {errors.schedule_time}
        </span>   
    )}     
    </div>

    <div className="w-full mt-5">
<button 
disabled={!isValid || isSubmitting} type="submit"
 className="flex w-full justify-center rounded bg-[#f1e56c] p-3 font-medium text-black">
  Submit
</button>
                    </div>

                    {/*<pre>Option Values: {JSON.stringify(values, null, 2)}</pre>*/}


                </Form>
        )}
        />:
        <div className='flex justify-center'>
          <p className='text-[#B45454] bg-white p-1'>Max appointment limit: ({scheduleCount}), reached.</p>
        </div>
    )


}
export default TimeScheduleComponent;