import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { LabTest } from '../../types/prescription';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Loader2, Clock } from 'lucide-react';
import { searchSnomed, SNOMED_HIERARCHIES } from '../../utils/snomed';
import { getLocalSuggestions, addRecentItem } from '../../utils/search-engine';

interface LabTestFormProps {
  labTest?: LabTest;
  onAdd?: (labTest: Omit<LabTest, 'id'>) => void;
  onEdit?: (labTest: Omit<LabTest, 'id'>) => void;
  onCancel: () => void;
  autoScroll?: boolean;
  onFieldFocus?: (field: string, query: string) => void;
  workspaceId?: string;
}

export function LabTestForm({ labTest, onAdd, onEdit, onCancel, autoScroll, onFieldFocus, workspaceId }: LabTestFormProps) {
  const [testName, setTestName] = useState(labTest?.testName || '');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'STAT'>(labTest?.priority || 'Routine');
  const [instructions, setInstructions] = useState(labTest?.instructions || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [snomedSuggestions, setSnomedSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [localSuggestions, setLocalSuggestions] = useState<any[]>([]);
  const [isRecent, setIsRecent] = useState<boolean[]>([]);
  
  const testNameRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const { items, isRecent: recentFlags } = getLocalSuggestions(testName, SNOMED_HIERARCHIES.LAB, workspaceId || 'shared');
    setLocalSuggestions(items);
    setIsRecent(recentFlags);
  }, [testName, workspaceId]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const results = await searchSnomed(testName, SNOMED_HIERARCHIES.LAB, 15, undefined, workspaceId);
      setSnomedSuggestions(results);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchResults, testName ? 300 : 0);
    return () => clearTimeout(timer);
  }, [testName]);

  // Auto-scroll form into view with smooth animation
  useEffect(() => {
    testNameRef.current?.focus();
    
    if (autoScroll && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [autoScroll]);

  const allSuggestions = (() => {
    const merged = [...localSuggestions];
    const mergedFlags = [...isRecent];
    
    snomedSuggestions.forEach(snomedItem => {
      if (!merged.some(localItem => localItem.name.toLowerCase() === snomedItem.name.toLowerCase())) {
        merged.push(snomedItem);
        mergedFlags.push(false);
      }
    });
    return { items: merged, flags: mergedFlags };
  })();

  const filteredTests = allSuggestions.items;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredTests.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setTestName(filteredTests[selectedIndex].name);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const labTestData = {
      testName: testName.trim(),
      priority,
      instructions: instructions.trim(),
      addedFromAI: false
    };

    addRecentItem(SNOMED_HIERARCHIES.LAB, { id: `local-${Date.now()}`, name: testName, category: 'Lab' }, workspaceId || 'shared');

    if (labTest && onEdit) {
      onEdit(labTestData);
    } else if (onAdd) {
      onAdd(labTestData);
    }
  };

  return (
    <form ref={formContainerRef} onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="testName">Test Name*</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? <Loader2 className="size-4 text-blue-500 animate-spin" /> : <Search className="size-4 text-gray-400" />}
            </div>
            <Input
              ref={testNameRef}
              id="testName"
              value={testName}
              onChange={e => {
                setTestName(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
                onFieldFocus?.('Lab Test', e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for lab tests..."
              className="pl-10"
              autoFocus
              required
            />
            
            {/* Inline Suggestions Dropdown */}
            {showSuggestions && (filteredTests.length > 0 || testName) && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredTests.map((test, index) => {
                  const isRecentItem = allSuggestions.flags[index];
                  return (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => {
                      setTestName(test.name);
                      setShowSuggestions(false);
                      setSelectedIndex(-1);
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors flex flex-col border-b border-gray-100 last:border-0 ${
                      index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isRecentItem && <Clock className="size-3 text-blue-500" />}
                      <span className="text-sm font-medium">{test.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5 w-full">
                      <span className="text-[10px] text-gray-400 font-mono">SCTID: {test.id}</span>
                      {isRecentItem && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium border border-blue-100">
                          Recent
                        </span>
                      )}
                    </div>
                  </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Routine">Routine</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="STAT">STAT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="e.g., Fasting required"
          className="min-h-20"
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!testName.trim()}>
          {labTest ? 'Update' : 'Add'} Test
        </Button>
      </div>
    </form>
  );
}