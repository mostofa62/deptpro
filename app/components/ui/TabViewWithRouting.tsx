'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CardHolderDefault from './CardHolderDefault';

interface Tab {
  label: string;
  route: string; // Route instead of content
}

interface TabProps {
  tabs: Tab[];
  title?: string;
  flow?: 'horizontal' | 'vertical';
  currentRoute: string; // Used to highlight the active tab
}

const TabViewWithRouting = ({ tabs, title, flow = 'horizontal', currentRoute }: TabProps) => {
  const router = useRouter();

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
            {tabs.map((tab, index) => {
              const isActive = currentRoute === tab.route;

              return (
                <button
                  key={index}
                  className={`px-4 py-2 font-medium text-md focus:outline-none capitalize ${
                    isActive
                      ? 'border-b-4 border-blue-500 text-blue-600'
                      : 'border-b-2 border-transparent text-gray-600 hover:text-blue-500'
                  } ${flow === 'vertical' ? 'text-left w-full' : ''}`}
                  onClick={() => {
                    if (!isActive) {
                      router.push(tab.route);
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CardHolderDefault>
  );
};

export default TabViewWithRouting;
