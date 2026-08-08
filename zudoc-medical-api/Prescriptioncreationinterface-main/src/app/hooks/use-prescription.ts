import { useState } from 'react';
import { Diagnosis, Medication, LabTest, RadiologyOrder, SurgeryOrder } from '../types/prescription';
import { toast } from 'sonner';

export function usePrescription() {
  const [symptoms, setSymptoms] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [disorders, setDisorders] = useState<Diagnosis[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>([]);
  const [surgeryOrders, setSurgeryOrders] = useState<SurgeryOrder[]>([]);
  const [ayushTreatments, setAyushTreatments] = useState<Diagnosis[]>([]);
  const [dentalTreatments, setDentalTreatments] = useState<Diagnosis[]>([]);
  const [nursingCare, setNursingCare] = useState<Diagnosis[]>([]);
  const [vetDetails, setVetDetails] = useState<Diagnosis[]>([]);
  
  const [patientAllergies, setPatientAllergies] = useState<Diagnosis[]>([]);
  const [patientVaccinations, setPatientVaccinations] = useState<Diagnosis[]>([]);
  const [patientConditions, setPatientConditions] = useState<Diagnosis[]>([]);
  const [organDonorship, setOrganDonorship] = useState('');

  const [investigations, setInvestigations] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('None');

  const handleAddDiagnosis = (diagnosis: Diagnosis) => {
    setDiagnoses((prev) => [...prev, diagnosis]);
    if (diagnosis.addedFromAI) toast.success("Diagnosis added from AI suggestion");
  };

  const handleRemoveDiagnosis = (id: string) => {
    setDiagnoses((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDisorder = (disorder: Diagnosis) => {
    setDisorders((prev) => [...prev, disorder]);
  };

  const handleRemoveDisorder = (id: string) => {
    setDisorders((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddMedication = (medication: Medication) => {
    setMedications((prev) => [...prev, medication]);
    if (medication.addedFromAI) toast.success("Medication added from AI suggestion");
  };

  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEditMedication = (id: string, updatedMedication: Medication) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...updatedMedication, id } : m)));
    toast.success("Medication updated successfully");
  };

  const handleAddLabTest = (labTest: LabTest) => {
    setLabTests((prev) => [...prev, labTest]);
    if (labTest.addedFromAI) toast.success("Lab test added from AI suggestion");
  };

  const handleRemoveLabTest = (id: string) => {
    setLabTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditLabTest = (id: string, updatedTest: LabTest) => {
    setLabTests((prev) => prev.map((t) => (t.id === id ? { ...updatedTest, id } : t)));
    toast.success("Lab test updated successfully");
  };

  const handleAddRadiologyOrder = (order: RadiologyOrder) => {
    setRadiologyOrders((prev) => [...prev, order]);
    if (order.addedFromAI) toast.success("Radiology order added from AI suggestion");
  };

  const handleRemoveRadiologyOrder = (id: string) => {
    setRadiologyOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleEditRadiologyOrder = (id: string, updatedOrder: RadiologyOrder) => {
    setRadiologyOrders((prev) => prev.map((o) => (o.id === id ? { ...updatedOrder, id } : o)));
    toast.success("Radiology order updated successfully");
  };

  const handleAddSurgeryOrder = (order: SurgeryOrder) => {
    setSurgeryOrders((prev) => [...prev, order]);
    if (order.addedFromAI) toast.success("Surgery order added from AI suggestion");
  };

  const handleRemoveSurgeryOrder = (id: string) => {
    setSurgeryOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleEditSurgeryOrder = (id: string, updatedOrder: SurgeryOrder) => {
    setSurgeryOrders((prev) => prev.map((o) => (o.id === id ? { ...updatedOrder, id } : o)));
    toast.success("Surgery order updated successfully");
  };

  const handleAddAyushTreatment = (treatment: Diagnosis) => {
    setAyushTreatments((prev) => [...prev, treatment]);
  };

  const handleRemoveAyushTreatment = (id: string) => {
    setAyushTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddDentalTreatment = (treatment: Diagnosis) => {
    setDentalTreatments((prev) => [...prev, treatment]);
  };

  const handleRemoveDentalTreatment = (id: string) => {
    setDentalTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNursingCare = (care: Diagnosis) => {
    setNursingCare((prev) => [...prev, care]);
  };

  const handleRemoveNursingCare = (id: string) => {
    setNursingCare((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddVetDetail = (detail: Diagnosis) => {
    setVetDetails((prev) => [...prev, detail]);
  };

  const handleRemoveVetDetail = (id: string) => {
    setVetDetails((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddPatientAllergy = (allergy: Diagnosis) => {
    setPatientAllergies((prev) => [...prev, allergy]);
  };

  const handleRemovePatientAllergy = (id: string) => {
    setPatientAllergies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddPatientVaccination = (vaccination: Diagnosis) => {
    setPatientVaccinations((prev) => [...prev, vaccination]);
  };

  const handleRemovePatientVaccination = (id: string) => {
    setPatientVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddPatientCondition = (condition: Diagnosis) => {
    setPatientConditions((prev) => [...prev, condition]);
  };

  const handleRemovePatientCondition = (id: string) => {
    setPatientConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const resetPrescription = () => {
    setSymptoms("");
    setDiagnoses([]);
    setDisorders([]);
    setMedications([]);
    setLabTests([]);
    setRadiologyOrders([]);
    setSurgeryOrders([]);
    setAyushTreatments([]);
    setDentalTreatments([]);
    setNursingCare([]);
    setVetDetails([]);
    setPatientAllergies([]);
    setPatientVaccinations([]);
    setPatientConditions([]);
    setOrganDonorship('');
    setInvestigations("");
    setNotes("");
    setFollowUp("None");
  };

  const restorePrescription = (prescription: any) => {
    setSymptoms(prescription.symptoms || "");
    setDiagnoses(prescription.diagnoses || []);
    setDisorders(prescription.disorders || []);
    setMedications(prescription.medications || []);
    setLabTests(prescription.labTests || []);
    setRadiologyOrders(prescription.radiologyOrders || []);
    setSurgeryOrders(prescription.surgeryOrders || []);
    setAyushTreatments(prescription.ayushTreatments || []);
    setDentalTreatments(prescription.dentalTreatments || []);
    setNursingCare(prescription.nursingCare || []);
    setVetDetails(prescription.vetDetails || []);
    setPatientAllergies(prescription.patientAllergies || []);
    setPatientVaccinations(prescription.patientVaccinations || []);
    setPatientConditions(prescription.patientConditions || []);
    setOrganDonorship(prescription.organDonorship || "");
    setInvestigations(prescription.investigations || "");
    setNotes(prescription.notes || "");
    setFollowUp(prescription.followUp || "None");
  };

  return {
    symptoms, setSymptoms,
    diagnoses, setDiagnoses, handleAddDiagnosis, handleRemoveDiagnosis,
    disorders, setDisorders, handleAddDisorder, handleRemoveDisorder,
    medications, setMedications, handleAddMedication, handleRemoveMedication, handleEditMedication,
    labTests, setLabTests, handleAddLabTest, handleRemoveLabTest, handleEditLabTest,
    radiologyOrders, setRadiologyOrders, handleAddRadiologyOrder, handleRemoveRadiologyOrder, handleEditRadiologyOrder,
    surgeryOrders, setSurgeryOrders, handleAddSurgeryOrder, handleRemoveSurgeryOrder, handleEditSurgeryOrder,
    ayushTreatments, setAyushTreatments, handleAddAyushTreatment, handleRemoveAyushTreatment,
    dentalTreatments, setDentalTreatments, handleAddDentalTreatment, handleRemoveDentalTreatment,
    nursingCare, setNursingCare, handleAddNursingCare, handleRemoveNursingCare,
    vetDetails, setVetDetails, handleAddVetDetail, handleRemoveVetDetail,
    patientAllergies, setPatientAllergies, handleAddPatientAllergy, handleRemovePatientAllergy,
    patientVaccinations, setPatientVaccinations, handleAddPatientVaccination, handleRemovePatientVaccination,
    patientConditions, setPatientConditions, handleAddPatientCondition, handleRemovePatientCondition,
    organDonorship, setOrganDonorship,
    investigations, setInvestigations,
    notes, setNotes,
    followUp, setFollowUp,
    resetPrescription,
    restorePrescription
  };
}
