import { useState, useEffect } from "react";
import {
  Patient,
  Diagnosis,
  Medication,
  LabTest,
  RadiologyOrder,
  SurgeryOrder,
  Prescription,
  Vitals,
} from "./types/prescription";
import { mockDoctor, mockPatients, mockPreviousPrescriptions } from "./data/mockData";
import { PatientIdentityBar } from "./components/patient/patient-identity-bar";
import { PatientConfirmationModal } from "./components/modals/patient-confirmation-modal";
import { PatientOverviewPopup } from "./components/patient/patient-overview-popup";
import { EnhancedPrescriptionSummary } from "./components/prescription/enhanced-prescription-summary";
import { DoctorWorkspace } from "./components/prescription/doctor-workspace";
import { AyurvedaWorkspace } from "./components/prescription/workspaces/ayurveda-workspace";
import { DentalWorkspace } from "./components/prescription/workspaces/dental-workspace";
import { SiddhaWorkspace } from "./components/prescription/workspaces/siddha-workspace";
import { NursingWorkspace } from "./components/prescription/workspaces/nursing-workspace";
import { VeterinaryWorkspace } from "./components/prescription/workspaces/veterinary-workspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { AIAssistantPanel } from "./components/ai/ai-assistant-panel";
import { CollapsibleAIPanel } from "./components/ai/collapsible-ai-panel";
import { TabbedAIPanel } from "./components/ai/tabbed-ai-panel";
import { ReviewModal } from "./components/modals/review-modal";
import { AnalysisModal } from "./components/modals/analysis-modal";
import { SignAndSendModal } from "./components/modals/sign-and-send-modal";
import { SuccessModal } from "./components/modals/success-modal";
import { PreviousRecordsModal } from "./components/modals/previous-records-modal";
import { PatientSearch } from "./components/patient/patient-search";
import { TopNavBar } from "./components/shared/top-nav-bar";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Toaster, toast } from "sonner";
import {
  Search,
  User,
  Bell,
  Wifi,
  Printer,
  FileText,
  Calendar,
  ClipboardList,
  Stethoscope,
  FlaskConical,
  Edit,
  FilePen,
  CalendarPlus,
  FolderOpen,
  Save,
  Eye,
  Send,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { usePatient } from "./hooks/use-patient";
import { usePrescription } from "./hooks/use-prescription";
import { SNOMED_HIERARCHIES } from "./utils/snomed";
import { addRecentItem } from "./utils/search-engine";

const savePrescriptionToRecents = (prescription: Prescription, workspace: string) => {
  // Save symptoms
  if (prescription.symptoms) {
    prescription.symptoms.split(',').forEach(sym => {
      const trimmed = sym.trim();
      if (trimmed) {
        addRecentItem(SNOMED_HIERARCHIES.SYMPTOMS, trimmed, workspace);
      }
    });
  }
  // Save diagnoses
  if (prescription.diagnoses) {
    prescription.diagnoses.forEach(diag => {
      addRecentItem(SNOMED_HIERARCHIES.DIAGNOSIS, diag.name, workspace);
    });
  }
  // Save disorders
  if (prescription.disorders) {
    prescription.disorders.forEach(dis => {
      addRecentItem(SNOMED_HIERARCHIES.DIAGNOSIS, dis.name, workspace);
    });
  }
  // Save medications
  if (prescription.medications) {
    prescription.medications.forEach(med => {
      addRecentItem(SNOMED_HIERARCHIES.MEDICATIONS, { id: med.snomedId || `local-${Date.now()}`, name: med.drugName, category: 'Medication' }, workspace);
    });
  }
  // Save lab tests
  if (prescription.labTests) {
    prescription.labTests.forEach(lab => {
      addRecentItem(SNOMED_HIERARCHIES.LAB, { id: lab.snomedId || `local-${Date.now()}`, name: lab.testName, category: 'Lab' }, workspace);
    });
  }
  // Save radiology
  if (prescription.radiologyOrders) {
    prescription.radiologyOrders.forEach(rad => {
      addRecentItem(SNOMED_HIERARCHIES.RADIOLOGY, { id: rad.snomedId || `local-${Date.now()}`, name: rad.procedureName, category: 'Radiology' }, workspace);
    });
  }
  // Save surgery
  if (prescription.surgeryOrders) {
    prescription.surgeryOrders.forEach(surg => {
      addRecentItem(SNOMED_HIERARCHIES.SURGERY, { id: surg.snomedId || `local-${Date.now()}`, name: surg.procedureName, category: 'Surgery' }, workspace);
    });
  }
};

export default function App() {
  // Patient and Prescription hooks
  const {
    selectedPatient, setSelectedPatient,
    isPatientConfirmed, setIsPatientConfirmed,
    proceedToPrescription, setProceedToPrescription,
    handlePatientSelect, handlePatientConfirm, handleSwitchPatient, handleVitalsUpdate
  } = usePatient();

  const generalPresc = usePrescription();
  const ayurvedaPresc = usePrescription();
  const dentalPresc = usePrescription();
  const siddhaPresc = usePrescription();
  const nursingPresc = usePrescription();
  const veterinaryPresc = usePrescription();

  // Active specialty portal state
  const [activeSpecialty, setActiveSpecialty] = useState("general");

  const getActivePrescription = () => {
    switch (activeSpecialty) {
      case "ayurveda": return ayurvedaPresc;
      case "dental": return dentalPresc;
      case "siddha": return siddhaPresc;
      case "nursing": return nursingPresc;
      case "veterinary": return veterinaryPresc;
      case "general":
      default:
        return generalPresc;
    }
  };

  const activePresc = getActivePrescription();

  const {
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
  } = activePresc;

  // Search state for welcome screen
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  // Active field tracking for AI search
  const [activeField, setActiveField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zenMode, setZenMode] = useState(false);
  const [rxId, setRxId] = useState("");
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviousRecordsModal, setShowPreviousRecordsModal] = useState(false);

  // Handle field focus from DoctorWorkspace
  const handleFieldFocus = (field: string, query: string) => {
    const fieldMap: Record<string, string> = {
      'Symptoms': 'symptoms',
      'Diagnosis': 'diagnosis',
      'Disorders': 'disorders',
      'Medications': 'medications',
      'Lab Test': 'lab',
      'Radiology': 'radiology',
      'Surgery': 'surgery',
      'AYUSH': 'ayush',
      'Dental': 'dental',
      'Nursing': 'nursing',
      'Veterinary': 'vet',
    };
    setActiveField(fieldMap[field] || field.toLowerCase());
    setSearchQuery(query);
  };

  const handleArrowDownInField = (field?: string) => {
    // Focus AI search or show suggestions
    if (field) setActiveField(field.toLowerCase());
  };


  const [showPatientOverview, setShowPatientOverview] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const handlePatientCancel = () => {
    setShowPatientModal(false);
  };

  const handleSaveDraft = async () => {
    if (!selectedPatient) {
      toast.error("No patient selected");
      return;
    }
    
    try {
      const toastId = toast.loading("Saving draft...");
      const prescriptionData = getCurrentPrescription();
      
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          data: prescriptionData
        })
      });
      
      if (!response.ok) throw new Error('Failed to save draft');
      
      savePrescriptionToRecents(prescriptionData, activeSpecialty === 'general' ? 'allopathy' : activeSpecialty);
      
      toast.success("Draft saved successfully", { id: toastId });
    } catch (error) {
      console.error("Save draft error:", error);
      toast.error("Failed to save draft. Please try again.");
    }
  };

  const getCurrentPrescription = (): Prescription => ({
    rxId: rxId || "TEMP-" + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    patient: selectedPatient!,
    doctor: mockDoctor,
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
    patientAllergies,
    patientVaccinations,
    patientConditions,
    organDonorship,
    investigations,
    notes,
    followUp
  });

  const handleNotesChange = (val: string) => setNotes(val);

  const handleAddNote = (note: string) => {
    setNotes(prev => prev ? `${prev}\n${note}` : note);
  };

  const handleAddLabTestFromSearch = (test: LabTest) => {
    handleAddLabTest(test);
  };

  const handleAddRadiologyFromSearch = (order: RadiologyOrder) => {
    handleAddRadiologyOrder(order);
  };

  const handleAddSurgeryFromSearch = (order: SurgeryOrder) => {
    handleAddSurgeryOrder(order);
  };


  // Auto-save logic

  useEffect(() => {
    if (!selectedPatient) return;
    const interval = setInterval(() => console.log("Auto-saving draft..."), 30000);
    return () => clearInterval(interval);
  }, [selectedPatient, symptoms, diagnoses, medications, investigations, notes, followUp]);

  // Specialized handlers
  const handleAddSymptom = (symptom: string) => {
    setSymptoms((prev) => {
      if (!prev) return symptom;
      const existing = prev.split(',').map(s => s.trim().toLowerCase());
      if (existing.includes(symptom.toLowerCase())) return prev;
      return `${prev}, ${symptom}`;
    });
    setActiveField(null);
    setSearchQuery('');
  };

  const handleCopyPrescription = (prescription: Prescription) => {
    if (prescription.symptoms) setSymptoms((prev) => prev ? `${prev}\n\n${prescription.symptoms}` : prescription.symptoms);
    if (prescription.diagnoses) handleCopyDiagnosis(prescription.diagnoses);
    if (prescription.medications) handleCopyMedication(prescription.medications);
    if (prescription.labTests) handleCopyLabTestsFromHistory(prescription.labTests);
    if (prescription.radiologyOrders) handleCopyRadiology(prescription.radiologyOrders);
    if (prescription.surgeryOrders) handleCopySurgery(prescription.surgeryOrders);
    if (prescription.investigations) setInvestigations((prev) => prev ? `${prev}\n\n${prescription.investigations}` : prescription.investigations);
    if (prescription.notes) setNotes((prev) => prev ? `${prev}\n\n${prescription.notes}` : prescription.notes);
    if (prescription.followUp && (!followUp || followUp === "None")) setFollowUp(prescription.followUp);
    toast.success("Prescription data appended successfully");
  };

  const handleCopySingleDiagnosis = (diagnosisName: string) => {
    setDiagnoses(prev => [...prev, { id: Math.random().toString(), name: diagnosisName, addedFromAI: false }]);
  };

  const handleCopySingleMedication = (med: any) => {
    setMedications(prev => [...prev, { ...med, id: Math.random().toString(), addedFromAI: false }]);
  };

  const handleCopySymptoms = (s: string) => setSymptoms((prev) => prev ? `${prev}\n\n${s}` : s);
  const handleCopyDiagnosis = (d: Diagnosis[]) => setDiagnoses((prev) => [...prev, ...d.map(item => ({ ...item, id: Math.random().toString() }))]);
  const handleCopyMedication = (m: Medication[]) => setMedications((prev) => [...prev, ...m.map(item => ({ ...item, id: Math.random().toString() }))]);
  const handleCopyLabTestsFromHistory = (l: LabTest[]) => setLabTests((prev) => [...prev, ...l.map(item => ({ ...item, id: Math.random().toString() }))]);
  const handleCopyRadiology = (r: RadiologyOrder[]) => setRadiologyOrders((prev) => [...prev, ...r.map(item => ({ ...item, id: Math.random().toString() }))]);
  const handleCopySurgery = (s: SurgeryOrder[]) => setSurgeryOrders((prev) => [...prev, ...s.map(item => ({ ...item, id: Math.random().toString() }))]);
  const handleCopyInvestigations = (i: string) => setInvestigations((prev) => prev ? `${prev}\n\n${i}` : i);
  const handleCopyNotes = (n: string) => setNotes((prev) => prev ? `${prev}\n\n${n}` : n);
  const handleCopyFollowUp = (f: string) => setFollowUp(f);

  const handleSectionClick = (section: string) => document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const canReview = selectedPatient && diagnoses.length > 0 && medications.length > 0;
  const canSignAndSend = canReview && isPatientConfirmed;

  const handleReview = () => {
    if (!canReview) {
      toast.error("Please add at least one diagnosis and one medication");
      return;
    }
    setShowReviewModal(true);
  };

  const handleStartNew = () => {
    handleSwitchPatient();
    generalPresc.resetPrescription();
    ayurvedaPresc.resetPrescription();
    dentalPresc.resetPrescription();
    siddhaPresc.resetPrescription();
    nursingPresc.resetPrescription();
    veterinaryPresc.resetPrescription();
    setShowSuccessModal(false);
  };

  const handleProceedToAnalysis = () => {
    setShowReviewModal(false);
    setShowAnalysisModal(true);
  };

  const handleApproveAndSend = () => {
    setShowReviewModal(false);
    setShowSignModal(true);
  };

  const handleProceedToSign = () => {
    setShowAnalysisModal(false);
    setShowSignModal(true);
  };

  const handleSubmit = (options: string[], generatedRxId: string) => {
    // Save final prescription items to recents
    const prescriptionData = getCurrentPrescription();
    savePrescriptionToRecents(prescriptionData, activeSpecialty === 'general' ? 'allopathy' : activeSpecialty);

    setDeliveryOptions(options);
    setRxId(generatedRxId);
    setShowSignModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f5f3ff] flex flex-col font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
      <Toaster position="bottom-right" richColors />

      {/* Top Navigation Bar */}
      <TopNavBar
        onPatientSearchClick={() =>
          setShowPatientOverview(true)
        }
        selectedPatient={selectedPatient}
        zenMode={zenMode}
        onToggleZenMode={() => {
          setZenMode(!zenMode);
          toast.success(
            zenMode ? "Zen mode disabled" : "Zen mode enabled",
          );
        }}
      />

      {/* Patient Identity Bar */}
      {selectedPatient && proceedToPrescription && (
        <PatientIdentityBar
          patient={selectedPatient}
          isConfirmed={isPatientConfirmed}
          onConfirm={() => {
            setIsPatientConfirmed(true);
            toast.success("Patient identity confirmed");
          }}
          onSwitch={handleSwitchPatient}
          onVitalsUpdate={handleVitalsUpdate}
        />
      )}

      {/* Warning if not confirmed */}
      {selectedPatient && proceedToPrescription && !isPatientConfirmed && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-6 py-2">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="size-4" />
              <span className="text-sm font-medium">
                Please confirm patient identity before
                prescribing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!selectedPatient ||
      (selectedPatient && !proceedToPrescription) ? (
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Pane - Search (50%) - Sticky */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
            {/* Search Section - Fixed */}
            <div className="p-8 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Patient Search
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Search for a patient by name, phone, or patient
                ID
              </p>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search patient by name / phone / patient ID…"
                  value={searchTerm}
                  onChange={(e) => {
                    const term = e.target.value;
                    setSearchTerm(term);

                    // Filter patients
                    if (!term) {
                      setSearchResults([]);
                    } else {
                      const lowerTerm = term.toLowerCase();
                      const filtered = mockPatients.filter(
                        (p) =>
                          p.name
                            .toLowerCase()
                            .includes(lowerTerm) ||
                          p.phone.includes(term) ||
                          p.patientId
                            .toLowerCase()
                            .includes(lowerTerm),
                      );
                      setSearchResults(filtered);
                    }
                  }}
                  className="pl-12 h-14 text-base border-gray-300"
                />
              </div>
            </div>

            {/* Patient Overview - Fixed (shown after selection) */}
            {selectedPatient && (
              <div className="px-8 pb-6">
                <div
                  className={`border-2 rounded-2xl p-6 shadow-sm transition-all ${
                    isPatientConfirmed
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
                      : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16 flex-shrink-0 ring-4 ring-white shadow-md">
                      <AvatarFallback
                        className={
                          isPatientConfirmed
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-semibold"
                            : "bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-semibold"
                        }
                      >
                        {selectedPatient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {selectedPatient.name}
                        </h3>
                        {isPatientConfirmed ? (
                          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-shrink-0 shadow-sm">
                            ✓ Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-2 border-purple-400 bg-white text-purple-700 font-semibold flex-shrink-0 shadow-sm"
                          >
                            ⏳ Pending
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 space-y-1.5">
                        <p className="font-semibold text-gray-800">
                          {selectedPatient.patientId} ·{" "}
                          {selectedPatient.age}y /{" "}
                          {selectedPatient.gender}
                          {selectedPatient.weight &&
                            ` · ${selectedPatient.weight}kg`}
                        </p>
                        {selectedPatient.guardian && (
                          <p className="text-gray-600">
                            👤 Guardian: {selectedPatient.guardian}
                          </p>
                        )}
                        <p className="text-gray-600">📞 {selectedPatient.phone}</p>
                        {((selectedPatient.allergies &&
                          selectedPatient.allergies.length >
                            0) ||
                          (selectedPatient.conditions &&
                            selectedPatient.conditions.length >
                              0)) && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {selectedPatient.allergies &&
                              selectedPatient.allergies.map(
                                (allergy, idx) => (
                                  <Badge
                                    key={`allergy-${idx}`}
                                    variant="destructive"
                                    className="text-xs bg-gradient-to-r from-red-500 to-rose-500 shadow-sm"
                                  >
                                    ⚠️ Allergy: {allergy}
                                  </Badge>
                                ),
                              )}
                            {selectedPatient.conditions &&
                              selectedPatient.conditions.map(
                                (condition, idx) => (
                                  <Badge
                                    key={`condition-${idx}`}
                                    className="text-xs bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
                                  >
                                    {condition}
                                  </Badge>
                                ),
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isPatientConfirmed ? (
                    // Confirmation stage
                    <div className="mt-5 space-y-3">
                      <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
                        <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-xl">🔐</span> Patient Identity Verification
                          Required
                        </p>
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          Please verify that you are prescribing
                          for the correct patient. Confirm the
                          patient's name, ID, and other details
                          are accurate.
                        </p>
                        <label className="flex items-start gap-3 text-xs text-gray-700 bg-purple-50 p-3 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                          <input
                            type="checkbox"
                            id="patient-consent"
                            className="mt-0.5 size-4 accent-purple-600"
                          />
                          <span className="font-medium">
                            I confirm that I have verified this
                            patient's identity and details are
                            correct.
                          </span>
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border-0 shadow-sm font-semibold rounded-xl"
                          variant="outline"
                          onClick={() => {
                            setSelectedPatient(null);
                            setIsPatientConfirmed(false);
                            setSearchTerm("");
                            setSearchResults([]);
                            toast.info(
                              "Patient selection cancelled",
                            );
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md font-semibold rounded-xl"
                          onClick={() => {
                            const checkbox =
                              document.getElementById(
                                "patient-consent",
                              ) as HTMLInputElement;
                            if (!checkbox?.checked) {
                              toast.error(
                                "Please confirm patient identity verification",
                              );
                              return;
                            }
                            setIsPatientConfirmed(true);
                            toast.success(
                              "Patient identity confirmed",
                            );
                          }}
                        >
                          ✓ Confirm Identity
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Action options stage
                    <div className="mt-5 space-y-2">
                      <p className="text-sm font-semibold text-gray-600 mb-3">
                        What would you like to do? 💫
                      </p>

                      {/* Primary Action */}
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white justify-start shadow-md rounded-xl border-0 font-semibold"
                        size="lg"
                        onClick={() =>
                          setProceedToPrescription(true)
                        }
                      >
                        <FilePen className="size-5 mr-3" />
                        <span className="flex-1 text-left">
                          Create New Prescription
                        </span>
                      </Button>

                      {/* Secondary Actions */}
                      <Button
                        className="w-full justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                          setShowPreviousRecordsModal(true);
                        }}
                      >
                        <FolderOpen className="size-5 mr-3 text-blue-500" />
                        <span className="flex-1 text-left font-medium">
                          View Previous Records
                        </span>
                      </Button>

                      <Button
                        className="w-full justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                          toast.info(
                            "Opening referral form...",
                          );
                          // TODO: Open referral modal
                        }}
                      >
                        <Stethoscope className="size-5 mr-3 text-purple-500" />
                        <span className="flex-1 text-left font-medium">
                          Refer to Specialist
                        </span>
                      </Button>

                      <Button
                        className="w-full justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                          toast.info("Opening lab results...");
                          // TODO: Navigate to lab results view
                        }}
                      >
                        <FlaskConical className="size-5 mr-3 text-teal-500" />
                        <span className="flex-1 text-left font-medium">
                          View Lab Results
                        </span>
                      </Button>

                      <Button
                        className="w-full justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                        size="lg"
                        variant="ghost"
                        onClick={() => {
                          toast.info(
                            "Opening appointment scheduler...",
                          );
                          // TODO: Open appointment modal
                        }}
                      >
                        <CalendarPlus className="size-5 mr-3 text-pink-500" />
                        <span className="flex-1 text-left font-medium">
                          Schedule Follow-up
                        </span>
                      </Button>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button
                          className="justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                          variant="ghost"
                          onClick={() => {
                            toast.info(
                              "Opening patient profile...",
                            );
                            // TODO: Open edit patient modal
                          }}
                        >
                          <Edit className="size-4 mr-2 text-indigo-500" />
                          <span className="text-sm font-medium">
                            Edit Details
                          </span>
                        </Button>
                        <Button
                          className="justify-start bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl shadow-sm"
                          variant="ghost"
                          onClick={() => {
                            toast.success(
                              "Generating patient summary...",
                            );
                            // TODO: Generate and print summary
                          }}
                        >
                          <Printer className="size-4 mr-2 text-cyan-500" />
                          <span className="text-sm font-medium">
                            Print Summary
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Keyboard Shortcuts - Sticky at bottom */}
            {!zenMode && (
              <div className="p-8 pt-6 border-t border-gray-200">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Keyboard Shortcuts:</strong>
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <kbd className="px-2 py-0.5 bg-white rounded border">
                        Ctrl+P
                      </kbd>{" "}
                      - Patient Overview
                    </p>
                    <p>
                      <kbd className="px-2 py-0.5 bg-white rounded border">
                        Ctrl+S
                      </kbd>{" "}
                      - Save Draft
                    </p>
                    <p>
                      <kbd className="px-2 py-0.5 bg-white rounded border">
                        Ctrl+R
                      </kbd>{" "}
                      - Review
                    </p>
                    <p>
                      <kbd className="px-2 py-0.5 bg-white rounded border">
                        Ctrl+Shift+S
                      </kbd>{" "}
                      - Sign & Send
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Pane - Results (50%) - Scrollable */}
          <div className="w-1/2 bg-gray-50 overflow-y-auto h-[calc(100vh-64px)]">
            {searchResults.length === 0 && !searchTerm ? (
              // Welcome message when no search
              <div className="h-full flex items-center justify-center p-12">
                <div className="max-w-lg text-center">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    Welcome, {mockDoctor.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Search for a patient to view their details
                    and create a prescription
                  </p>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold">
                            1
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Search Patient
                          </h3>
                          <p className="text-sm text-gray-600">
                            Enter name, phone, or patient ID
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold">
                            2
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Select Patient
                          </h3>
                          <p className="text-sm text-gray-600">
                            Click on the patient from results
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold">
                            3
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Create Prescription
                          </h3>
                          <p className="text-sm text-gray-600">
                            Confirm identity and start
                            prescribing
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold">
                            4
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Send to Zudoc
                          </h3>
                          <p className="text-sm text-gray-600">
                            Verify prescription and send to
                            Zudoc.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              // No results found
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="size-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No patients found
                  </h3>
                  <p className="text-gray-600">
                    Try searching with a different name, phone,
                    or patient ID
                  </p>
                </div>
              </div>
            ) : (
              // Search results
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {searchResults.length} patient
                    {searchResults.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
                <div className="space-y-3">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() =>
                        handlePatientSelect(patient)
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="size-14 flex-shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {patient.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="flex-shrink-0"
                            >
                              {patient.patientId}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {patient.age}y / {patient.gender}{" "}
                              {patient.weight &&
                                `· ${patient.weight}kg`}
                              {patient.guardian &&
                                ` · Guardian: ${patient.guardian}`}
                            </p>
                            <p className="flex items-center gap-2">
                              <span>📞 {patient.phone}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Last visit:{" "}
                              {new Date(
                                patient.lastVisit,
                              ).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {(patient.allergies &&
                            patient.allergies.length > 0) ||
                          (patient.conditions &&
                            patient.conditions.length > 0) ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {patient.allergies &&
                                patient.allergies.map(
                                  (allergy, idx) => (
                                    <Badge
                                      key={`allergy-${idx}`}
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Allergy: {allergy}
                                    </Badge>
                                  ),
                                )}
                              {patient.conditions &&
                                patient.conditions.map(
                                  (condition, idx) => (
                                    <Badge
                                      key={`condition-${idx}`}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {condition}
                                    </Badge>
                                  ),
                                )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        (() => {
          const getWorkspaceProps = (presc: typeof generalPresc) => ({
            symptoms: presc.symptoms,
            diagnoses: presc.diagnoses,
            disorders: presc.disorders,
            medications: presc.medications,
            labTests: presc.labTests,
            radiologyOrders: presc.radiologyOrders,
            surgeryOrders: presc.surgeryOrders,
            ayushTreatments: presc.ayushTreatments,
            dentalTreatments: presc.dentalTreatments,
            nursingCare: presc.nursingCare,
            vetDetails: presc.vetDetails,
            patientAllergies: presc.patientAllergies,
            patientVaccinations: presc.patientVaccinations,
            patientConditions: presc.patientConditions,
            organDonorship: presc.organDonorship,
            investigations: presc.investigations,
            notes: presc.notes,
            followUp: presc.followUp,
            onSymptomsChange: presc.setSymptoms,
            onAddDiagnosis: presc.handleAddDiagnosis,
            onRemoveDiagnosis: presc.handleRemoveDiagnosis,
            onAddDisorder: presc.handleAddDisorder,
            onRemoveDisorder: presc.handleRemoveDisorder,
            onAddMedication: presc.handleAddMedication,
            onRemoveMedication: presc.handleRemoveMedication,
            onEditMedication: presc.handleEditMedication,
            onAddLabTest: presc.handleAddLabTest,
            onRemoveLabTest: presc.handleRemoveLabTest,
            onEditLabTest: presc.handleEditLabTest,
            onAddRadiologyOrder: presc.handleAddRadiologyOrder,
            onRemoveRadiologyOrder: presc.handleRemoveRadiologyOrder,
            onEditRadiologyOrder: presc.handleEditRadiologyOrder,
            onAddSurgeryOrder: presc.handleAddSurgeryOrder,
            onRemoveSurgeryOrder: presc.handleRemoveSurgeryOrder,
            onEditSurgeryOrder: presc.handleEditSurgeryOrder,
            onAddAyushTreatment: presc.handleAddAyushTreatment,
            onRemoveAyushTreatment: presc.handleRemoveAyushTreatment,
            onAddDentalTreatment: presc.handleAddDentalTreatment,
            onRemoveDentalTreatment: presc.handleRemoveDentalTreatment,
            onAddNursingCare: presc.handleAddNursingCare,
            onRemoveNursingCare: presc.handleRemoveNursingCare,
            onAddVetDetail: presc.handleAddVetDetail,
            onRemoveVetDetail: presc.handleRemoveVetDetail,
            onAddPatientAllergy: presc.handleAddPatientAllergy,
            onRemovePatientAllergy: presc.handleRemovePatientAllergy,
            onAddPatientVaccination: presc.handleAddPatientVaccination,
            onRemovePatientVaccination: presc.handleRemovePatientVaccination,
            onAddPatientCondition: presc.handleAddPatientCondition,
            onRemovePatientCondition: presc.handleRemovePatientCondition,
            onOrganDonorshipChange: presc.setOrganDonorship,
            onInvestigationsChange: presc.setInvestigations,
            onNotesChange: presc.setNotes,
            onFollowUpChange: presc.setFollowUp,
            zenMode,
            onFieldFocus: handleFieldFocus,
            onArrowDownInField: handleArrowDownInField
          });

          return (
        <>
          {/* Specialty Tabs */}
          <Tabs value={activeSpecialty} onValueChange={setActiveSpecialty} className="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
            <div className="bg-white border-b border-gray-200 px-6 py-2 z-10 relative shadow-sm flex-shrink-0">
              <TabsList className="grid grid-cols-6 w-full max-w-5xl mx-auto bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger value="general" className="rounded-lg font-medium text-xs">General</TabsTrigger>
                <TabsTrigger value="ayurveda" className="rounded-lg font-medium text-xs">Ayurveda</TabsTrigger>
                <TabsTrigger value="dental" className="rounded-lg font-medium text-xs">Dental</TabsTrigger>
                <TabsTrigger value="siddha" className="rounded-lg font-medium text-xs">Siddha</TabsTrigger>
                <TabsTrigger value="nursing" className="rounded-lg font-medium text-xs">Nursing</TabsTrigger>
                <TabsTrigger value="veterinary" className="rounded-lg font-medium text-xs">Veterinary</TabsTrigger>
              </TabsList>
            </div>

            {/* Main content area with proper height constraints */}
            <div className="flex flex-1 min-h-0 overflow-hidden w-full">
              {/* Left Panel - Enhanced Prescription Summary (Independent Scroll) */}
            <div className="relative flex-shrink-0 h-full">
              <div 
                className={`h-full border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden ${
                  isSidebarCollapsed ? 'w-0' : 'w-80'
                }`}
              >
                {!isSidebarCollapsed && (
                  <div className="w-80 h-full overflow-y-auto pb-20">
                    <EnhancedPrescriptionSummary
                      currentPrescription={{
                        symptoms,
                        diagnoses,
                        disorders,
                        medications,
                        labTests,
                        radiologyOrders,
                        surgeryOrders,
                        investigations,
                        notes,
                        followUp
                      }}

                      previousPrescriptions={mockPreviousPrescriptions.filter(
                        p => p.patient.id === selectedPatient.id
                      )}
                      onSectionClick={handleSectionClick}
                      onCopyPrescription={handleCopyPrescription}
                      onCopySymptoms={handleCopySymptoms}
                      onCopyDiagnoses={handleCopyDiagnosis}
                      onCopyMedications={handleCopyMedication}
                      onCopyLabTests={handleCopyLabTestsFromHistory}
                      onCopyRadiology={handleCopyRadiology}
                      onCopySurgery={handleCopySurgery}
                      onCopyInvestigations={handleCopyInvestigations}
                      onCopyNotes={handleCopyNotes}
                      onCopyFollowUp={handleCopyFollowUp}
                    />
                  </div>
                )}
              </div>
              
              {/* Collapse/Expand Toggle Button - Always visible */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`absolute top-4 ${isSidebarCollapsed ? 'left-0' : 'right-0'} translate-x-1/2 size-6 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all flex items-center justify-center z-10 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                }`}
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronLeft className="size-4 text-gray-600" />
              </button>
            </div>

            {/* Center - Doctor Workspace (Independent Scroll) */}
            <div className="flex-1 min-h-0 h-full bg-white overflow-y-auto pb-20">
              <div className="max-w-4xl mx-auto px-8 py-6 h-full">
                <TabsContent value="general" className="mt-0 h-full focus-visible:outline-none">
                  <DoctorWorkspace {...getWorkspaceProps(generalPresc)} />
                </TabsContent>
                <TabsContent value="ayurveda" className="mt-0 h-full focus-visible:outline-none">
                  <AyurvedaWorkspace {...getWorkspaceProps(ayurvedaPresc)} />
                </TabsContent>
                <TabsContent value="dental" className="mt-0 h-full focus-visible:outline-none">
                  <DentalWorkspace {...getWorkspaceProps(dentalPresc)} />
                </TabsContent>
                <TabsContent value="siddha" className="mt-0 h-full focus-visible:outline-none">
                  <SiddhaWorkspace {...getWorkspaceProps(siddhaPresc)} />
                </TabsContent>
                <TabsContent value="nursing" className="mt-0 h-full focus-visible:outline-none">
                  <NursingWorkspace {...getWorkspaceProps(nursingPresc)} />
                </TabsContent>
                <TabsContent value="veterinary" className="mt-0 h-full focus-visible:outline-none">
                  <VeterinaryWorkspace {...getWorkspaceProps(veterinaryPresc)} />
                </TabsContent>
              </div>
            </div>

            {/* Right Panel - AI Assistant (Independent Scroll) */}
            <div className="relative flex-shrink-0 h-full">
              <div 
                className={`h-full border-l border-gray-200 bg-white transition-all duration-300 overflow-hidden ${
                  isRightSidebarCollapsed ? 'w-0' : 'w-96'
                }`}
              >
                {!isRightSidebarCollapsed && (
                  <div className="w-96 h-full overflow-hidden">
                    <TabbedAIPanel
                      patient={selectedPatient}
                      symptoms={symptoms}
                      diagnoses={diagnoses}
                      disorders={disorders}
                      activeField={activeField}
                      searchQuery={searchQuery}
                      onAddDiagnosis={handleAddDiagnosis}
                      onAddDisorder={handleAddDisorder}
                      onAddMedication={handleAddMedication}
                      onAddNote={handleAddNote}
                      onAddSymptom={handleAddSymptom}
                      onAddLabTest={handleAddLabTestFromSearch}
                      onAddRadiology={handleAddRadiologyFromSearch}
                      onAddSurgery={handleAddSurgeryFromSearch}
                      onAddPatientAllergy={handleAddPatientAllergy}
                      workspaceId={activeSpecialty === 'general' ? 'allopathy' : activeSpecialty}
                    />
                  </div>
                )}
              </div>
              
              {/* Collapse/Expand Toggle Button - Always visible */}
              <button
                onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                className={`absolute top-4 ${isRightSidebarCollapsed ? 'right-0' : 'left-0'} -translate-x-1/2 size-6 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all flex items-center justify-center z-10 ${
                  isRightSidebarCollapsed ? 'rotate-180' : ''
                }`}
                title={isRightSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronRight className="size-4 text-gray-600" />
              </button>
            </div>
          </div>
          </Tabs>
          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="container mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                    <span>
                      Auto-saved{" "}
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  {!zenMode && (
                    <div className="text-xs text-gray-500">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px]">
                        Ctrl+S
                      </kbd>{" "}
                      Save · \n{" "}
                      <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px]">
                        Ctrl+R
                      </kbd>{" "}
                      Review · \n{" "}
                      <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px]">
                        Ctrl+Shift+S
                      </kbd>{" "}
                      Sign\n{" "}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSaveDraft}
                    variant="outline"
                    size="default"
                  >
                    <Save className="size-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleReview}
                    variant="outline"
                    size="default"
                    disabled={!canReview}
                  >
                    <Eye className="size-4 mr-2" />
                    Review
                  </Button>
                  <Button
                    onClick={() => {
                      if (!canSignAndSend) {
                        if (!isPatientConfirmed) {
                          toast.error(
                            "Please confirm patient identity first",
                          );
                        } else {
                          toast.error(
                            "Please add diagnosis and medications",
                          );
                        }
                        return;
                      }
                      handleReview();
                    }}
                    size="default"
                    disabled={!canSignAndSend}
                    className="bg-green-600 hover:bg-green-700 min-w-[160px]"
                  >
                    <Send className="size-4 mr-2" />
                    Sign & Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
          );
        })()
      )}

      {/* Modals */}
      <PatientConfirmationModal
        patient={selectedPatient}
        isOpen={showPatientModal}
        onConfirm={handlePatientConfirm}
        onCancel={handlePatientCancel}
      />

      <PatientOverviewPopup
        isOpen={showPatientOverview}
        onClose={() => setShowPatientOverview(false)}
        currentPatientId={selectedPatient?.id || null}
        onCopyDiagnosis={handleCopySingleDiagnosis}
        onCopyMedication={handleCopySingleMedication}
        onCopyNotes={handleCopyNotes}
      />

      {selectedPatient && (
        <>
          <ReviewModal
            isOpen={showReviewModal}
            prescription={getCurrentPrescription()}
            onClose={() => setShowReviewModal(false)}
            onProceedToAnalysis={handleProceedToAnalysis}
            onApproveAndSend={handleApproveAndSend}
          />

          <AnalysisModal
            isOpen={showAnalysisModal}
            prescription={getCurrentPrescription()}
            onClose={() => setShowAnalysisModal(false)}
            onProceedToSign={handleProceedToSign}
          />

          <SignAndSendModal
            isOpen={showSignModal}
            prescription={getCurrentPrescription()}
            onClose={() => setShowSignModal(false)}
            onSubmit={handleSubmit}
          />
        </>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        rxId={rxId}
        deliveryOptions={deliveryOptions}
        onClose={() => setShowSuccessModal(false)}
        onStartNew={handleStartNew}
      />

      <PreviousRecordsModal
        isOpen={showPreviousRecordsModal}
        onClose={() => setShowPreviousRecordsModal(false)}
        patient={selectedPatient}
        onRestoreDraft={restorePrescription}
      />
    </div>
  );
} 
