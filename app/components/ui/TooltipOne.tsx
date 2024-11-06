// TooltipOne.tsx
import IconInfoCircleFill from '@/app/images/icon/IconInfoCircleFill';
import React, { useState } from 'react';

interface TooltipOneProps {
  text: React.ReactNode;
}

const TooltipOne: React.FC<TooltipOneProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <IconInfoCircleFill
        className="cursor-pointer mt-1"
        width={17}
        height={17}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />

      {isVisible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-[#43acd6] text-white text-[12px] rounded shadow-lg whitespace-nowrap font-medium min-w-[250px] max-w-[300px]">
          {text}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
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

export default TooltipOne;
