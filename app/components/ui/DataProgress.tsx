import React, { useEffect, useState } from 'react';
interface DataProgressType{
    title:string;
    progress:string;
    color:string;
    amount?:string;
    maxProgressLength: number;
    maxAmountLength?:number;
}

const DataProgress = ({title, progress,color,amount,maxProgressLength, maxAmountLength}:DataProgressType)=>{

    const [animatedProgress, setAnimatedProgress] = useState(0);
    

    useEffect(() => {
        // Delay setting the animatedProgress to ensure transition occurs
        const timer = setTimeout(() => {
            setAnimatedProgress(parseFloat(progress));
        }, 100); // Adjust delay as needed

        return () => clearTimeout(timer);
    }, [progress]);

    const maxAmountLengthVar:number = maxAmountLength ?maxAmountLength:0;


    return (
        <div className='flex flex-col gap-1 mb-2'>
            <div className="flex justify-start items-start">
                <div className="w-auto font-semibold invisible" style={{ width: `${maxProgressLength}ch` }}>{animatedProgress}%</div>    
                <div className="w-auto font-semibold" style={{ marginLeft: `${maxProgressLength}%` }}>{title}</div>
            </div>
            <div className="flex flex-row">
                <div className={`w-auto font-semibold`} style={{ width: `${maxProgressLength}ch` }}>{animatedProgress}%</div>
                
                <div className="h-3 bg-[#eeeeee] rounded-[10px] overflow-hidden" style={{ marginLeft: `${maxProgressLength}%` ,width: `calc(80% - ${maxAmountLengthVar+30}px)` }}>
                    <div className="h-full transition-all duration-500" style={{ width:`${animatedProgress}%`, backgroundColor:color }}></div>
                </div>
                {amount  && <div className="w-auto font-semibold text-right ml-[2%]">${amount}</div> }
                
            </div>
        </div>  
            
    
    )

}

export default DataProgress;