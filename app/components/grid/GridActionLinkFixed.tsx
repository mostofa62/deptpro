import Link from "next/link";
import {  memo, useCallback, useState } from "react";

//const url = process.env.NEXT_PUBLIC_API_URL;



interface GridLinkProps{
    hoveredRowHeight:number|null;    
    items:{actionId:string,link:string, icon:Object,title:string,onClick?:()=>void}[]
}


const GridActionLinkFixed = memo(({hoveredRowHeight,items}:GridLinkProps)=>{

    const [hoveredButton, setHoveredButton] = useState<string>('');

    const setHoverId = useCallback((actionId:string)=>{
        setHoveredButton(actionId)
    },[])
    const removeHoverId = useCallback(()=>{
        setHoveredButton('')
    },[])



    return (

        <div  className={`px-2 flex flex-row bg-white gap-3 justify-center items-center`}>
            {
                items.map((v:any,i:any)=>{                    
                    
                    return(
                        
                        <div key={i} className={`flex flex-col items-center justify-center`}> 
                            <div className="h-auto">
                            {v.actionId == 'delete' || v.actionId == 'internal'?
                            <button 
                            onClick={v.onClick}
                            onMouseOver={()=>{setHoverId(v.actionId)}}
                            onMouseOut={removeHoverId}
                            className={`cursor-pointer hover:text-[#43ACD6]`}
                            >
                            {v.icon} 
                            </button>
                            :    
                            <Link  
                            onMouseOver={()=>{setHoverId(v.actionId)}}
                            onMouseOut={removeHoverId}
                            className={`cursor-pointer hover:text-[#43ACD6]`}  
                            href={v.link}>                        
                                {v.icon}                                    
                            </Link>
                            }
                            </div>

                            
                            
                            {hoveredButton == v.actionId &&
                            <div className="h-10 absolute top-9">
                            
                            <p className="bg-[#000000] py-1 px-2 rounded text-[13px] text-white font-medium">
                                {v.title}
                            </p>
                            
                            
                            </div>
                            }
                            
                        
                        </div>
                    )
                })
            }
            
        </div>
    )


});
// Set displayName for better debugging
GridActionLinkFixed.displayName = 'GridActionLinkFixed';
export default GridActionLinkFixed;