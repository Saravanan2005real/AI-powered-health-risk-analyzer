import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { SurgeryOrder } from '../../types/prescription';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Loader2, Clock } from 'lucide-react';
import { searchSnomed, SNOMED_HIERARCHIES } from '../../utils/snomed';
import { getLocalSuggestions, addRecentItem } from '../../utils/search-engine';

interface SurgeryFormProps {
  surgeryOrder?: SurgeryOrder;
  onAdd?: (order: Omit<SurgeryOrder, 'id'>) => void;
  onEdit?: (order: Omit<SurgeryOrder, 'id'>) => void;
  onCancel: () => void;
  autoScroll?: boolean;
  onFieldFocus?: (field: string, query: string) => void;
  workspaceId?: string;
}

export function SurgeryForm({ surgeryOrder, onAdd, onEdit, onCancel, autoScroll, onFieldFocus, workspaceId }: SurgeryFormProps) {
  const [procedureName, setProcedureName] = useState(surgeryOrder?.procedureName || '');
  const [urgency, setUrgency] = useState<'Elective' | 'Urgent' | 'Emergency'>(surgeryOrder?.urgency || 'Elective');
  const [estimatedDuration, setEstimatedDuration] = useState(surgeryOrder?.estimatedDuration || '');
  const [anesthesiaType, setAnesthesiaType] = useState(surgeryOrder?.anesthesiaType || '');
  const [instructions, setInstructions] = useState(surgeryOrder?.instructions || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [snomedSuggestions, setSnomedSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [localSuggestions, setLocalSuggestions] = useState<any[]>([]);
  const [isRecent, setIsRecent] = useState<boolean[]>([]);
  
  const procedureRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const { items, isRecent: recentFlags } = getLocalSuggestions(procedureName, SNOMED_HIERARCHIES.SURGERY, workspaceId || 'shared');
    setLocalSuggestions(items);
    setIsRecent(recentFlags);
  }, [procedureName, workspaceId]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const results = await searchSnomed(procedureName, SNOMED_HIERARCHIES.SURGERY, 15, undefined, workspaceId);
      setSnomedSuggestions(results);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchResults, procedureName ? 300 : 0);
    return () => clearTimeout(timer);
  }, [procedureName]);

  // Auto-scroll form into view with smooth animation
  useEffect(() => {
    procedureRef.current?.focus();
    
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

  const filteredProcedures = allSuggestions.items;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredProcedures.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setProcedureName(filteredProcedures[selectedIndex].name);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procedureName.trim()) return;

    const orderData = {
      procedureName: procedureName.trim(),
      urgency,
      estimatedDuration: estimatedDuration.trim(),
      anesthesiaType: anesthesiaType.trim(),
      instructions: instructions.trim(),
      addedFromAI: false
    };

    addRecentItem(SNOMED_HIERARCHIES.SURGERY, { id: `local-${Date.now()}`, name: procedureName, category: 'Surgery' }, workspaceId || 'shared');

    if (surgeryOrder && onEdit) {
      onEdit(orderData);
    } else if (onAdd) {
      onAdd(orderData);
    }
  };

  return (
    <form ref={formContainerRef} onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
      <div>
        <Label htmlFor="procedureName">Procedure Name*</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading ? <Loader2 className="size-4 text-blue-500 animate-spin" /> : <Search className="size-4 text-gray-400" />}
          </div>
          <Input
            ref={procedureRef}
            id="procedureName"
            value={procedureName}
            onChange={e => {
              setProcedureName(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
              onFieldFocus?.('Surgery', e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for surgical procedures..."
            className="pl-10"
            autoFocus
            required
          />
          
          {/* Inline Suggestions Dropdown */}
          {showSuggestions && (filteredProcedures.length > 0 || procedureName) && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredProcedures.map((proc, index) => {
                const isRecentItem = allSuggestions.flags[index];
                return (
                <button
                  key={proc.id}
                  type="button"
                  onClick={() => {
                    setProcedureName(proc.name);
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors flex flex-col border-b border-gray-100 last:border-0 ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isRecentItem && <Clock className="size-3 text-blue-500" />}
                    <span className="text-sm font-medium">{proc.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 w-full">
                    <span className="text-[10px] text-gray-400 font-mono">SCTID: {proc.id}</span>
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
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="urgency">Urgency</Label>
          <Select value={urgency} onValueChange={(v) => setUrgency(v as any)}>
            <SelectTrigger id="urgency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Elective">Elective</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="estimatedDuration">Est. Duration</Label>
          <Input
            id="estimatedDuration"
            value={estimatedDuration}
            onChange={e => setEstimatedDuration(e.target.value)}
            placeholder="e.g., 2 hours"
          />
        </div>
        <div>
          <Label htmlFor="anesthesiaType">Anesthesia</Label>
          <Input
            id="anesthesiaType"
            value={anesthesiaType}
            onChange={e => setAnesthesiaType(e.target.value)}
            placeholder="e.g., General"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instructions">Pre/Post-op Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Pre-operative and post-operative instructions"
          className="min-h-20"
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!procedureName.trim()}>
          {surgeryOrder ? 'Update' : 'Add'} Procedure
        </Button>
      </div>
    </form>
  );
}