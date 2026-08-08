import { Patient } from '../../types/prescription';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface CollapsibleAIPanelProps {
  children: React.ReactNode;
}

export function CollapsibleAIPanel({ children }: CollapsibleAIPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div 
        className="w-12 h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-blue-50 border-l border-gray-200 flex items-start justify-center pt-4 cursor-pointer hover:bg-blue-100 transition-colors overflow-hidden"
        onClick={() => setIsCollapsed(false)}
        title="Expand AI Assistant"
      >
        <div className="p-2">
          <Lightbulb className="size-5 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-gradient-to-br from-slate-50 to-blue-50 border-l border-gray-200 panel-transition h-full flex flex-col overflow-hidden">
      <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-200 z-10 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <Lightbulb className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Suggestions only. Nothing added automatically.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
            title="Collapse"
          >
            <ChevronRight className="size-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}