import { useState } from 'react';
import { Patient } from '../../types/prescription';
import { mockPatients, mockDoctor } from '../../data/mockData';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Search, User, Bell, Wifi, WifiOff, Printer, Settings, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';

interface TopNavBarProps {
  onPatientSearchClick: () => void;
  selectedPatient: Patient | null;
  onOpenSettings?: () => void;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
}

export function TopNavBar({ onPatientSearchClick, selectedPatient, onOpenSettings, zenMode, onToggleZenMode }: TopNavBarProps) {
  const [isOnline] = useState(true);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-14">
      <div className="h-full flex items-center gap-4 px-6">
        {/* LEFT: Patient Search */}
        <button
          onClick={onPatientSearchClick}
          className="flex items-center gap-2 px-4 h-9 border border-gray-300 rounded-md hover:border-gray-400 transition-colors bg-white min-w-[320px]"
        >
          <Search className="size-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {selectedPatient ? 'Search another patient...' : 'Search patient...'}
          </span>
        </button>

        {/* CENTER: Title */}
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-gray-900">Zudoc</h1>
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-3">
          {/* Zen Mode Toggle */}
          {onToggleZenMode && (
            <button
              onClick={onToggleZenMode}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${zenMode ? 'bg-purple-100' : ''}`}
              title={zenMode ? 'Exit Zen Mode' : 'Zen Mode (Hide Tips)'}
            >
              {zenMode ? (
                <EyeOff className="size-4 text-purple-600" />
              ) : (
                <Eye className="size-4 text-gray-600" />
              )}
            </button>
          )}

          {/* User Profile */}
          <button
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title={mockDoctor.name}
          >
            <User className="size-4 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors relative" title="Notifications">
            <Bell className="size-4 text-gray-600" />
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Internet Status */}
          <div className="p-2" title={isOnline ? 'Online' : 'Offline'}>
            {isOnline ? (
              <Wifi className="size-4 text-green-600" />
            ) : (
              <WifiOff className="size-4 text-red-600" />
            )}
          </div>

          {/* Printer */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Printer">
            <Printer className="size-4 text-gray-600" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Settings"
          >
            <Settings className="size-4 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}