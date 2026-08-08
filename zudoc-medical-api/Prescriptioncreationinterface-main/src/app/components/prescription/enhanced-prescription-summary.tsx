import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Copy, Clock, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Prescription, Diagnosis } from '../../types/prescription';

import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';

interface EnhancedPrescriptionSummaryProps {
  currentPrescription: {
    symptoms: string;
    diagnoses: Diagnosis[];
    disorders: Diagnosis[];
    medications: Array<any>;
    labTests: Array<any>;
    radiologyOrders: Array<any>;
    surgeryOrders: Array<any>;
    investigations: string;
    notes: string;
    followUp: string;
  };
  previousPrescriptions: Prescription[];
  onSectionClick: (section: string) => void;
  onCopyPrescription: (prescription: Prescription) => void;
  onCopySymptoms: (symptoms: string) => void;
  onCopyDiagnoses: (diagnoses: Diagnosis[]) => void;
  onCopyMedications: (medications: Array<any>) => void;
  onCopyLabTests: (labTests: Array<any>) => void;
  onCopyRadiology: (radiology: Array<any>) => void;
  onCopySurgery: (surgery: Array<any>) => void;
  onCopyInvestigations: (investigations: string) => void;
  onCopyNotes: (notes: string) => void;
  onCopyFollowUp: (followUp: string) => void;
}

export function EnhancedPrescriptionSummary({
  currentPrescription,
  previousPrescriptions,
  onSectionClick,
  onCopyPrescription,
  onCopySymptoms,
  onCopyDiagnoses,
  onCopyMedications,
  onCopyLabTests,
  onCopyRadiology,
  onCopySurgery,
  onCopyInvestigations,
  onCopyNotes,
  onCopyFollowUp
}: EnhancedPrescriptionSummaryProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Track which buttons have been clicked (for tick/disable state)
  const [copiedButtons, setCopiedButtons] = useState<Record<string, boolean>>({});

  // Helper function to handle copy with 3-second cooldown
  const handleCopyWithCooldown = (key: string, copyFn: () => void) => {
    copyFn();
    setCopiedButtons(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedButtons(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  // Helper function to split symptoms by comma
  const parseSymptoms = (symptomsText: string) => {
    return symptomsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Get unique dates with prescriptions
  const prescriptionDates = previousPrescriptions
    .map(p => p.timestamp ? new Date(p.timestamp) : null)
    .filter((date): date is Date => date !== null);

  // Get prescription for selected date
  const selectedPrescription = selectedDate
    ? previousPrescriptions.find(p => 
        p.timestamp && isSameDay(new Date(p.timestamp), selectedDate)
      )
    : null;

  // Generate calendar for current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const hasPrescriptionOnDate = (date: Date | null) => {
    if (!date) return false;
    return prescriptionDates.some(pDate => isSameDay(pDate, date));
  };

  const handlePreviousPrescription = () => {
    if (historyIndex < previousPrescriptions.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setViewMode('history');
    }
  };

  const handleNextPrescription = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    } else if (historyIndex === 0) {
      setViewMode('current');
    }
  };

  const handleBackToCurrent = () => {
    setViewMode('current');
    setHistoryIndex(0);
    setShowCalendar(false);
    setSelectedDate(null);
  };

  const currentViewPrescription = viewMode === 'current' 
    ? null 
    : previousPrescriptions[historyIndex];

  const totalMedicationCount = viewMode === 'current' 
    ? currentPrescription.medications.length 
    : currentViewPrescription?.medications.length || 0;

  const totalLabCount = viewMode === 'current' 
    ? currentPrescription.labTests.length 
    : currentViewPrescription?.labTests?.length || 0;

  const totalRadiologyCount = viewMode === 'current' 
    ? currentPrescription.radiologyOrders.length 
    : currentViewPrescription?.radiologyOrders?.length || 0;

  const totalSurgeryCount = viewMode === 'current' 
    ? currentPrescription.surgeryOrders.length 
    : currentViewPrescription?.surgeryOrders?.length || 0;

  return (
    <div className="p-6">
      {/* Header with Navigation */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900">
            {viewMode === 'current' ? 'Current Prescription' : 'Previous Prescription'}
          </h3>
          <div className="flex items-center gap-1">
            {/* Calendar Toggle Button */}
            <Button
              onClick={() => {
                setShowCalendar(!showCalendar);
                if (!showCalendar) {
                  setViewMode('history');
                }
              }}
              variant={showCalendar ? 'default' : 'ghost'}
              size="sm"
              className="gap-1.5"
              title="View prescription calendar"
            >
              <Calendar className="size-4" />
            </Button>

            {/* Navigation Buttons */}
            {previousPrescriptions.length > 0 && (
              <>
                <Button
                  onClick={handlePreviousPrescription}
                  variant="ghost"
                  size="sm"
                  disabled={viewMode === 'history' && historyIndex >= previousPrescriptions.length - 1}
                  title="View older prescription"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  onClick={handleNextPrescription}
                  variant="ghost"
                  size="sm"
                  disabled={viewMode === 'current'}
                  title="View newer prescription"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {viewMode === 'current' ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <Clock className="size-3 mr-1" />
            Draft · In Progress
          </Badge>
        ) : currentViewPrescription && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              {currentViewPrescription.timestamp && 
                format(new Date(currentViewPrescription.timestamp), 'MMM dd, yyyy · h:mm a')
              }
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Rx #{currentViewPrescription.rxId}
            </Badge>
          </div>
        )}

        {/* Back to Current Button */}
        {viewMode === 'history' && !showCalendar && (
          <Button
            onClick={handleBackToCurrent}
            variant="outline"
            size="sm"
            className="mt-2 w-full"
          >
            Back to Current Draft
          </Button>
        )}
      </div>

      {/* Calendar View */}
      {showCalendar && (
        <div className="mb-4 space-y-3">
          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const hasPrescription = hasPrescriptionOnDate(date);
                const isSelected = date && selectedDate && isSameDay(date, selectedDate);
                const isToday = date && isSameDay(date, today);

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (date && hasPrescription) {
                        setSelectedDate(date);
                        const prescription = previousPrescriptions.find(p => 
                          p.timestamp && isSameDay(new Date(p.timestamp), date)
                        );
                        if (prescription) {
                          const idx = previousPrescriptions.indexOf(prescription);
                          setHistoryIndex(idx);
                          setViewMode('history');
                        }
                      }
                    }}
                    disabled={!date || !hasPrescription}
                    className={`
                      aspect-square text-xs rounded-md transition-colors relative
                      ${!date ? 'invisible' : ''}
                      ${hasPrescription 
                        ? 'bg-blue-100 text-blue-900 hover:bg-blue-200 cursor-pointer font-medium' 
                        : 'text-gray-400 cursor-not-allowed'
                      }
                      ${isSelected ? 'ring-2 ring-blue-600 bg-blue-600 text-white' : ''}
                      ${isToday && !isSelected ? 'ring-1 ring-gray-400' : ''}
                    `}
                  >
                    {date?.getDate()}
                    {hasPrescription && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Click a highlighted date to view that prescription
          </p>
        </div>
      )}

      {/* Copy Button for History View */}
      {viewMode === 'history' && currentViewPrescription && (
        <Button
          onClick={() => {
            onCopyPrescription(currentViewPrescription);
            handleBackToCurrent();
          }}
          size="sm"
          className="w-full mb-4 gap-2"
          variant="outline"
        >
          <Copy className="size-3" />
          Copy to Current Prescription
        </Button>
      )}

      {/* Summary Content */}
      <div className="space-y-3">
        {/* Symptoms */}
        {(viewMode === 'current' ? currentPrescription.symptoms : currentViewPrescription?.symptoms) && (() => {
          const symptomsText = viewMode === 'current' ? currentPrescription.symptoms : currentViewPrescription?.symptoms || '';
          const symptomTags = parseSymptoms(symptomsText);
          const hasMultipleSymptoms = symptomTags.length > 1;

          return (
            <div
              className={`w-full p-3 rounded-lg border transition-colors ${
                viewMode === 'current' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600">Symptoms</div>
                {viewMode === 'history' && currentViewPrescription?.symptoms && (
                  <Button
                    onClick={() => {
                      handleCopyWithCooldown('symptoms', () => {
                        onCopySymptoms(currentViewPrescription.symptoms);
                        toast.success('Symptoms copied to current prescription');
                      });
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    disabled={copiedButtons.symptoms}
                  >
                    {copiedButtons.symptoms ? <Check className="size-3" /> : <Copy className="size-3" />}
                  </Button>
                )}
              </div>
              <div
                onClick={() => viewMode === 'current' && onSectionClick('symptoms')}
                className={`${viewMode === 'current' ? 'cursor-pointer' : ''}`}
              >
                {hasMultipleSymptoms ? (
                  <div className="flex flex-wrap gap-1.5">
                    {symptomTags.slice(0, 5).map((symptom, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-white">
                        {symptom}
                      </Badge>
                    ))}
                    {symptomTags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{symptomTags.length - 5} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {symptomsText}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Diagnoses */}
        {((viewMode === 'current' && currentPrescription.diagnoses.length > 0) ||
          (viewMode === 'history' && currentViewPrescription?.diagnoses.length)) && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Diagnosis ({viewMode === 'current' ? currentPrescription.diagnoses.length : currentViewPrescription?.diagnoses.length})
              </div>
              {viewMode === 'history' && currentViewPrescription?.diagnoses && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('diagnoses', () => {
                      onCopyDiagnoses(currentViewPrescription.diagnoses);
                      toast.success('Diagnoses copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.diagnoses}
                >
                  {copiedButtons.diagnoses ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('diagnosis')}
              className={`flex flex-wrap gap-1.5 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.diagnoses : currentViewPrescription?.diagnoses || []).map((d, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {d.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Disorders */}
        {((viewMode === 'current' && currentPrescription.disorders.length > 0) ||
          (viewMode === 'history' && (currentViewPrescription as any)?.disorders?.length)) && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Disorders ({viewMode === 'current' ? currentPrescription.disorders.length : (currentViewPrescription as any)?.disorders?.length || 0})
              </div>
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('disorder')}
              className={`flex flex-wrap gap-1.5 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.disorders : (currentViewPrescription as any)?.disorders || []).map((d: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs bg-white">
                  {d.name}
                </Badge>
              ))}
            </div>
          </div>
        )}


        {/* Medications */}
        {totalMedicationCount > 0 && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Medications ({totalMedicationCount})
              </div>
              {viewMode === 'history' && currentViewPrescription?.medications && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('medications', () => {
                      onCopyMedications(currentViewPrescription.medications);
                      toast.success('Medications copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.medications}
                >
                  {copiedButtons.medications ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('medications')}
              className={`space-y-1.5 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.medications : currentViewPrescription?.medications || [])
                .slice(0, 3)
                .map((med, idx) => (
                  <div key={idx} className="text-xs text-gray-700 truncate">
                    • {med.drugName}
                  </div>
                ))}
              {totalMedicationCount > 3 && (
                <div className="text-xs text-gray-500">
                  +{totalMedicationCount - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab Tests */}
        {totalLabCount > 0 && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Lab Tests ({totalLabCount})
              </div>
              {viewMode === 'history' && currentViewPrescription?.labTests && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('labTests', () => {
                      onCopyLabTests(currentViewPrescription.labTests || []);
                      toast.success('Lab tests copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.labTests}
                >
                  {copiedButtons.labTests ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('lab')}
              className={`space-y-1 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.labTests : currentViewPrescription?.labTests || [])
                .slice(0, 2)
                .map((test, idx) => (
                  <div key={idx} className="text-xs text-gray-700 truncate">
                    • {test.testName}
                  </div>
                ))}
              {totalLabCount > 2 && (
                <div className="text-xs text-gray-500">
                  +{totalLabCount - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Radiology */}
        {totalRadiologyCount > 0 && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-cyan-50 border-cyan-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Radiology ({totalRadiologyCount})
              </div>
              {viewMode === 'history' && currentViewPrescription?.radiologyOrders && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('radiologyOrders', () => {
                      onCopyRadiology(currentViewPrescription.radiologyOrders || []);
                      toast.success('Radiology orders copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.radiologyOrders}
                >
                  {copiedButtons.radiologyOrders ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('radiology')}
              className={`space-y-1 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.radiologyOrders : currentViewPrescription?.radiologyOrders || [])
                .slice(0, 2)
                .map((order, idx) => (
                  <div key={idx} className="text-xs text-gray-700 truncate">
                    • {order.procedureName} - {order.bodyPart}
                  </div>
                ))}
              {totalRadiologyCount > 2 && (
                <div className="text-xs text-gray-500">
                  +{totalRadiologyCount - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Surgery */}
        {totalSurgeryCount > 0 && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Surgery ({totalSurgeryCount})
              </div>
              {viewMode === 'history' && currentViewPrescription?.surgeryOrders && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('surgeryOrders', () => {
                      onCopySurgery(currentViewPrescription.surgeryOrders || []);
                      toast.success('Surgery orders copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.surgeryOrders}
                >
                  {copiedButtons.surgeryOrders ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('surgery')}
              className={`space-y-1 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {(viewMode === 'current' ? currentPrescription.surgeryOrders : currentViewPrescription?.surgeryOrders || [])
                .slice(0, 2)
                .map((order, idx) => (
                  <div key={idx} className="text-xs text-gray-700 truncate">
                    • {order.surgeryName}
                  </div>
                ))}
              {totalSurgeryCount > 2 && (
                <div className="text-xs text-gray-500">
                  +{totalSurgeryCount - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Investigations */}
        {(viewMode === 'current' ? currentPrescription.investigations : currentViewPrescription?.investigations) && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-600">Investigations</div>
              {viewMode === 'history' && currentViewPrescription?.investigations && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('investigations', () => {
                      onCopyInvestigations(currentViewPrescription.investigations);
                      toast.success('Investigations copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.investigations}
                >
                  {copiedButtons.investigations ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('investigations')}
              className={`text-sm text-gray-900 line-clamp-2 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {viewMode === 'current' ? currentPrescription.investigations : currentViewPrescription?.investigations}
            </div>
          </div>
        )}

        {/* Notes */}
        {(viewMode === 'current' ? currentPrescription.notes : currentViewPrescription?.notes) && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-600">Notes</div>
              {viewMode === 'history' && currentViewPrescription?.notes && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('notes', () => {
                      onCopyNotes(currentViewPrescription.notes);
                      toast.success('Notes copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.notes}
                >
                  {copiedButtons.notes ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('notes')}
              className={`text-sm text-gray-900 line-clamp-3 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {viewMode === 'current' ? currentPrescription.notes : currentViewPrescription?.notes}
            </div>
          </div>
        )}

        {/* Follow-up */}
        {(viewMode === 'current' ? currentPrescription.followUp : currentViewPrescription?.followUp) && (
          <div
            className={`w-full p-3 rounded-lg border transition-colors ${
              viewMode === 'current' 
                ? 'bg-teal-50 border-teal-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-600">Follow-up</div>
              {viewMode === 'history' && currentViewPrescription?.followUp && (
                <Button
                  onClick={() => {
                    handleCopyWithCooldown('followUp', () => {
                      onCopyFollowUp(currentViewPrescription.followUp);
                      toast.success('Follow-up copied to current prescription');
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  disabled={copiedButtons.followUp}
                >
                  {copiedButtons.followUp ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
              )}
            </div>
            <div
              onClick={() => viewMode === 'current' && onSectionClick('followup')}
              className={`text-sm text-gray-900 ${viewMode === 'current' ? 'cursor-pointer' : ''}`}
            >
              {viewMode === 'current' ? currentPrescription.followUp : currentViewPrescription?.followUp}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}