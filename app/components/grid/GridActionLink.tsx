import Link from "next/link";
import {  useState } from "react";

//const url = process.env.NEXT_PUBLIC_API_URL;



interface GridLinkProps{
    hoveredRowHeight:number|null;    
    items:{actionId:string,link:string, icon:Object,title:string,onClick?:()=>void}[]
}


const GridActionLink = ({hoveredRowHeight,items}:GridLinkProps)=>{

    const [hoveredButton, setHoveredButton] = useState<string>('');

    const setHoverId = (actionId:string)=>{
        setHoveredButton(actionId)
    }
    const removeHoverId = ()=>{
        setHoveredButton('')
    }



    return (

        <div  style={{ height:`${hoveredRowHeight && hoveredRowHeight-1}px`,paddingTop:`${hoveredRowHeight && ((hoveredRowHeight/2-12))}px`, paddingBottom:`${hoveredRowHeight && ((hoveredRowHeight/2-11))}px` }} className={`absolute float-right right-3.5 px-3.5 w-[160px] flex flex-row bg-white`}>
            {
                items.map((v:any,i:any)=>{                    
                    
                    return(
                        
                        <div key={i} className={`flex flex-col items-center ${i > 0 && 'ml-[30px]'}`}> 
                            <div className="h-[50px]">
                            {v.actionId == 'delete'?
                            <button 
                            onClick={v.onClick}
                            onMouseOver={()=>{setHoverId(v.actionId)}}
                            onMouseOut={removeHoverId}
                            className={`cursor-pointer hover:text-[#0166FF]`}
                            >
                            {v.icon} 
                            </button>
                            :    
                            <Link  
                            onMouseOver={()=>{setHoverId(v.actionId)}}
                            onMouseOut={removeHoverId}
                            className={`cursor-pointer hover:text-[#0166FF]`}  
                            href={v.link}>                        
                                {v.icon}                                    
                            </Link>
                            }
                            </div>

                            
                            
                            {hoveredButton == v.actionId &&
                            <div className="h-[25px] absolute top-[50px]">
                            
                            <p className="bg-[#000000] py-1 px-2 rounded text-[14px] text-white font-medium">
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


}

export default GridActionLink;