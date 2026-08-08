import { useState } from 'react';
import { mockPatients } from '../../data/mockData';
import { Patient, Prescription } from '../../types/prescription';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface PatientOverviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentPatientId: string | null;
  onCopyDiagnosis: (diagnosis: string) => void;
  onCopyMedication: (med: any) => void;
  onCopyNotes: (notes: string) => void;
}

export function PatientOverviewPopup({
  isOpen,
  onClose,
  currentPatientId,
  onCopyDiagnosis,
  onCopyMedication,
  onCopyNotes
}: PatientOverviewPopupProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Mock previous prescription data
  const mockPreviousData: Record<string, any> = {
    'P-10021': {
      lastVisit: '2026-02-10',
      diagnoses: ['Viral Fever', 'Upper Respiratory Tract Infection'],
      medications: [
        { drugName: 'Paracetamol Syrup 250mg/5ml', dose: '5ml', frequency: '1-1-1', duration: '3 days', route: 'Oral', instructions: 'After food' }
      ],
      notes: 'Increase fluid intake. Rest advised.'
    },
    'P-88002': {
      lastVisit: '2026-01-25',
      diagnoses: ['Hypertension', 'Osteoarthritis'],
      medications: [
        { drugName: 'Amlodipine 5mg', dose: '1 tab', frequency: '0-0-1', duration: '30 days', route: 'Oral', instructions: 'After dinner' },
        { drugName: 'Paracetamol Tablet 500mg', dose: '1 tab', frequency: 'SOS', duration: '7 days', route: 'Oral', instructions: 'After food' }
      ],
      notes: 'Monitor BP regularly. Joint pain management with heat therapy.'
    }
  };

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);
  const previousData = selectedPatientId ? mockPreviousData[selectedPatientId] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Patient Overview</span>
          </DialogTitle>
          <DialogDescription>
            View patient history and copy elements from previous prescriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Left: Patient List */}
          <div className="w-1/3 border-r overflow-y-auto pr-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Patient</h3>
            <div className="space-y-2">
              {mockPatients
                .filter(p => p.id !== currentPatientId)
                .map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedPatientId === patient.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                        {patient.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                      <p className="text-xs text-gray-600">
                        {patient.age}y/{patient.gender} · {patient.patientId}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Right: Previous Data */}
          <div className="flex-1 overflow-y-auto">
            {!selectedPatient && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a patient to view their previous prescriptions
              </div>
            )}

            {selectedPatient && previousData && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {selectedPatient.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-sm text-gray-600">
                        Last visit: {new Date(previousData.lastVisit).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Previous Diagnoses */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Previous Diagnoses</h4>
                  </div>
                  <div className="space-y-2">
                    {previousData.diagnoses.map((diagnosis: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{diagnosis}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onCopyDiagnosis(diagnosis);
                            toast.success(`Copied: ${diagnosis}`);
                          }}
                        >
                          <Copy className="size-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Medications */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Previous Medications</h4>
                  </div>
                  <div className="space-y-3">
                    {previousData.medications.map((med: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-gray-900">{med.drugName}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              onCopyMedication(med);
                              toast.success(`Copied: ${med.drugName}`);
                            }}
                          >
                            <Copy className="size-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600">
                          {med.dose} · {med.frequency} · {med.duration} · {med.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Notes */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Previous Notes</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onCopyNotes(previousData.notes);
                        toast.success('Notes copied');
                      }}
                    >
                      <Copy className="size-3 mr-1" />
                      Copy All
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{previousData.notes}</p>
                </div>
              </div>
            )}

            {selectedPatient && !previousData && (
              <div className="flex items-center justify-center h-full text-gray-500">
                No previous prescription data available
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}