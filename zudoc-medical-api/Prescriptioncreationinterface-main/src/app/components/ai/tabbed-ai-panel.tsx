import { useState, useEffect } from 'react';
import { Lightbulb, Search, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Patient, Diagnosis, Medication } from '../../types/prescription';
import { AIAssistantPanel } from './ai-assistant-panel';
import { searchSnomed, SNOMED_HIERARCHIES } from '../../utils/snomed';
import { addRecentItem } from '../../utils/search-engine';

interface TabbedAIPanelProps {
  patient: Patient | null;
  symptoms: string;
  diagnoses: Diagnosis[];
  disorders: Diagnosis[];
  activeField: string | null;
  searchQuery: string;
  onAddDiagnosis: (diagnosis: Diagnosis) => void;
  onAddDisorder: (disorder: Diagnosis) => void;
  onAddMedication: (medication: Medication) => void;
  onAddNote: (note: string) => void;
  onAddSymptom: (symptom: string) => void;
  onAddLabTest: (labTest: any) => void;
  onAddRadiology: (radiology: any) => void;
  onAddSurgery?: (surgery: any) => void;
  onAddPatientAllergy?: (allergy: Diagnosis) => void;
  workspaceId?: string;
}



export function TabbedAIPanel({
  patient,
  symptoms,
  diagnoses,
  disorders,
  activeField,
  searchQuery,
  onAddDiagnosis,
  onAddDisorder,
  onAddMedication,
  onAddNote,
  onAddSymptom,
  onAddLabTest,
  onAddRadiology,
  onAddSurgery,
  onAddPatientAllergy,
  workspaceId,
}: TabbedAIPanelProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'search'>('ai');
  const [snomedResults, setSnomedResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-switch to search tab when user is typing and there's a query
  useEffect(() => {
    // Disable auto-switch for medications
    if (activeField && activeField !== 'medications' && searchQuery.length > 0) {
      setActiveTab('search');
    }
  }, [activeField, searchQuery]);

  // Fetch SNOMED results when searchQuery changes
  useEffect(() => {
    const fetchSnomedResults = async () => {
      if (!searchQuery || searchQuery.length < 2 || !activeField || activeField.toLowerCase() === 'medications') {
        setSnomedResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Map activeField to SNOMED ECL
        const fieldEclMap: Record<string, string> = {
          'symptoms': SNOMED_HIERARCHIES.SYMPTOMS,
          'diagnosis': SNOMED_HIERARCHIES.DIAGNOSIS,
          'disorders': SNOMED_HIERARCHIES.DIAGNOSIS,
          'lab': SNOMED_HIERARCHIES.LAB,
          'radiology': SNOMED_HIERARCHIES.RADIOLOGY,
          'surgery': SNOMED_HIERARCHIES.SURGERY,
          'ayush': SNOMED_HIERARCHIES.AYUSH,
          'dental': SNOMED_HIERARCHIES.DENTAL,
          'nursing': SNOMED_HIERARCHIES.NURSING,
          'vet': SNOMED_HIERARCHIES.VET,
          'dental_symptoms': SNOMED_HIERARCHIES.DENTAL_SYMPTOMS,
          'dental_diagnosis': SNOMED_HIERARCHIES.DENTAL_DIAGNOSIS,
          'dental_disorders': SNOMED_HIERARCHIES.DENTAL_DIAGNOSIS,
          'allergies': SNOMED_HIERARCHIES.ALLERGIES,
        };

        const ecl = fieldEclMap[activeField] || SNOMED_HIERARCHIES.SYMPTOMS;
        const results = await searchSnomed(searchQuery, ecl, 15, undefined, workspaceId);
        
        const mappedResults = results.map(item => ({
          ...item,
          category: activeField.toUpperCase()
        }));
        
        setSnomedResults(mappedResults);
      } catch (error) {
        console.error('Snowstorm fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSnomedResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeField]);


  // Use SNOMED results for all fields now
  const filteredSuggestions = snomedResults;

  const handleSelectSuggestion = (suggestion: any) => {
    // Handle selection based on field type
    switch (activeField?.toLowerCase()) {
      case 'allergies':
        if (onAddPatientAllergy) {
          onAddPatientAllergy({
            id: Date.now().toString(),
            name: typeof suggestion === 'string' ? suggestion : suggestion.name,
            addedFromAI: true,
            snomedId: suggestion.id,
          });
        }
        addRecentItem(SNOMED_HIERARCHIES.ALLERGIES, suggestion, workspaceId);
        break;
      case 'diagnosis':
      case 'dental_diagnosis':
        onAddDiagnosis({
          id: Date.now().toString(),
          name: typeof suggestion === 'string' ? suggestion : suggestion.name,
          addedFromAI: true,
          snomedId: suggestion.id,
        });
        addRecentItem(SNOMED_HIERARCHIES.DIAGNOSIS, suggestion, workspaceId);
        break;
      case 'disorders':
      case 'dental_disorders':
        onAddDisorder({
          id: Date.now().toString(),
          name: typeof suggestion === 'string' ? suggestion : suggestion.name,
          addedFromAI: true,
          snomedId: suggestion.id,
        });
        addRecentItem(SNOMED_HIERARCHIES.DIAGNOSIS, suggestion, workspaceId);
        break;
      
      case 'medications':
        onAddMedication({
          id: Date.now().toString(),
          drugName: suggestion.name,
          dose: '',
          frequency: '',
          duration: '',
          route: 'Oral',
          instructions: '',
          addedFromAI: false,
          snomedId: suggestion.id,
        });
        addRecentItem(SNOMED_HIERARCHIES.MEDICATIONS, suggestion, workspaceId);
        break;
      
      case 'symptoms':
      case 'dental_symptoms': {
        const symName = typeof suggestion === 'string' ? suggestion : suggestion.name;
        onAddSymptom(symName);
        addRecentItem(SNOMED_HIERARCHIES.SYMPTOMS, suggestion, workspaceId);
        break;
      }
      
      case 'lab':
        onAddLabTest({
          id: Date.now().toString(),
          testName: suggestion.name,
          priority: 'Routine',
          addedFromAI: false,
          snomedId: suggestion.id,
        });
        addRecentItem(SNOMED_HIERARCHIES.LAB, suggestion, workspaceId);
        break;
      
      case 'radiology':
        onAddRadiology({
          id: Date.now().toString(),
          procedureName: suggestion.name,
          bodyPart: '',
          priority: 'Routine',
          addedFromAI: false,
          snomedId: suggestion.id,
        });
        addRecentItem(SNOMED_HIERARCHIES.RADIOLOGY, suggestion, workspaceId);
        break;
      
      case 'surgery':
        if (onAddSurgery) {
          onAddSurgery({
            id: Date.now().toString(),
            procedureName: suggestion.name,
            urgency: 'Elective',
            addedFromAI: false,
            snomedId: suggestion.id,
          });
        }
        addRecentItem(SNOMED_HIERARCHIES.SURGERY, suggestion, workspaceId);
        break;
    }

    // Switch back to AI tab and clear search after selection
    setActiveTab('ai');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-start gap-3 flex-1">
          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
            <Lightbulb className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Suggestions only. Nothing added automatically.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Lightbulb className="size-3.5" />
              <span>AI Suggestions</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Search className="size-3.5" />
              <span>Search</span>
              {filteredSuggestions.length > 0 && (
                <Badge className="bg-blue-500 text-white text-xs h-4 px-1 min-w-[16px]">
                  {filteredSuggestions.length}
                </Badge>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'ai' ? (
          <div className="p-6 space-y-6">
            <AIAssistantPanel
              patient={patient}
              symptoms={symptoms}
              diagnoses={diagnoses}
              onAddDiagnosis={onAddDiagnosis}
              onAddMedication={onAddMedication}
              onAddNote={onAddNote}
            />
          </div>
        ) : (
          <div className="p-4">
            {activeField && searchQuery ? (
              <>
                <div className="mb-3">
                  <p className="text-xs text-gray-600">
                    Searching in <span className="font-semibold">{activeField}</span> for "{searchQuery}"
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-3 bg-white/60 hover:bg-white border border-gray-100 hover:border-blue-300 rounded-xl transition-all group shadow-sm hover:shadow-md mb-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 group-hover:text-blue-700 font-semibold leading-tight">
                              {typeof suggestion === 'string' ? suggestion : suggestion.name}
                            </div>
                            {typeof suggestion !== 'string' && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                  ID: {suggestion.id}
                                </span>
                                {suggestion.category && (
                                  <span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
                                    {suggestion.category}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="bg-gray-50 group-hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                            <Plus className="size-4 text-gray-400 group-hover:text-blue-600" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="size-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No results found</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Start typing to search
                </p>
                <p className="text-xs text-gray-500">
                  Type in any field to see suggestions
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}