import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Medication } from '../../types/prescription';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { X, Check, Info, Search, Loader2, Clock } from 'lucide-react';
import { searchSnomed, searchDrugs, SNOMED_HIERARCHIES } from '../../utils/snomed';
import { getLocalSuggestions, addRecentItem } from '../../utils/search-engine';

interface ImprovedMedicationFormProps {
  onAdd?: (medication: Medication) => void;
  onEdit?: (medication: Medication) => void;
  onCancel: () => void;
  lastMedication?: Medication | null;
  medication?: Medication; // For edit mode
  autoScroll?: boolean; // New prop to control auto-scroll
  onFieldFocus?: (field: string, query: string) => void;
  workspaceId?: string;
}

const frequencyPresets = [
  { label: '1-0-0', value: '1-0-0', shortcut: '100' },
  { label: '0-1-0', value: '0-1-0', shortcut: '010' },
  { label: '0-0-1', value: '0-0-1', shortcut: '001' },
  { label: '1-1-0', value: '1-1-0', shortcut: '110' },
  { label: '1-0-1', value: '1-0-1', shortcut: '101' },
  { label: '0-1-1', value: '0-1-1', shortcut: '011' },
  { label: '1-1-1', value: '1-1-1', shortcut: '111' },
  { label: 'SOS', value: 'SOS', shortcut: 'sos' },
  { label: 'BD', value: 'BD', shortcut: 'bd' },
  { label: 'TDS', value: 'TDS', shortcut: 'tds' },
  { label: 'QID', value: 'QID', shortcut: 'qid' }
];

const routeOptions = ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Rectal'];
const instructionOptions = [
  'Before food',
  'After food',
  'With food',
  'Empty stomach',
  'At bedtime',
  'As needed'
];

export function ImprovedMedicationForm({ onAdd, onEdit, onCancel, lastMedication, medication, autoScroll, onFieldFocus, workspaceId }: ImprovedMedicationFormProps) {
  const [drugName, setDrugName] = useState(medication?.drugName || '');
  const [dose, setDose] = useState(medication?.dose || '');
  const [frequency, setFrequency] = useState(medication?.frequency || '');
  const [duration, setDuration] = useState(medication?.duration || '');
  const [route, setRoute] = useState(medication?.route || 'Oral');
  const [instructions, setInstructions] = useState(medication?.instructions || 'After food');
  const [isStat, setIsStat] = useState(medication?.frequency === 'STAT' || false);
  
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(-1);
  const [snomedSuggestions, setSnomedSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [frequencyInput, setFrequencyInput] = useState('');
  
  const [localSuggestions, setLocalSuggestions] = useState<any[]>([]);
  const [isRecent, setIsRecent] = useState<boolean[]>([]);
  const [isFrequent, setIsFrequent] = useState<boolean[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const drugRef = useRef<HTMLInputElement>(null);
  const doseRef = useRef<HTMLInputElement>(null);
  const frequencyRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const routeRef = useRef<HTMLSelectElement>(null);
  const instructionsRef = useRef<HTMLSelectElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { items, isRecent: recentFlags, isFrequent: frequentFlags } = getLocalSuggestions(drugName, SNOMED_HIERARCHIES.MEDICATIONS, workspaceId || 'shared');
    setLocalSuggestions(items);
    setIsRecent(recentFlags);
    setIsFrequent(frequentFlags);
  }, [drugName, workspaceId]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const results = await searchDrugs(drugName);
      setSnomedSuggestions(results);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchResults, drugName ? 300 : 0);
    return () => clearTimeout(timer);
  }, [drugName]);

  const allSuggestions = (() => {
    const merged = [...localSuggestions];
    const mergedFlags = [...isRecent];
    const mergedFreqFlags = [...isFrequent];
    
    snomedSuggestions.forEach(snomedItem => {
      if (!merged.some(localItem => localItem.name.toLowerCase() === snomedItem.name.toLowerCase())) {
        merged.push(snomedItem);
        mergedFlags.push(false);
        mergedFreqFlags.push(false);
      }
    });
    return { items: merged, flags: mergedFlags, freqFlags: mergedFreqFlags };
  })();

  const filteredDrugs = allSuggestions.items;

  useEffect(() => {
    drugRef.current?.focus();
    
    // Auto-scroll form into view with smooth animation
    if (autoScroll && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [autoScroll]);

  const parseDuration = (input: string): string => {
    const match = input.match(/^(\d+)([dwmy]?)$/i);
    if (!match) return input;
    
    const [, num, unit] = match;
    const unitMap: Record<string, string> = {
      d: 'days',
      w: 'weeks',
      m: 'months',
      y: 'years'
    };
    
    return unit ? `${num} ${unitMap[unit.toLowerCase()] || 'days'}` : input;
  };

  const handleDrugKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedDrugIndex(prev => Math.min(prev + 1, filteredDrugs.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedDrugIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedDrugIndex >= 0 && filteredDrugs[selectedDrugIndex]) {
        setDrugName(filteredDrugs[selectedDrugIndex].name);
        setShowDrugSuggestions(false);
        setSelectedDrugIndex(-1);
        doseRef.current?.focus();
      } else if (drugName.trim()) {
        doseRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      setShowDrugSuggestions(false);
      setSelectedDrugIndex(-1);
    } else if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      doseRef.current?.focus();
    }
  };

  const handleFrequencyKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.key.toLowerCase();
    const newInput = frequencyInput + input;
    
    // Check for shortcuts
    const match = frequencyPresets.find(f => f.shortcut.toLowerCase() === newInput.toLowerCase());
    if (match) {
      e.preventDefault();
      setFrequency(match.value);
      setFrequencyInput('');
      setTimeout(() => durationRef.current?.focus(), 0);
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (frequency) {
        durationRef.current?.focus();
      }
    } else if (e.key === 'Backspace' && !frequencyInput && frequency) {
      e.preventDefault();
      setFrequency('');
    } else if (e.key === 'Escape') {
      setFrequencyInput('');
    } else if (/^[0-9a-z]$/.test(input)) {
      setFrequencyInput(newInput);
      setTimeout(() => setFrequencyInput(''), 1000);
    }
  };

  const handleDurationBlur = () => {
    if (duration) {
      const parsed = parseDuration(duration);
      setDuration(parsed);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!drugName.trim()) newErrors.drugName = 'Required';
    if (!dose.trim()) newErrors.dose = 'Required';
    if (!frequency) newErrors.frequency = 'Required';
    if (!duration.trim()) newErrors.duration = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = (andStay = false) => {
    if (!validateForm()) return;
    
    const newMedication: Medication = {
      id: Date.now().toString(),
      drugName,
      dose,
      frequency: isStat ? 'STAT' : frequency,
      duration,
      route,
      instructions,
      addedFromAI: false
    };

    addRecentItem(SNOMED_HIERARCHIES.MEDICATIONS, { id: `local-${Date.now()}`, name: drugName, category: 'Medication' }, workspaceId || 'shared');

    if (onAdd) {
      onAdd(newMedication);
    } else if (onEdit && medication) {
      onEdit({ ...medication, ...newMedication });
    }

    if (andStay) {
      // Clear form and focus back on drug
      setDrugName('');
      setDose('');
      setFrequency('');
      setDuration('');
      setRoute('Oral');
      setInstructions('After food');
      setIsStat(false);
      setErrors({});
      drugRef.current?.focus();
    }
  };

  const handleDuplicate = () => {
    if (lastMedication) {
      setDrugName(lastMedication.drugName);
      setDose(lastMedication.dose);
      setFrequency(lastMedication.frequency === 'STAT' ? 'SOS' : lastMedication.frequency);
      setDuration(lastMedication.duration);
      setRoute(lastMedication.route);
      setInstructions(lastMedication.instructions);
      setIsStat(false);
      drugRef.current?.focus();
    }
  };

  const previewText = drugName && dose && frequency && duration
    ? `${drugName} – ${dose} – ${isStat ? 'STAT' : frequency} – ${duration} – ${route}`
    : '';

  return (
    <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 shadow-sm" ref={formContainerRef}>
      <div className="space-y-4">
        {/* Drug Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Drug Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? <Loader2 className="size-4 text-blue-500 animate-spin" /> : <Search className="size-4 text-gray-400" />}
            </div>
            <Input
              ref={drugRef}
              value={drugName}
              onChange={e => {
                setDrugName(e.target.value);
                setShowDrugSuggestions(true);
                setSelectedDrugIndex(-1);
                setErrors(prev => ({ ...prev, drugName: '' }));
                onFieldFocus?.('Medications', e.target.value);
              }}
              onKeyDown={handleDrugKeyDown}
              onFocus={() => setShowDrugSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDrugSuggestions(false), 200)}
              placeholder="Search for drugs..."
              className={`h-10 pl-10 ${errors.drugName ? 'border-red-400' : ''}`}
            />
            {errors.drugName && <p className="text-xs text-red-600 mt-1">{errors.drugName}</p>}
            
            {/* Suggestions */}
            {showDrugSuggestions && (filteredDrugs.length > 0 || drugName) && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredDrugs.map((drug, index) => {
                  const isRecentItem = allSuggestions.flags[index];
                  return (
                  <button
                    key={drug.id}
                    type="button"
                    onClick={() => {
                      setDrugName(drug.name);
                      setShowDrugSuggestions(false);
                      doseRef.current?.focus();
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors flex flex-col ${
                      index === selectedDrugIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isRecentItem && !allSuggestions.freqFlags[index] && <Clock className="size-3 text-blue-500" />}
                      {allSuggestions.freqFlags[index] && <span className="text-orange-500 text-xs">🔥</span>}
                      <span className="text-sm font-medium">{drug.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-[10px] text-gray-400 font-mono">ID: {drug.id}</span>
                      <div className="flex gap-1">
                        {!isRecentItem && !allSuggestions.freqFlags[index] && drug.category && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                            {drug.category}
                          </span>
                        )}
                        {allSuggestions.freqFlags[index] && (
                          <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-medium border border-orange-100">
                            Frequent
                          </span>
                        )}
                        {isRecentItem && !allSuggestions.freqFlags[index] && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium border border-blue-100">
                            Recent
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dose, Frequency, Duration - Same Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Dose */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Dose <span className="text-red-500">*</span>
            </label>
            <Input
              ref={doseRef}
              value={dose}
              onChange={e => {
                setDose(e.target.value);
                setErrors(prev => ({ ...prev, dose: '' }));
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  frequencyRef.current?.focus();
                }
              }}
              placeholder="e.g., 5ml, 1 tab"
              className={`h-10 ${errors.dose ? 'border-red-400' : ''}`}
            />
            {errors.dose && <p className="text-xs text-red-600 mt-1">{errors.dose}</p>}
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Frequency <span className="text-red-500">*</span>
            </label>
            <Input
              ref={frequencyRef}
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              onKeyDown={handleFrequencyKeyDown}
              placeholder="100, 101, sos..."
              className={`h-10 ${errors.frequency ? 'border-red-400' : ''}`}
            />
            {errors.frequency && <p className="text-xs text-red-600 mt-1">{errors.frequency}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Duration <span className="text-red-500">*</span>
            </label>
            <Input
              ref={durationRef}
              value={duration}
              onChange={e => {
                setDuration(e.target.value);
                setErrors(prev => ({ ...prev, duration: '' }));
              }}
              onBlur={handleDurationBlur}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  routeRef.current?.focus();
                }
              }}
              placeholder="5d, 3w, 1m"
              className={`h-10 ${errors.duration ? 'border-red-400' : ''}`}
            />
            {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Frequency Chips */}
        <div className="flex flex-wrap gap-2">
          {frequencyPresets.map(preset => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                setFrequency(preset.value);
                setErrors(prev => ({ ...prev, frequency: '' }));
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                frequency === preset.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsStat(!isStat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              isStat
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            STAT
          </button>
        </div>

        {/* Route and Instructions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Route</label>
            <select
              ref={routeRef}
              value={route}
              onChange={e => setRoute(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  instructionsRef.current?.focus();
                }
              }}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {routeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Instructions</label>
            <select
              ref={instructionsRef}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd(true);
                }
              }}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {instructionOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        {previewText && (
          <div className="p-3 bg-blue-100 border border-blue-300 rounded-md">
            <p className="text-xs font-semibold text-blue-900 mb-1">Preview:</p>
            <p className="text-sm text-blue-800">{previewText}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={() => handleAdd(medication ? false : true)}
            className="flex-1 bg-green-600 hover:bg-green-700 h-10"
            type="button"
          >
            <Check className="size-4 mr-2" />
            {medication ? 'Update Medication' : 'Add Medication'}
          </Button>
          <Button onClick={onCancel} variant="outline" className="h-10" type="button">
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}