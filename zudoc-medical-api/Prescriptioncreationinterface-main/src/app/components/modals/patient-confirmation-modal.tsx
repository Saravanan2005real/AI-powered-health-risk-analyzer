import { Patient } from '../../types/prescription';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface PatientConfirmationModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PatientConfirmationModal({
  patient,
  isOpen,
  onConfirm,
  onCancel
}: PatientConfirmationModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!patient) return null;

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      setIsChecked(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setIsChecked(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="size-6 text-amber-600" />
            Confirm Patient Identity
          </DialogTitle>
          <DialogDescription>
            Verify that the patient details are correct before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="size-24 ring-4 ring-blue-100">
              <AvatarFallback className="bg-blue-500 text-white text-3xl">
                {patient.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{patient.name}</h3>
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">Age/Gender:</span> {patient.age} years /{' '}
                  {patient.gender}
                </p>
                <p>
                  <span className="font-medium">Weight:</span> {patient.weight} kg
                </p>
                <p>
                  <span className="font-medium">Patient ID:</span> {patient.patientId}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {patient.phone}
                </p>
                {patient.guardian && (
                  <p>
                    <span className="font-medium">Guardian:</span> {patient.guardian}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Last Visit:</span>{' '}
                  {new Date(patient.lastVisit).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox className="bg-[#130402] bg-[#130402] bg-[#2c0a05] bg-[#2d0a05] bg-[#2f0a06] bg-[#360c06] bg-[#3a0d07] bg-[#410f09] bg-[#421009] bg-[#4d130c] bg-[#56150d] bg-[#5d180e] bg-[#681b11] bg-[#701e13] bg-[#721e13] bg-[#137321]"
                id="confirm-patient"
                checked={isChecked}
                onCheckedChange={checked => setIsChecked(checked as boolean)}
              />
              <label htmlFor="confirm-patient" className="text-sm text-gray-700 cursor-pointer">
                <span className="font-semibold">I confirm this is the correct patient</span>
                <p className="text-xs text-gray-600 mt-1">
                  Please verify all patient details match before proceeding with prescription
                  creation.
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              This is not the patient
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isChecked}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Confirm & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}