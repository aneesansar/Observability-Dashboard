import type { ReactNode } from 'react';

interface TabItem {
  id: string;
  name: string;
  icon: ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({ tabs, activeTab, onTabChange, className = '' }: TabNavigationProps) {
  return (
    <div className={`bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-${tabs.length} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 transition-all duration-200 ${
              isActive 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span className="text-xs">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
