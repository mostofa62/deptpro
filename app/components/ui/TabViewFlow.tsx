import React, { useState } from 'react';
import CardHolderDefault from './CardHolderDefault';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabProps {
  tabs: Tab[];
  title?: string;
  flow?: 'horizontal' | 'vertical';
  onChageTab: (index: number) => void;
}

const TabView = ({ tabs, title, onChageTab, flow = 'horizontal' }: TabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <CardHolderDefault>
      <div className="w-full">
        {title && <span className="text-md capitalize font-medium">{title}</span>}

        <div className={`flex ${flow === 'vertical' ? 'flex-row gap-4' : 'flex-col'}`}>
          {/* Tab Labels */}
          <div
            className={`flex ${
              flow === 'vertical' ? 'flex-col w-1/4' : 'flex-row'
            }`}
          >
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 font-medium text-md focus:outline-none capitalize ${
                  activeTab === index
                    ? 'border-b-4 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-600 hover:text-blue-500'
                } ${flow === 'vertical' ? 'text-left w-full' : ''}`}
                onClick={() => {
                  setActiveTab(index);
                  onChageTab(index);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 flex-1  rounded-sm">
            {tabs[activeTab].content}
          </div>
        </div>
      </div>
    </CardHolderDefault>
  );
};

export default TabView;
