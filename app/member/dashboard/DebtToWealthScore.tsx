import PolyGonSvg from "@/app/images/icon/polygon";
import React from "react";
interface DebtProps{
    title:string;
    amount:number;
}
const DebtToWealthScore = ({title, amount}:DebtProps) => {
  return (
    <div>

        
      
      <PolyGonSvg title={title} amount={amount} width={300} height={180}/>
      
    </div>
    
  );
};

export default DebtToWealthScore;
