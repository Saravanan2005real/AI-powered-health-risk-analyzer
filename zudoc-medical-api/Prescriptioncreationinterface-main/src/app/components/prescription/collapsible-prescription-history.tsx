import { useState, ReactNode } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface CollapsiblePrescriptionHistoryProps {
  children: ReactNode;
}

export function CollapsiblePrescriptionHistory({ children }: CollapsiblePrescriptionHistoryProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative h-full flex">
      {/* Collapsible Panel */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'w-0' : 'w-80'
        }`}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="outline"
        size="sm"
        className="absolute -right-3 top-4 z-10 h-8 w-6 rounded-full p-0 bg-white border border-gray-300 shadow-md hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="size-4" />
        ) : (
          <ChevronLeft className="size-4" />
        )}
      </Button>
    </div>
  );
}
