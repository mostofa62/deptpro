import React from 'react';
import './DataProgress.css';
interface DataProgressType{
    title:string;
    progress:string;
    color:string;
    amount:string;
}

const DataProgress = ({title, progress,color,amount}:DataProgressType)=>{


    return (
        <>
        <div className="skill-name">{title}</div>
        <div className="skill">
            <div className="skill-percent-number">{progress}%</div>
            
            <div className="skill-level">
                <div className="skill-percent" style={{ width:`${progress}%`, backgroundColor:color }}></div>
            </div>
            <div className="skill-amount">$ {amount}</div>
            
        </div>
        </>  
            
    
    )

}

export default DataProgress;