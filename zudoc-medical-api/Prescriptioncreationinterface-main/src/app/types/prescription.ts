// Type definitions for the prescription system

export interface Vitals {
  temperature?: string;
  bpSystolic?: string;
  bpDiastolic?: string;
  heartRate?: string;
  respiratoryRate?: string;
  spo2?: string;
  bloodSugar?: string;
  height?: string;
  [key: string]: string | undefined;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  weight: number;
  phone: string;
  patientId: string;
  lastVisit: string;
  avatar?: string;
  guardian?: string;
  allergies: string[];
  conditions: string[];
  visitType: string;
  vitals?: Vitals;
}

export interface Doctor {
  id?: string;
  name: string;
  specialty: string;
  clinic: string;
  registrationNo: string;
  signature: string;
}

export interface Medication {
  id: string;
  drugName: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
  addedFromAI?: boolean;
  snomedId?: string;
}

export interface LabTest {
  id: string;
  testName: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  instructions?: string;
  addedFromAI?: boolean;
  snomedId?: string;
}

export interface RadiologyOrder {
  id: string;
  procedureName: string;
  bodyPart: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  contrast?: boolean;
  instructions?: string;
  addedFromAI?: boolean;
  snomedId?: string;
}

export interface SurgeryOrder {
  id: string;
  procedureName: string;
  urgency: 'Elective' | 'Urgent' | 'Emergency';
  estimatedDuration?: string;
  anesthesiaType?: string;
  instructions?: string;
  addedFromAI?: boolean;
  snomedId?: string;
}

export interface Diagnosis {
  id: string;
  name: string;
  addedFromAI?: boolean;
  snomedId?: string;
}

export interface AISuggestion {
  type: 'diagnosis' | 'medication' | 'instruction';
  title: string;
  content: string;
  confidence?: number;
  rationale?: string;
  warning?: string;
}

export interface SafetyCheck {
  type: 'interaction' | 'dose' | 'allergy' | 'duplicate';
  severity: 'ok' | 'warning' | 'severe';
  message: string;
  explanation?: string;
}

export interface Prescription {
  patient: Patient;
  doctor: Doctor;
  symptoms: string;
  diagnoses: Diagnosis[];
  disorders: Diagnosis[];
  medications: Medication[];
  labTests: LabTest[];
  radiologyOrders: RadiologyOrder[];
  surgeryOrders: SurgeryOrder[];
  ayushTreatments: Diagnosis[];
  dentalTreatments: Diagnosis[];
  nursingCare: Diagnosis[];
  vetDetails: Diagnosis[];
  patientAllergies: Diagnosis[];
  patientVaccinations: Diagnosis[];
  patientConditions: Diagnosis[];
  organDonorship: string;
  investigations: string;
  notes: string;
  followUp: string;
  rxId?: string;
  timestamp?: string;
}