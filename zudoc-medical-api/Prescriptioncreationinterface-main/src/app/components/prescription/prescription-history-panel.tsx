import { useState } from 'react';
import { Calendar, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Prescription } from '../../types/prescription';
import { format, isSameDay } from 'date-fns';
import { Badge } from '../ui/badge';

interface PrescriptionHistoryPanelProps {
  patientId: string;
  previousPrescriptions: Prescription[];
  onCopyPrescription: (prescription: Prescription) => void;
}

export function PrescriptionHistoryPanel({
  patientId,
  previousPrescriptions,
  onCopyPrescription
}: PrescriptionHistoryPanelProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Prescription History</h3>
        <p className="text-xs text-gray-600">
          View and copy from previous prescriptions
        </p>
      </div>

      {!showCalendar ? (
        <div className="flex-1 flex items-center justify-center">
          <Button
            onClick={() => setShowCalendar(true)}
            variant="outline"
            className="gap-2"
          >
            <Calendar className="size-4" />
            Open Calendar
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-900">
              {format(today, 'MMMM yyyy')}
            </h4>
            <Button
              onClick={() => {
                setShowCalendar(false);
                setSelectedDate(null);
              }}
              variant="ghost"
              size="sm"
            >
              Close
            </Button>
          </div>

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
                    onClick={() => date && hasPrescription && setSelectedDate(date)}
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

          {/* Selected Prescription Details */}
          {selectedPrescription && (
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white">
              <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm text-gray-900">
                    {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                  </h5>
                  <Badge variant="outline" className="text-xs">
                    Rx #{selectedPrescription.rxId}
                  </Badge>
                </div>
                <Button
                  onClick={() => onCopyPrescription(selectedPrescription)}
                  size="sm"
                  className="w-full gap-2"
                >
                  <Copy className="size-3" />
                  Copy to Today's Prescription
                </Button>
              </div>

              <div className="p-3 space-y-3 text-xs">
                {/* Symptoms */}
                {selectedPrescription.symptoms && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Symptoms</div>
                    <div className="text-gray-600">{selectedPrescription.symptoms}</div>
                  </div>
                )}

                {/* Diagnoses */}
                {selectedPrescription.diagnoses.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Diagnosis</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPrescription.diagnoses.map((d, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {d.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {selectedPrescription.medications.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">
                      Medications ({selectedPrescription.medications.length})
                    </div>
                    <div className="space-y-2">
                      {selectedPrescription.medications.map((med, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium text-gray-900">{med.drugName}</div>
                          <div className="text-gray-600 mt-0.5">
                            {med.dose} | {med.frequency} | {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Tests */}
                {selectedPrescription.labTests && selectedPrescription.labTests.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">
                      Lab Tests ({selectedPrescription.labTests.length})
                    </div>
                    <div className="space-y-1">
                      {selectedPrescription.labTests.map((test, i) => (
                        <div key={i} className="text-gray-600">
                          • {test.testName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Notes</div>
                    <div className="text-gray-600">{selectedPrescription.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedPrescription && showCalendar && (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              Select a highlighted date to view prescription
            </div>
          )}
        </div>
      )}
    </div>
  );
}
