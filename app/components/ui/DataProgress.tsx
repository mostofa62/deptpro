import React, { useEffect, useState } from 'react';
import './DataProgress.css';
interface DataProgressType{
    title:string;
    progress:string;
    color:string;
    amount:string;
}

const DataProgress = ({title, progress,color,amount}:DataProgressType)=>{

    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        // Delay setting the animatedProgress to ensure transition occurs
        const timer = setTimeout(() => {
            setAnimatedProgress(parseFloat(progress));
        }, 100); // Adjust delay as needed

        return () => clearTimeout(timer);
    }, [progress]);


    return (
        <>
        <div className="skill-name">{title}</div>
        <div className="skill">
            <div className="skill-percent-number">{animatedProgress}%</div>
            
            <div className="skill-level">
                <div className="skill-percent transition-all duration-500" style={{ width:`${animatedProgress}%`, backgroundColor:color }}></div>
            </div>
            <div className="skill-amount">$ {amount}</div>
            
        </div>
        </>  
            
    
    )

}

export default DataProgress;