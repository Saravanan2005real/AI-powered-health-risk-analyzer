import { useState } from 'react';
import { Patient, Vitals } from '../types/prescription';
import { toast } from 'sonner';

export function usePatient() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientConfirmed, setIsPatientConfirmed] = useState(false);
  const [proceedToPrescription, setProceedToPrescription] = useState(false);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientConfirmed(false);
    setProceedToPrescription(false);
  };

  const handlePatientConfirm = () => {
    setIsPatientConfirmed(true);
    toast.success("Patient identity confirmed");
  };

  const handleSwitchPatient = () => {
    setSelectedPatient(null);
    setIsPatientConfirmed(false);
    setProceedToPrescription(false);
  };

  const handleVitalsUpdate = (vitals: Vitals) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        vitals,
      });
    }
  };

  return {
    selectedPatient,
    setSelectedPatient,
    isPatientConfirmed,
    setIsPatientConfirmed,
    proceedToPrescription,
    setProceedToPrescription,
    handlePatientSelect,
    handlePatientConfirm,
    handleSwitchPatient,
    handleVitalsUpdate
  };
}
