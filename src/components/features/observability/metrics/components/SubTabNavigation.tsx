import type { ReactNode } from 'react';

interface SubTabItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface SubTabNavigationProps {
  subTabs: SubTabItem[];
  activeSubTab: string;
  onSubTabChange: (subTabId: string) => void;
  className?: string;
}

export function SubTabNavigation({ subTabs, activeSubTab, onSubTabChange, className = '' }: SubTabNavigationProps) {
  return (
    <div className={`bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-${subTabs.length} ${className}`}>
      {subTabs.map((subTab) => {
        const isActive = activeSubTab === subTab.id;
        
        return (
          <button
            key={subTab.id}
            onClick={() => onSubTabChange(subTab.id)}
            className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 transition-all duration-200 ${
              isActive 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {subTab.icon}
            <span className="text-xs">{subTab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
