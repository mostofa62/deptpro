import React from 'react';

function ProgressBarOne({ progress, title }:any) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="bg-gray rounded h-4">
        <div
          className="bg-secondary h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Title and Percentage Container */}
      <div className="flex justify-between my-2">
        <span className="text-sm font-semibold text-bodydark2 uppercase">{title}</span>
        <span className="text-sm font-semibold text-bodydark2">{progress}%</span>
      </div>
    </div>
  );
}

export default ProgressBarOne;
