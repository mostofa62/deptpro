import React, { useState } from 'react';
import CardHolderDefault from './CardHolderDefault';

interface Tab {
  label: string;
  content: React.ReactNode;  
}

interface TabProps{
  tabs:Tab[],
  title?:string;
  align?:string;
  onChageTab:(index:number)=>void
}

const TabView = ({tabs,title,onChageTab,align}:TabProps) => {
    const [activeTab, setActiveTab] = useState(0);
  
    return (
      <CardHolderDefault>
      <div className="w-full">
        
        {title && <span className='text-md capitalize font-medium'>{title}</span>}
        <div className={`flex flex-row${align ? '':'-reverse'} border-b border-gray-200`}>
        
          
          {tabs.map((tab:any, index:any) => (
            <button
              key={index}
              className={`px-4 py-2 -mb-px font-medium text-md focus:outline-none ${
                activeTab === index
                  ? 'border-b-4 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => {
                setActiveTab(index)
                onChageTab(index)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-1">
          {tabs[activeTab].content}
        </div>
      </div>
    </CardHolderDefault>  
    );
  };
  
  export default TabView;