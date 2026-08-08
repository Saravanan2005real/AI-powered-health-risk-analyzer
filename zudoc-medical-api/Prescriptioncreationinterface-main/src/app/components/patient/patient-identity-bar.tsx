import { Patient, Vitals } from '../../types/prescription';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Copy, UserCheck, AlertTriangle, Thermometer, Activity, Heart, Wind, Droplet, Candy, Ruler, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { VitalsEditDialog } from '../modals/vitals-edit-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface PatientIdentityBarProps {
  patient: Patient;
  isConfirmed: boolean;
  onConfirm: () => void;
  onSwitch: () => void;
  onVitalsUpdate: (vitals: Vitals) => void;
}

export function PatientIdentityBar({
  patient,
  isConfirmed,
  onConfirm,
  onSwitch,
  onVitalsUpdate
}: PatientIdentityBarProps) {
  const copyPatientId = () => {
    navigator.clipboard.writeText(patient.patientId);
    toast.success('Patient ID copied');
  };

  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [vitalsLastUpdated, setVitalsLastUpdated] = useState<Date | null>(null);

  const vitals = patient.vitals || {};
  const hasVitals = Object.values(vitals).some(v => v);

  // Format timestamp
  const getTimeAgo = (date: Date | null) => {
    if (!date) return 'Not recorded';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const vitalDisplay = [
    { key: 'temperature', label: 'Temp', icon: Thermometer, unit: '°F', color: 'text-red-500' },
    { key: 'bpSystolic', label: 'BP', icon: Activity, unit: '', color: 'text-purple-500', secondary: 'bpDiastolic' },
    { key: 'heartRate', label: 'HR', icon: Heart, unit: 'bpm', color: 'text-pink-500' },
    { key: 'spo2', label: 'SpO2', icon: Droplet, unit: '%', color: 'text-blue-500' },
    { key: 'respiratoryRate', label: 'RR', icon: Wind, unit: '/min', color: 'text-cyan-500' },
    { key: 'bloodSugar', label: 'BS', icon: Candy, unit: 'mg/dL', color: 'text-amber-500' },
  ];

  return (
    <>
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-start gap-6">
            <Avatar className="size-16 ring-2 ring-blue-100">
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {patient.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
                  {!isConfirmed && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="size-3" />
                      Verify Patient
                    </Badge>
                  )}
                  {isConfirmed && (
                    <Badge variant="default" className="gap-1 bg-green-600">
                      <UserCheck className="size-3" />
                      Confirmed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {patient.age}y / {patient.gender} / {patient.weight}kg
                  </span>
                  <span className="flex items-center gap-1">
                    {patient.patientId}
                    <button
                      onClick={copyPatientId}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy Patient ID"
                    >
                      <Copy className="size-3" />
                    </button>
                  </span>
                  <span>{patient.phone}</span>
                  {patient.guardian && <span>Guardian: {patient.guardian}</span>}
                </div>
              </div>
            </div>

            {/* Vitals Section - Between patient details and Switch button */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Vitals:</span>
                
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    {vitals.temperature && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Thermometer className="size-4 text-red-500" />
                            <span className="text-sm text-gray-700">{vitals.temperature}°F</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Temperature: {vitals.temperature}°F</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {(vitals.bpSystolic || vitals.bpDiastolic) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Activity className="size-4 text-purple-500" />
                            <span className="text-sm text-gray-700">{vitals.bpSystolic || '--'}/{vitals.bpDiastolic || '--'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Blood Pressure: {vitals.bpSystolic || '--'}/{vitals.bpDiastolic || '--'} mmHg</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {vitals.heartRate && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Heart className="size-4 text-pink-500" />
                            <span className="text-sm text-gray-700">{vitals.heartRate}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Heart Rate: {vitals.heartRate} bpm</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {vitals.spo2 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Droplet className="size-4 text-blue-500" />
                            <span className="text-sm text-gray-700">{vitals.spo2}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">SpO2: {vitals.spo2}%</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {!hasVitals && (
                      <span className="text-xs text-gray-500 italic">No vitals recorded</span>
                    )}
                  </TooltipProvider>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsEditingVitals(true)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit2 className="size-4 text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit vital signs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <span className="text-xs text-gray-500">
                Updated: {getTimeAgo(vitalsLastUpdated)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onSwitch} variant="outline" size="lg">
                Switch Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VitalsEditDialog
        isOpen={isEditingVitals}
        vitals={vitals}
        onClose={() => setIsEditingVitals(false)}
        onSave={(updatedVitals) => {
          onVitalsUpdate(updatedVitals);
          setVitalsLastUpdated(new Date());
          toast.success('Vitals updated successfully');
        }}
      />
    </>
  );
}