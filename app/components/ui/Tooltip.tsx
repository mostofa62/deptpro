// Tooltip.tsx
import IconInfoCircleFill from '@/app/images/icon/IconInfoCircleFill';
import React, { useState } from 'react';

interface TooltipProps {
  text: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
     
    >

      <IconInfoCircleFill
        className='absolute left-2/3 top-1' 
        width={20} 
        height={20} 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />  

      {/* <svg 
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}
         className='absolute left-2/3 top-1' width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>     */}
      
      {children}
      
      {isVisible && (
        <div className="w-full z-999999 absolute capitalize bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#43acd6] text-white text-[12px] rounded shadow-lg whitespace-nowrap font-medium">
          {text}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 mt-2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #43acd6",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
