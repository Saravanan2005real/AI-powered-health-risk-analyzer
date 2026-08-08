import { Patient, Doctor, Prescription } from '../types/prescription';

// Mock doctor (logged in)
export const mockDoctor: Doctor = {
  name: 'Dr. Neha Iyer',
  specialty: 'General Practice',
  clinic: 'Sunrise Clinic',
  registrationNo: 'KMC-12345',
  signature: 'Dr. Neha Iyer, MBBS, MD'
};

// Mock doctors for referrals
export const mockDoctors: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    clinic: 'Heart Care Clinic',
    registrationNo: 'KMC-54321',
    signature: 'Dr. Rajesh Kumar, MD (Cardiology)'
  },
  {
    id: 'D002',
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    clinic: 'Skin Care Center',
    registrationNo: 'KMC-11223',
    signature: 'Dr. Priya Sharma, MD (Dermatology)'
  },
  {
    id: 'D003',
    name: 'Dr. Amit Patel',
    specialty: 'Orthopedic Surgeon',
    clinic: 'Bone & Joint Clinic',
    registrationNo: 'KMC-33445',
    signature: 'Dr. Amit Patel, MS (Orthopedics)'
  },
  {
    id: 'D004',
    name: 'Dr. Sneha Reddy',
    specialty: 'Pediatrician',
    clinic: "Children's Hospital",
    registrationNo: 'KMC-66778',
    signature: 'Dr. Sneha Reddy, MD (Pediatrics)'
  },
  {
    id: 'D005',
    name: 'Dr. Arun Nair',
    specialty: 'Neurologist',
    clinic: 'Neuro Care Center',
    registrationNo: 'KMC-99887',
    signature: 'Dr. Arun Nair, DM (Neurology)'
  },
  {
    id: 'D006',
    name: 'Dr. Kavita Singh',
    specialty: 'Gynecologist',
    clinic: "Women's Health Clinic",
    registrationNo: 'KMC-77665',
    signature: 'Dr. Kavita Singh, MD (OB/GYN)'
  },
  {
    id: 'D007',
    name: 'Dr. Vikram Mehta',
    specialty: 'Ophthalmologist',
    clinic: 'Eye Care Hospital',
    registrationNo: 'KMC-44556',
    signature: 'Dr. Vikram Mehta, MS (Ophthalmology)'
  },
  {
    id: 'D008',
    name: 'Dr. Anjali Desai',
    specialty: 'Endocrinologist',
    clinic: 'Diabetes & Thyroid Center',
    registrationNo: 'KMC-22334',
    signature: 'Dr. Anjali Desai, DM (Endocrinology)'
  }
];

// Mock patients directory
export const mockPatients: Patient[] = [
  {
    id: 'P-10021',
    name: 'Aarav Menon',
    age: 5,
    gender: 'M',
    weight: 18,
    phone: '98765 43210',
    patientId: 'P-10021',
    lastVisit: '2026-02-10',
    guardian: 'Anu Menon',
    allergies: [],
    conditions: [],
    visitType: 'OPD'
  },
  {
    id: 'P-20411',
    name: 'Aarav Menon',
    age: 52,
    gender: 'M',
    weight: 74,
    phone: '98450 12345',
    patientId: 'P-20411',
    lastVisit: '2025-12-15',
    allergies: ['Penicillin', 'Sulfa'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    visitType: 'Consultation'
  },
  {
    id: 'P-30522',
    name: 'Meera Iyer',
    age: 28,
    gender: 'F',
    weight: 58,
    phone: '99000 55667',
    patientId: 'P-30522',
    lastVisit: '2026-03-01',
    allergies: [],
    conditions: [],
    visitType: 'Follow-up'
  },
  {
    id: 'P-40155',
    name: 'Suresh Raina',
    age: 42,
    gender: 'M',
    weight: 82,
    phone: '98888 77777',
    patientId: 'P-40155',
    lastVisit: '2026-01-20',
    allergies: ['Aspirin'],
    conditions: ['Asthma'],
    visitType: 'Emergency'
  }
];

// Mock previous prescriptions for the patient
export const mockPreviousPrescriptions: Prescription[] = [
  {
    patient: mockPatients[0], // Aarav Menon
    doctor: mockDoctor,
    symptoms: 'Cough, Mild Fever',
    diagnoses: [
      { id: '1', name: 'Viral Upper Respiratory Infection', addedFromAI: false }
    ],
    disorders: [],
    medications: [
      {
        id: '1',
        drugName: 'Paracetamol Syrup 250mg/5ml',
        dose: '5ml',
        frequency: '1-1-1',
        duration: '3 days',
        route: 'Oral',
        instructions: 'After food',
        addedFromAI: false
      }
    ],
    labTests: [],
    radiologyOrders: [],
    surgeryOrders: [],
    ayushTreatments: [],
    dentalTreatments: [],
    nursingCare: [],
    vetDetails: [],
    patientAllergies: [],
    patientVaccinations: [],
    patientConditions: [],
    organDonorship: 'None',
    investigations: 'Need continuous monitoring of heart rate and BP.',
    notes: 'Continue warm fluids. Rest advised.',
    followUp: '5 days',
    rxId: 'RX-2026020501',
    timestamp: '2026-02-05T14:15:00'
  },
  {
    patient: mockPatients[0], // Aarav Menon
    doctor: mockDoctor,
    symptoms: 'Throat pain, Fever',
    diagnoses: [
      { id: '1', name: 'Acute Pharyngitis', addedFromAI: false }
    ],
    disorders: [],
    medications: [
      {
        id: '1',
        drugName: 'Azithromycin Suspension 200mg/5ml',
        dose: '5ml',
        frequency: '1-0-0',
        duration: '3 days',
        route: 'Oral',
        instructions: 'After food',
        addedFromAI: false
      },
      {
        id: '2',
        drugName: 'Paracetamol Syrup 250mg/5ml',
        dose: '5ml',
        frequency: '1-1-1',
        duration: '3 days',
        route: 'Oral',
        instructions: 'After food',
        addedFromAI: false
      }
    ],
    labTests: [],
    radiologyOrders: [],
    surgeryOrders: [],
    ayushTreatments: [],
    dentalTreatments: [],
    nursingCare: [],
    vetDetails: [],
    patientAllergies: [],
    patientVaccinations: [],
    patientConditions: [],
    organDonorship: 'None',
    investigations: 'Patient reports mild discomfort after meals. Recommended dietary changes.',
    notes: 'Warm salt water gargling recommended. Avoid cold drinks.',
    followUp: '3 days',
    rxId: 'RX-2026013001',
    timestamp: '2026-01-30T09:45:00'
  },
  {
    patient: mockPatients[0], // Aarav Menon
    doctor: mockDoctor,
    symptoms: 'Diarrhea, Vomiting',
    diagnoses: [
      { id: '1', name: 'Gastroenteritis', addedFromAI: false }
    ],
    disorders: [],
    medications: [
      {
        id: '1',
        drugName: 'ORS Sachet',
        dose: '1 sachet',
        frequency: 'After each loose stool',
        duration: '3 days',
        route: 'Oral',
        instructions: 'Dissolve in 1 liter water',
        addedFromAI: false
      }
    ],
    labTests: [],
    radiologyOrders: [],
    surgeryOrders: [],
    ayushTreatments: [],
    dentalTreatments: [],
    nursingCare: [],
    vetDetails: [],
    patientAllergies: [],
    patientVaccinations: [],
    patientConditions: [],
    organDonorship: 'None',
    investigations: 'Severe joint pain observed. Suspected early-onset arthritis.',
    notes: 'Avoid milk and dairy products. Give rice water, banana.',
    followUp: 'SOS',
    rxId: 'RX-2026012001',
    timestamp: '2026-01-20T11:20:00'
  }
];

export const mockMedications: any[] = [];
export const mockDiagnoses: any[] = [];
export const labTestsDatabase: any[] = [];
export const radiologyDatabase: any[] = [];
export const surgeryDatabase: any[] = [];
