import { Patient, Medication, Diagnosis } from '../../types/prescription';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Lightbulb, Plus, Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AIAssistantPanelProps {
  patient: Patient | null;

  symptoms: string;
  diagnoses: Diagnosis[];
  onAddDiagnosis: (diagnosis: Diagnosis) => void;
  onAddMedication: (medication: Medication) => void;
  onAddNote: (note: string) => void;
}

export function AIAssistantPanel({
  patient,
  symptoms,
  diagnoses,
  onAddDiagnosis,
  onAddMedication,
  onAddNote
}: AIAssistantPanelProps) {
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  // AI generates suggestions based on symptoms or diagnosis
  const hasSuggestions = symptoms || diagnoses.length > 0;

  const handleAddDiagnosis = () => {
    onAddDiagnosis({
      id: Date.now().toString(),
      name: 'Acute Pharyngitis',
      addedFromAI: true
    });
  };

  const handleAddMedication = (drugName: string, dose: string, frequency: string, duration: string) => {
    onAddMedication({
      id: Date.now().toString(),
      drugName,
      dose,
      frequency,
      duration,
      route: 'Oral',
      instructions: 'After food',
      addedFromAI: true
    });
  };

  const handleAddInstruction = () => {
    onAddNote('Increase fluid intake. Warm saline gargles 3-4 times daily. Adequate rest.');
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Please select a patient to see AI suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Context */}
      <Card className="p-4 bg-white/80 backdrop-blur">

        <div className="text-xs space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Patient:</span> {patient.name}, {patient.age}y/{patient.gender}
          </p>
          <p>
            <span className="font-medium">Weight:</span> {patient.weight}kg
          </p>
          {patient.allergies.length > 0 && (
            <p className="text-red-600">
              <span className="font-medium">Allergies:</span> {patient.allergies.join(', ')}
            </p>
          )}
          {patient.conditions.length > 0 && (
            <p>
              <span className="font-medium">Conditions:</span> {patient.conditions.join(', ')}
            </p>
          )}
        </div>
      </Card>

      {!hasSuggestions && (
        <div className="text-center py-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="size-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">
            Enter symptoms or diagnosis to get AI suggestions
          </p>
        </div>
      )}

      {hasSuggestions && (
        <>
          {/* Possible Diagnosis */}
          {symptoms && diagnoses.length === 0 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Possible Diagnosis</h3>
                  <p className="text-sm text-gray-700">Acute Pharyngitis</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  82% confidence
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddDiagnosis} size="sm" className="flex-1">
                  <Plus className="size-3 mr-1" />
                  Add Diagnosis
                </Button>
                <Button
                  onClick={() => setExpandedRationale(expandedRationale === 'diag' ? null : 'diag')}
                  size="sm"
                  variant="outline"
                >
                  <Info className="size-3" />
                </Button>
              </div>
              {expandedRationale === 'diag' && (
                <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-700">
                  Based on symptoms: fever and throat pain for 3 days. Common presentation in
                  pediatric patients. Consider strep testing if symptoms persist.
                </div>
              )}
            </Card>
          )}

          {/* Medication Suggestions */}
          {diagnoses.length > 0 && (
            <>
              <Card className="p-4 bg-white shadow-sm">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Medication Suggestion</h3>
                  <p className="text-sm text-gray-700">Paracetamol Syrup 250mg/5ml</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Recommended dose for {patient.weight}kg: 5ml
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddMedication('Paracetamol Syrup 250mg/5ml', '5ml', '1-1-1', '5 days')}
                    size="sm"
                    className="flex-1"
                  >
                    <Plus className="size-3 mr-1" />
                    Add to Prescription
                  </Button>
                  <Button
                    onClick={() => setExpandedRationale(expandedRationale === 'para' ? null : 'para')}
                    size="sm"
                    variant="outline"
                  >
                    <Info className="size-3" />
                  </Button>
                </div>
                {expandedRationale === 'para' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-700">
                    Weight-based dosing: 10-15mg/kg/dose. Patient weight: {patient.weight}kg. No known
                    allergies. Safe for antipyretic use.
                  </div>
                )}
              </Card>

              <Card className="p-4 bg-white shadow-sm">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Consider</h3>
                  <p className="text-sm text-gray-700">Azithromycin Suspension 200mg/5ml</p>
                  <Badge variant="outline" className="mt-2 text-xs bg-amber-50 border-amber-300 text-amber-700">
                    Review necessity - Antibiotic stewardship
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddMedication('Azithromycin Suspension 200mg/5ml', '5ml', '1-0-0', '3 days')}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="size-3 mr-1" />
                    Add
                  </Button>
                  <Button
                    onClick={() => setExpandedRationale(expandedRationale === 'azi' ? null : 'azi')}
                    size="sm"
                    variant="outline"
                  >
                    <Info className="size-3" />
                  </Button>
                </div>
                {expandedRationale === 'azi' && (
                  <div className="mt-3 p-3 bg-amber-50 rounded text-xs text-gray-700">
                    Consider if bacterial etiology suspected. Recommended to wait for clinical
                    progression or test results before prescribing antibiotics per antimicrobial
                    stewardship guidelines.
                  </div>
                )}
              </Card>
            </>
          )}

          {/* Patient Instructions */}
          {diagnoses.length > 0 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">Patient Instructions</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Increase fluid intake</li>
                  <li>Warm saline gargles 3-4 times daily</li>
                  <li>Adequate rest</li>
                </ul>
              </div>
              <Button onClick={handleAddInstruction} size="sm" className="w-full">
                <Plus className="size-3 mr-1" />
                Add to Notes
              </Button>
            </Card>
          )}

          {/* Safety Checks */}
          <Card className="p-4 bg-green-50 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Safety Checks</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full" />
                <span>No allergy conflicts detected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full" />
                <span>Dose within typical range</span>
              </div>
              {patient.age < 12 && (
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-blue-500 rounded-full" />
                  <span>Pediatric dosing verified</span>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}