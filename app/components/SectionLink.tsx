import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from '@/app/hooks/useAuth';
import { useEffect, useState } from "react";

const SectionLink = ({
    linkdata
}:
{
    linkdata:any
})=>{
    const pathname = usePathname();
    const authCtx = useAuth();
    /*
    linkdata = [
        {"label":"সেকশন ১: সূচনা এবং সম্মতি","href":"introduction_permission"},
        {"label":"সেকশন ২  : যোগ্যতা এবং সময় নির্ধারণ","href":"eligibility_timeselection"},
        ];

    */
   //console.log(linkdata)
    const linkdata_len = linkdata.length;
    //const current_url_index:any = pathname.substring(pathname.lastIndexOf('/') + 1).charAt(0)
    const [terminateIndex, setTerminateIndex] = useState(linkdata_len);
    const focus_element:any = authCtx.focusElement;
    const boundary_reached:any = authCtx.boundaryReached;
    useEffect(()=>{
      if(focus_element == "terminate" && terminateIndex == linkdata_len){
        //console.log(pathname.substring(pathname.lastIndexOf('/') + 1))
        const current_url_index:any = pathname.substring(pathname.lastIndexOf('/') + 1).charAt(0)
        setTerminateIndex(parseInt(current_url_index));
      }
      if(boundary_reached!=null && terminateIndex == linkdata_len){
        const current_url_index:any = pathname.substring(pathname.lastIndexOf('/') + 1).charAt(0)
        //alert(current_url_index)
        setTerminateIndex(parseInt(current_url_index));
      }
      //if(boundary_reached!=null){

      //}
      if(focus_element != "terminate" && boundary_reached==null){
        setTerminateIndex(linkdata_len);
      }
    },[focus_element,pathname,terminateIndex,linkdata_len,boundary_reached])

    const sLink = terminateIndex == linkdata_len ? linkdata:linkdata.slice(0,terminateIndex);
    
    //console.log(terminateIndex)
    const linkRenderTemplate = sLink.map((item:any,i:number)=>{
        //console.log(i)
        let index = (i+1);
        let link_href = index+item?.href
        //console.log(terminateIndex, index)
        //console.log(parseInt(current_url_index),index,parseInt(current_url_index) <= index && authCtx.focusElement == 'terminate')
        return(
            
        <li key={i}>
            <Link
                      className={`flex items-center gap-3.5 font-medium 
                      ${pathname.slice(-link_href.length) == link_href && 'text-black hover:text-primary dark:text-white'}`}
                      href={link_href}
                    >
                <span className='hover:text-primary'>{item?.label}</span>
                {
                i != (terminateIndex-1) && 
                <svg
                className='fill-current'
                width='18'
                height='7'
                viewBox='0 0 18 7'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.5704 2.58734L14.8227 0.510459C14.6708 0.333165 14.3922 0.307837 14.1896 0.459804C14.0123 0.61177 13.9869 0.890376 14.1389 1.093L15.7852 3.04324H1.75361C1.50033 3.04324 1.29771 3.24586 1.29771 3.49914C1.29771 3.75241 1.50033 3.95504 1.75361 3.95504H15.7852L14.1389 5.90528C13.9869 6.08257 14.0123 6.36118 14.1896 6.53847C14.2655 6.61445 14.3668 6.63978 14.4682 6.63978C14.5948 6.63978 14.7214 6.58913 14.7974 6.48782L16.545 4.41094C17.0009 3.85373 17.0009 3.09389 16.5704 2.58734Z'
                  fill=''
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14.1896 0.459804C14.3922 0.307837 14.6708 0.333165 14.8227 0.510459L16.5704 2.58734C17.0009 3.09389 17.0009 3.85373 16.545 4.41094L14.7974 6.48782C14.7214 6.58913 14.5948 6.63978 14.4682 6.63978C14.3668 6.63978 14.2655 6.61445 14.1896 6.53847C14.0123 6.36118 13.9869 6.08257 14.1389 5.90528L15.7852 3.95504H1.75361C1.50033 3.95504 1.29771 3.75241 1.29771 3.49914C1.29771 3.24586 1.50033 3.04324 1.75361 3.04324H15.7852L14.1389 1.093C13.9869 0.890376 14.0123 0.61177 14.1896 0.459804ZM15.0097 2.68302H1.75362C1.3014 2.68302 0.9375 3.04692 0.9375 3.49914C0.9375 3.95136 1.3014 4.31525 1.75362 4.31525H15.0097L13.8654 5.67085C13.8651 5.67123 13.8648 5.67161 13.8644 5.67199C13.5725 6.01385 13.646 6.50432 13.9348 6.79318C14.1022 6.96055 14.3113 7 14.4682 7C14.6795 7 14.9203 6.91713 15.0784 6.71335L16.8207 4.64286L16.8238 4.63904C17.382 3.95682 17.3958 3.00293 16.8455 2.35478C16.8453 2.35453 16.845 2.35429 16.8448 2.35404L15.0984 0.278534L15.0962 0.276033C14.8097 -0.0583053 14.3139 -0.0837548 13.9734 0.17163L13.964 0.17867L13.9551 0.186306C13.6208 0.472882 13.5953 0.968616 13.8507 1.30913L13.857 1.31743L15.0097 2.68302Z'
                  fill=''
                />
              </svg>
                }

            </Link>
        </li> 
                   
        )
    })


    return (
       
          
            <div className='rounded-md border border-stroke p-2 py-1 dark:border-strokedark sm:py-2.5 sm:px-2 xl:px-2.5'>
              <nav>
                
                <ol className='flex flex-wrap items-center gap-3'>
                  {linkRenderTemplate}
                </ol>
              </nav>
            </div>
          
       
      )



}

export default SectionLink;