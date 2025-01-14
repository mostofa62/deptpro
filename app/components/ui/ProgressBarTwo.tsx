import React from 'react';

interface propsProgs{
  progress:number;
  title:string;
  progressColor?:string;
  amount:number;
}

function ProgressBarTwo({ progress, title,progressColor,amount }:propsProgs) {
  return (
    <div className="w-full flex flex-col gap-4">

        <div className='flex items-center justify-center'>
            <p className='text-[25px] text-[#595959] font-semibold'>${Intl.NumberFormat('en-US').format(amount)}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray rounded h-4">
            <div
            className={`h-4 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%`, backgroundColor:progressColor? `${progressColor}`:'#f0f9ff'  }}
            ></div>
        </div>

        <div className='flex items-center justify-center'>
            <span className="text-[13px] font-semibold text-[#4f4f4f] capitalize">{title}</span>
        </div>

        
      
      

      
    </div>
  );
}

export default ProgressBarTwo;
