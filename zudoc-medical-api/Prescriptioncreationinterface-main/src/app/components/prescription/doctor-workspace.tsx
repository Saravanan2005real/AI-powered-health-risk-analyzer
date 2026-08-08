import { useRef, useState } from 'react';
import { Medication, Diagnosis, LabTest, RadiologyOrder, SurgeryOrder } from '../../types/prescription';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Trash2, Sparkles, Settings, Pencil, Pill, FlaskConical, ScanLine, Scissors, Edit, ClipboardList, Calendar, User } from 'lucide-react';
import { Input } from '../ui/input';
import { ImprovedMedicationForm } from './improved-medication-form';
import { LabTestForm } from './lab-test-form';
import { RadiologyForm } from './radiology-form';
import { SurgeryForm } from './surgery-form';
import { KeyboardTagInput } from '../shared/keyboard-tag-input';
import { AdvancedFollowUpModal, AdvancedFollowUp } from '../modals/advanced-followup-modal';
import { mockDiagnoses } from '../../data/mockData';
import { format } from 'date-fns';
import { SNOMED_HIERARCHIES } from '../../utils/snomed';

// Mock symptoms for autocomplete
const mockSymptoms = [
  'Fever',
  'Cough',
  'Throat pain',
  'Headache',
  'Body ache',
  'Runny nose',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Abdominal pain',
  'Chest pain',
  'Breathlessness',
  'Fatigue',
  'Loss of appetite',
  'Dizziness'
];

interface DoctorWorkspaceProps {
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
  investigations: string;
  notes: string;
  followUp: string;
  onSymptomsChange: (value: string) => void;
  onAddDiagnosis: (diagnosis: Diagnosis) => void;
  onRemoveDiagnosis: (id: string) => void;
  onAddDisorder: (disorder: Diagnosis) => void;
  onRemoveDisorder: (id: string) => void;
  onAddMedication: (medication: Medication) => void;
  onRemoveMedication: (id: string) => void;
  onEditMedication: (id: string, medication: Medication) => void;
  onAddLabTest: (labTest: LabTest) => void;
  onRemoveLabTest: (id: string) => void;
  onEditLabTest: (id: string, labTest: LabTest) => void;
  onAddRadiologyOrder: (order: RadiologyOrder) => void;
  onRemoveRadiologyOrder: (id: string) => void;
  onEditRadiologyOrder: (id: string, order: RadiologyOrder) => void;
  onAddSurgeryOrder: (order: SurgeryOrder) => void;
  onRemoveSurgeryOrder: (id: string) => void;
  onEditSurgeryOrder: (id: string, order: SurgeryOrder) => void;
  onAddAyushTreatment: (treatment: Diagnosis) => void;
  onRemoveAyushTreatment: (id: string) => void;
  onAddDentalTreatment: (treatment: Diagnosis) => void;
  onRemoveDentalTreatment: (id: string) => void;
  onAddNursingCare: (care: Diagnosis) => void;
  onRemoveNursingCare: (id: string) => void;
  onAddVetDetail: (detail: Diagnosis) => void;
  onRemoveVetDetail: (id: string) => void;
  patientAllergies: Diagnosis[];
  patientVaccinations: Diagnosis[];
  patientConditions: Diagnosis[];
  organDonorship: string;
  onAddPatientAllergy: (allergy: Diagnosis) => void;
  onRemovePatientAllergy: (id: string) => void;
  onAddPatientVaccination: (vaccination: Diagnosis) => void;
  onRemovePatientVaccination: (id: string) => void;
  onAddPatientCondition: (condition: Diagnosis) => void;
  onRemovePatientCondition: (id: string) => void;
  onOrganDonorshipChange: (value: string) => void;
  onInvestigationsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onFollowUpChange: (value: string) => void;
  zenMode?: boolean;
  onFieldFocus?: (field: string, query: string) => void;
  onArrowDownInField?: () => void;
}

export function DoctorWorkspace({
  symptoms,
  diagnoses,
  disorders,
  medications,
  labTests,
  radiologyOrders,
  surgeryOrders,
  ayushTreatments,
  dentalTreatments,
  nursingCare,
  vetDetails,
  investigations,
  notes,
  followUp,
  onSymptomsChange,
  onAddDiagnosis,
  onRemoveDiagnosis,
  onAddDisorder,
  onRemoveDisorder,
  onAddMedication,
  onRemoveMedication,
  onEditMedication,
  onAddLabTest,
  onRemoveLabTest,
  onEditLabTest,
  onAddRadiologyOrder,
  onRemoveRadiologyOrder,
  onEditRadiologyOrder,
  onAddSurgeryOrder,
  onRemoveSurgeryOrder,
  onEditSurgeryOrder,
  onAddAyushTreatment,
  onRemoveAyushTreatment,
  onAddDentalTreatment,
  onRemoveDentalTreatment,
  onAddNursingCare,
  onRemoveNursingCare,
  onAddVetDetail,
  onRemoveVetDetail,
  patientAllergies,
  patientVaccinations,
  patientConditions,
  organDonorship,
  onAddPatientAllergy,
  onRemovePatientAllergy,
  onAddPatientVaccination,
  onRemovePatientVaccination,
  onAddPatientCondition,
  onRemovePatientCondition,
  onOrganDonorshipChange,
  onInvestigationsChange,
  onNotesChange,
  onFollowUpChange,
  zenMode = false,
  onFieldFocus,
  onArrowDownInField
}: DoctorWorkspaceProps) {
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [showLabTestForm, setShowLabTestForm] = useState(false);
  const [editingLabTestId, setEditingLabTestId] = useState<string | null>(null);
  const [showRadiologyForm, setShowRadiologyForm] = useState(false);
  const [editingRadiologyId, setEditingRadiologyId] = useState<string | null>(null);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [editingSurgeryId, setEditingSurgeryId] = useState<string | null>(null);
  const [showAdvancedFollowUp, setShowAdvancedFollowUp] = useState(false);
  const [advancedFollowUpData, setAdvancedFollowUpData] = useState<AdvancedFollowUp | undefined>(undefined);
  const diagnosisRef = useRef<HTMLDivElement>(null);
  const disorderRef = useRef<HTMLDivElement>(null);
  const investigationsRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Convert symptoms string to tags
  const symptomTags = symptoms ? symptoms.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  const handleSymptomsChange = (tags: string[]) => {
    onSymptomsChange(tags.join(', '));
  };

  const diagnosisTags = diagnoses.map(d => d.name);
  
  const handleDiagnosisChange = (tags: string[]) => {
    // Add new diagnoses
    tags.forEach(tag => {
      if (!diagnoses.find(d => d.name === tag)) {
        onAddDiagnosis({
          id: Date.now().toString() + Math.random(),
          name: tag,
          addedFromAI: false
        });
      }
    });
    // Remove diagnoses that are not in tags
    diagnoses.forEach(d => {
      if (!tags.includes(d.name)) {
        onRemoveDiagnosis(d.id);
      }
    });
  };

  const disorderTags = disorders.map(d => d.name);
  
  const handleDisorderChange = (tags: string[]) => {
    // Add new disorders
    tags.forEach(tag => {
      if (!disorders.find(d => d.name === tag)) {
        onAddDisorder({
          id: Date.now().toString() + Math.random(),
          name: tag,
          addedFromAI: false
        });
      }
    });
    // Remove disorders that are not in tags
    disorders.forEach(d => {
      if (!tags.includes(d.name)) {
        onRemoveDisorder(d.id);
      }
    });
  };

  const lastMedication = medications.length > 0 ? medications[medications.length - 1] : null;

  const handleAdvancedFollowUpSave = (data: AdvancedFollowUp) => {
    setAdvancedFollowUpData(data);
    onFollowUpChange(data.summary);
    setShowAdvancedFollowUp(false);
  };

  const handleAyushChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!ayushTreatments.find(t => t.name === tag)) {
        onAddAyushTreatment({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    ayushTreatments.forEach(t => {
      if (!tags.includes(t.name)) onRemoveAyushTreatment(t.id);
    });
  };

  const handleDentalChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!dentalTreatments.find(t => t.name === tag)) {
        onAddDentalTreatment({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    dentalTreatments.forEach(t => {
      if (!tags.includes(t.name)) onRemoveDentalTreatment(t.id);
    });
  };

  const handleNursingChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!nursingCare.find(t => t.name === tag)) {
        onAddNursingCare({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    nursingCare.forEach(t => {
      if (!tags.includes(t.name)) onRemoveNursingCare(t.id);
    });
  };

  const handleVetChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!vetDetails.find(t => t.name === tag)) {
        onAddVetDetail({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    vetDetails.forEach(t => {
      if (!tags.includes(t.name)) onRemoveVetDetail(t.id);
    });
  };

  const handleAllergyChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!patientAllergies.find(t => t.name === tag)) {
        onAddPatientAllergy({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    patientAllergies.forEach(t => {
      if (!tags.includes(t.name)) onRemovePatientAllergy(t.id);
    });
  };

  const handleVaccinationChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!patientVaccinations.find(t => t.name === tag)) {
        onAddPatientVaccination({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    patientVaccinations.forEach(t => {
      if (!tags.includes(t.name)) onRemovePatientVaccination(t.id);
    });
  };

  const handleConditionChange = (tags: string[]) => {
    tags.forEach(tag => {
      if (!patientConditions.find(t => t.name === tag)) {
        onAddPatientCondition({ id: Date.now().toString() + Math.random(), name: tag });
      }
    });
    patientConditions.forEach(t => {
      if (!tags.includes(t.name)) onRemovePatientCondition(t.id);
    });
  };

  const onFieldFocusInternal = (field: string, query: string) => {
    if (onFieldFocus) onFieldFocus(field, query);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Pencil className="size-5 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Patient Consultation</h2>
            <p className="text-xs text-gray-500 font-medium">Create medical record & prescription</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 px-3 py-1 font-semibold">
            Visit ID: #RX-2024-001
          </Badge>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Symptoms */}
        <div id="symptoms">
          <KeyboardTagInput workspaceId="allopathy"
            value={symptomTags}
            onChange={handleSymptomsChange}
            suggestions={mockSymptoms}
            snomedHierarchy={SNOMED_HIERARCHIES.SYMPTOMS}
            placeholder="Type symptoms and press Enter..."
            label="Symptoms"
            onEnterNext={() => diagnosisRef.current?.querySelector('input')?.focus()}
            zenMode={zenMode}
            onFieldFocus={onFieldFocus}
            onArrowDownInField={onArrowDownInField}
          />
        </div>

        {/* Diagnosis */}
        <div id="diagnosis" ref={diagnosisRef}>
          <KeyboardTagInput workspaceId="allopathy"
            value={diagnosisTags}
            onChange={handleDiagnosisChange}
            suggestions={mockDiagnoses}
            snomedHierarchy={SNOMED_HIERARCHIES.DIAGNOSIS}
            placeholder="Type diagnosis and press Enter..."
            label="Diagnosis"
            required
            onEnterNext={() => disorderRef.current?.querySelector('input')?.focus()}
            zenMode={zenMode}
            onFieldFocus={onFieldFocus}
            onArrowDownInField={onArrowDownInField}
          />
        </div>

        {/* Disorder */}
        <div id="disorder" ref={disorderRef}>
          <KeyboardTagInput workspaceId="allopathy"
            value={disorderTags}
            onChange={handleDisorderChange}
            suggestions={mockDiagnoses}
            snomedHierarchy={SNOMED_HIERARCHIES.DIAGNOSIS}
            placeholder="Type disorder and press Enter..."
            label="Disorders"
            onEnterNext={() => investigationsRef.current?.focus()}
            zenMode={zenMode}
            onFieldFocus={onFieldFocus}
            onArrowDownInField={onArrowDownInField}
          />
        </div>

        {/* Tabbed Treatment Section */}
        <div id="treatment">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="size-4 text-indigo-600" />
            </div>
            <h3 className="text-md font-bold text-gray-800">Treatment Plan</h3>
          </div>
          
          <Tabs defaultValue="medications" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-12 bg-gray-100/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="medications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                <Pill className="size-4" />
                <span>Medications</span>
                {medications.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 pointer-events-none px-1.5 h-5 min-w-5 flex items-center justify-center">
                    {medications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="labs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                <FlaskConical className="size-4" />
                <span>Lab Tests</span>
                {labTests.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 pointer-events-none px-1.5 h-5 min-w-5 flex items-center justify-center">
                    {labTests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="radiology" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                <ScanLine className="size-4" />
                <span>Radiology</span>
                {radiologyOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 pointer-events-none px-1.5 h-5 min-w-5 flex items-center justify-center">
                    {radiologyOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="surgery" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                <Scissors className="size-4" />
                <span>Surgery</span>
                {surgeryOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 pointer-events-none px-1.5 h-5 min-w-5 flex items-center justify-center">
                    {surgeryOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Medications Tab */}
            <TabsContent value="medications" className="mt-0 focus-visible:outline-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Pill className="size-4 text-blue-500" />
                    Prescribed Medications
                  </h4>
                  <Button
                    onClick={() => {
                      setEditingMedicationId(null);
                      setShowMedicationForm(!showMedicationForm);
                    }}
                    variant={showMedicationForm ? "outline" : "default"}
                    size="sm"
                    className={!showMedicationForm ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100" : ""}
                  >
                    {showMedicationForm ? "Cancel" : <><Plus className="size-4 mr-1" /> Add Medication</>}
                  </Button>
                </div>

                {showMedicationForm && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <ImprovedMedicationForm
                      workspaceId="allopathy"
                      onAdd={(med) => {
                        onAddMedication(med);
                        setShowMedicationForm(false);
                      }}
                      onEdit={(med) => {
                        if (editingMedicationId) {
                          onEditMedication(editingMedicationId, med);
                          setEditingMedicationId(null);
                          setShowMedicationForm(false);
                        }
                      }}
                      onCancel={() => {
                        setShowMedicationForm(false);
                        setEditingMedicationId(null);
                      }}
                      lastMedication={lastMedication}
                      medication={editingMedicationId ? medications.find(m => m.id === editingMedicationId) : undefined}
                      autoScroll={true}
                      onFieldFocus={onFieldFocusInternal}
                    />
                  </div>
                )}

                <div className="grid gap-3">
                  {medications.length === 0 && !showMedicationForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                      <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Pill className="size-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No medications added yet.</p>
                      <button 
                        onClick={() => setShowMedicationForm(true)}
                        className="mt-2 text-sm text-blue-600 font-bold hover:underline"
                      >
                        Add your first medication
                      </button>
                    </div>
                  ) : (
                    medications.map((med, index) => (
                      <div key={med.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-600 border border-blue-100">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900">{med.drugName}</h5>
                                {med.addedFromAI && (
                                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-1.5 py-0 text-[10px] font-bold">
                                    <Sparkles className="size-3 mr-1" /> AI
                                  </Badge>
                                )}
                                {med.snomedId && (
                                  <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-500 border-gray-200">
                                    SCTID: {med.snomedId}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <span className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                                  <span className="size-1.5 bg-blue-400 rounded-full" />
                                  {med.dose}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                                  <span className="size-1.5 bg-green-400 rounded-full" />
                                  {med.frequency}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                                  <span className="size-1.5 bg-orange-400 rounded-full" />
                                  {med.duration}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1.5 font-medium italic">
                                  {med.route}
                                </span>
                              </div>
                              {med.instructions && (
                                <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block font-medium">
                                  Note: {med.instructions}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => {
                                setEditingMedicationId(med.id);
                                setShowMedicationForm(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              onClick={() => onRemoveMedication(med.id)}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Lab Tests Tab */}
            <TabsContent value="labs" className="mt-0 focus-visible:outline-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FlaskConical className="size-4 text-emerald-500" />
                    Investigation Orders
                  </h4>
                  <Button
                    onClick={() => {
                      setEditingLabTestId(null);
                      setShowLabTestForm(!showLabTestForm);
                    }}
                    variant={showLabTestForm ? "outline" : "default"}
                    size="sm"
                    className={!showLabTestForm ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100" : ""}
                  >
                    {showLabTestForm ? "Cancel" : <><Plus className="size-4 mr-1" /> Add Lab Test</>}
                  </Button>
                </div>

                {showLabTestForm && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <LabTestForm workspaceId="allopathy"
                      onAdd={(test) => {
                        onAddLabTest({ ...test, id: Date.now().toString() });
                        setShowLabTestForm(false);
                      }}
                      onEdit={(test) => {
                        if (editingLabTestId) {
                          onEditLabTest(editingLabTestId, { ...test, id: editingLabTestId });
                          setEditingLabTestId(null);
                          setShowLabTestForm(false);
                        }
                      }}
                      onCancel={() => {
                        setShowLabTestForm(false);
                        setEditingLabTestId(null);
                      }}
                      labTest={editingLabTestId ? labTests.find(t => t.id === editingLabTestId) : undefined}
                      autoScroll={true}
                      onFieldFocus={onFieldFocusInternal}
                    />
                  </div>
                )}

                <div className="grid gap-3">
                  {labTests.length === 0 && !showLabTestForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                      <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FlaskConical className="size-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No lab tests ordered yet.</p>
                    </div>
                  ) : (
                    labTests.map((test) => (
                      <div key={test.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="size-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                              <FlaskConical className="size-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900">{test.testName}</h5>
                                <Badge className={`${
                                  test.priority === 'STAT' ? 'bg-red-100 text-red-700' : 
                                  test.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' : 
                                  'bg-blue-100 text-blue-700'
                                } border-none text-[10px] font-bold`}>
                                  {test.priority}
                                </Badge>
                              </div>
                              {test.instructions && (
                                <p className="text-sm text-gray-600 mt-1 font-medium">{test.instructions}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => {
                                setEditingLabTestId(test.id);
                                setShowLabTestForm(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              onClick={() => onRemoveLabTest(test.id)}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Radiology Tab */}
            <TabsContent value="radiology" className="mt-0 focus-visible:outline-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ScanLine className="size-4 text-orange-500" />
                    Imaging Orders
                  </h4>
                  <Button
                    onClick={() => {
                      setEditingRadiologyId(null);
                      setShowRadiologyForm(!showRadiologyForm);
                    }}
                    variant={showRadiologyForm ? "outline" : "default"}
                    size="sm"
                    className={!showRadiologyForm ? "bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-100" : ""}
                  >
                    {showRadiologyForm ? "Cancel" : <><Plus className="size-4 mr-1" /> Add Imaging</>}
                  </Button>
                </div>

                {showRadiologyForm && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <RadiologyForm workspaceId="allopathy"
                      onAdd={(order) => {
                        onAddRadiologyOrder({ ...order, id: Date.now().toString() });
                        setShowRadiologyForm(false);
                      }}
                      onEdit={(order) => {
                        if (editingRadiologyId) {
                          onEditRadiologyOrder(editingRadiologyId, { ...order, id: editingRadiologyId });
                          setEditingRadiologyId(null);
                          setShowRadiologyForm(false);
                        }
                      }}
                      onCancel={() => {
                        setShowRadiologyForm(false);
                        setEditingRadiologyId(null);
                      }}
                      radiologyOrder={editingRadiologyId ? radiologyOrders.find(o => o.id === editingRadiologyId) : undefined}
                      autoScroll={true}
                      onFieldFocus={onFieldFocusInternal}
                    />
                  </div>
                )}

                <div className="grid gap-3">
                  {radiologyOrders.length === 0 && !showRadiologyForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                      <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ScanLine className="size-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No imaging ordered yet.</p>
                    </div>
                  ) : (
                    radiologyOrders.map((order) => (
                      <div key={order.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="size-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                              <ScanLine className="size-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900">{order.procedureName} - {order.bodyPart}</h5>
                                {order.contrast && (
                                  <Badge className="bg-indigo-100 text-indigo-700 border-none text-[10px] font-bold uppercase">Contrast</Badge>
                                )}
                                <Badge className={`${
                                  order.priority === 'STAT' ? 'bg-red-100 text-red-700' : 
                                  order.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' : 
                                  'bg-blue-100 text-blue-700'
                                } border-none text-[10px] font-bold`}>
                                  {order.priority}
                                </Badge>
                              </div>
                              {order.instructions && (
                                <p className="text-sm text-gray-600 mt-1 font-medium">{order.instructions}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => {
                                setEditingRadiologyId(order.id);
                                setShowRadiologyForm(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              onClick={() => onRemoveRadiologyOrder(order.id)}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Surgery Tab */}
            <TabsContent value="surgery" className="mt-0 focus-visible:outline-none">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Scissors className="size-4 text-red-500" />
                    Surgical Procedures
                  </h4>
                  <Button
                    onClick={() => {
                      setEditingSurgeryId(null);
                      setShowSurgeryForm(!showSurgeryForm);
                    }}
                    variant={showSurgeryForm ? "outline" : "default"}
                    size="sm"
                    className={!showSurgeryForm ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-100" : ""}
                  >
                    {showSurgeryForm ? "Cancel" : <><Plus className="size-4 mr-1" /> Add Surgery</>}
                  </Button>
                </div>

                {showSurgeryForm && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <SurgeryForm workspaceId="allopathy"
                      onAdd={(order) => {
                        onAddSurgeryOrder({ ...order, id: Date.now().toString() });
                        setShowSurgeryForm(false);
                      }}
                      onEdit={(order) => {
                        if (editingSurgeryId) {
                          onEditSurgeryOrder(editingSurgeryId, { ...order, id: editingSurgeryId });
                          setEditingSurgeryId(null);
                          setShowSurgeryForm(false);
                        }
                      }}
                      onCancel={() => {
                        setShowSurgeryForm(false);
                        setEditingSurgeryId(null);
                      }}
                      surgeryOrder={editingSurgeryId ? surgeryOrders.find(o => o.id === editingSurgeryId) : undefined}
                      autoScroll={true}
                      onFieldFocus={onFieldFocusInternal}
                    />
                  </div>
                )}

                <div className="grid gap-3">
                  {surgeryOrders.length === 0 && !showSurgeryForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                      <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Scissors className="size-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No surgical procedures added yet.</p>
                    </div>
                  ) : (
                    surgeryOrders.map((order) => (
                      <div key={order.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="size-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
                              <Scissors className="size-5 text-red-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900">{order.procedureName}</h5>
                                <Badge className={`${
                                  order.urgency === 'Emergency' ? 'bg-red-100 text-red-700' : 
                                  order.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' : 
                                  'bg-blue-100 text-blue-700'
                                } border-none text-[10px] font-bold`}>
                                  {order.urgency}
                                </Badge>
                              </div>
                              <div className="flex gap-3 mt-1 text-sm text-gray-600 font-medium">
                                <span>Duration: {order.estimatedDuration}</span>
                                <span>Anesthesia: {order.anesthesiaType}</span>
                              </div>
                              {order.instructions && (
                                <p className="text-sm text-gray-500 mt-2 italic">{order.instructions}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => {
                                setEditingSurgeryId(order.id);
                                setShowSurgeryForm(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              onClick={() => onRemoveSurgeryOrder(order.id)}
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Patient History & Profile Section */}
        <div id="patient-history" className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <User className="size-4 text-pink-600" />
            </div>
            <h3 className="text-md font-bold text-gray-800">Patient History & Profile</h3>
          </div>

          <Tabs defaultValue="allergies" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-11 bg-gray-100/50 p-1 rounded-xl mb-4">
              <TabsTrigger value="allergies" className="text-xs">Allergies</TabsTrigger>
              <TabsTrigger value="vaccinations" className="text-xs">Vaccinations</TabsTrigger>
              <TabsTrigger value="conditions" className="text-xs">Conditions</TabsTrigger>
              <TabsTrigger value="organ-donorship" className="text-xs">Organ Donorship</TabsTrigger>
            </TabsList>

            <TabsContent value="allergies">
              <KeyboardTagInput workspaceId="allopathy"
                value={patientAllergies.map(t => t.name)}
                onChange={handleAllergyChange}
                snomedHierarchy={SNOMED_HIERARCHIES.ALLERGIES}
                placeholder="Type allergies and press Enter..."
                label="Allergies"
                zenMode={zenMode}
                onFieldFocus={(field, query) => onFieldFocusInternal('Allergies', query)}
              />
            </TabsContent>

            <TabsContent value="vaccinations">
              <KeyboardTagInput workspaceId="allopathy"
                value={patientVaccinations.map(t => t.name)}
                onChange={handleVaccinationChange}
                snomedHierarchy={SNOMED_HIERARCHIES.MEDICATIONS}
                placeholder="Type vaccinations and press Enter..."
                label="Vaccinations"
                zenMode={zenMode}
                onFieldFocus={(field, query) => onFieldFocusInternal('Vaccinations', query)}
              />
            </TabsContent>

            <TabsContent value="conditions">
              <KeyboardTagInput workspaceId="allopathy"
                value={patientConditions.map(t => t.name)}
                onChange={handleConditionChange}
                snomedHierarchy={SNOMED_HIERARCHIES.DIAGNOSIS}
                placeholder="Type existing conditions and press Enter..."
                label="Conditions"
                zenMode={zenMode}
                onFieldFocus={(field, query) => onFieldFocusInternal('Conditions', query)}
              />
            </TabsContent>

            <TabsContent value="organ-donorship">
              <div className="space-y-3">
                <Label htmlFor="organ-donorship-input" className="text-sm font-bold text-gray-700">Organ Donorship Status</Label>
                <div className="relative">
                  <Input
                    id="organ-donorship-input"
                    value={organDonorship}
                    onChange={(e) => onOrganDonorshipChange(e.target.value)}
                    placeholder="e.g., Registered Donor, Not Registered, Opt-out"
                    className="focus-visible:ring-pink-500 h-11 rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Other Sections */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="investigations" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FlaskConical className="size-4 text-blue-500" />
              Investigations Done
            </Label>
            <Textarea
              ref={investigationsRef}
              id="investigations"
              placeholder="Record findings from tests already conducted..."
              className="min-h-[120px] resize-none focus:ring-blue-500 rounded-xl"
              value={investigations}
              onChange={(e) => onInvestigationsChange(e.target.value)}
              onFocus={() => onFieldFocusInternal('Investigations', investigations)}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ClipboardList className="size-4 text-blue-500" />
              Clinical Notes
            </Label>
            <Textarea
              ref={notesRef}
              id="notes"
              placeholder="Additional clinical notes, observations or advice..."
              className="min-h-[120px] resize-none focus:ring-blue-500 rounded-xl"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              onFocus={() => onFieldFocusInternal('Notes', notes)}
            />
          </div>
        </div>

        {/* Follow-up Section */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Follow-up Recommendation</p>
              <p className="text-xs text-gray-500">Current: {followUp}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-bold"
            onClick={() => setShowAdvancedFollowUp(true)}
          >
            <Plus className="size-4 mr-2" />
            Set Follow-up
          </Button>
        </div>
      </div>

      <AdvancedFollowUpModal
        open={showAdvancedFollowUp}
        onClose={() => setShowAdvancedFollowUp(false)}

        onSave={handleAdvancedFollowUpSave}
        initialData={advancedFollowUpData}
      />
    </div>
  );
}