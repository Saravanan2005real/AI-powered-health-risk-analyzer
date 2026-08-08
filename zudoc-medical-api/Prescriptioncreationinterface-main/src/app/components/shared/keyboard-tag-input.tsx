import { useState, KeyboardEvent, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { X, Search, Loader2, Clock, Flame } from 'lucide-react';
import { searchSnomed, SNOMED_HIERARCHIES } from '../../utils/snomed';
import { getLocalSuggestions, addRecentItem } from '../../utils/search-engine';

interface KeyboardTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder: string;
  label: string;

  required?: boolean;
  onEnterNext?: () => void;
  zenMode?: boolean;
  onFieldFocus?: (field: string, query: string) => void;
  onArrowDownInField?: () => void;
  snomedHierarchy?: string;
  workspaceId?: string;
  disableDropdown?: boolean;
}

export function KeyboardTagInput({
  value,
  onChange,
  suggestions = [],
  placeholder,
  label,

  required = false,
  onEnterNext,
  zenMode = false,
  onFieldFocus,
  onArrowDownInField,
  snomedHierarchy,
  workspaceId,
  disableDropdown = false
}: KeyboardTagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [snomedSuggestions, setSnomedSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [localSuggestions, setLocalSuggestions] = useState<any[]>([]);
  const [isRecent, setIsRecent] = useState<boolean[]>([]);
  const [isFrequent, setIsFrequent] = useState<boolean[]>([]);

  useEffect(() => {
    if (snomedHierarchy) {
      const { items, isRecent: recentFlags, isFrequent: frequentFlags } = getLocalSuggestions(input, snomedHierarchy, workspaceId || 'shared');
      // Filter out items already selected
      const filteredItems: any[] = [];
      const filteredRecent: boolean[] = [];
      const filteredFrequent: boolean[] = [];
      
      items.forEach((item, idx) => {
        if (!value.includes(item.name)) {
          filteredItems.push(item);
          filteredRecent.push(recentFlags[idx]);
          filteredFrequent.push(frequentFlags[idx]);
        }
      });
      
      setLocalSuggestions(filteredItems);
      setIsRecent(filteredRecent);
      setIsFrequent(filteredFrequent);
    }
  }, [input, snomedHierarchy, value, workspaceId]);

  useEffect(() => {
    if (!snomedHierarchy) {
      setSnomedSuggestions([]);
      return;
    }

    const abortController = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      const results = await searchSnomed(input, snomedHierarchy, 15, abortController.signal, workspaceId);
      if (!abortController.signal.aborted) {
        setSnomedSuggestions(results);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, input ? 300 : 0);
    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [input, snomedHierarchy]);

  const allSuggestions = snomedHierarchy ? (() => {
    const merged = [...localSuggestions];
    const mergedRecent = [...isRecent];
    const mergedFrequent = [...isFrequent];
    
    snomedSuggestions.forEach(snomedItem => {
      // Avoid duplicates with local suggestions
      if (!merged.some(localItem => localItem.name.toLowerCase() === snomedItem.name.toLowerCase()) && !value.includes(snomedItem.name)) {
        merged.push(snomedItem);
        mergedRecent.push(false); // Network items are not "recent" by default unless already in local
        mergedFrequent.push(false);
      }
    });
    return { items: merged, recentFlags: mergedRecent, frequentFlags: mergedFrequent };
  })() : (() => {
    const filtered = suggestions.filter(s => !value.includes(s));
    return { items: filtered, recentFlags: Array(filtered.length).fill(false), frequentFlags: Array(filtered.length).fill(false) };
  })();

  const addTag = (tag: string | any) => {
    const tagName = typeof tag === 'string' ? tag : tag.name;
    if (tagName && !value.includes(tagName)) {
      onChange([...value, tagName]);
      if (snomedHierarchy) {
        addRecentItem(snomedHierarchy, tag, workspaceId || 'shared');
      }
      setInput('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allSuggestions.items[selectedIndex]) {
        addTag(allSuggestions.items[selectedIndex]);
      } else if (input.trim()) {
        addTag(input.trim());
      } else if (onEnterNext && value.length > 0) {
        onEnterNext();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allSuggestions.items.length - 1));
      if (onArrowDownInField) {
        onArrowDownInField();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Tab' && onEnterNext) {
      if (input.trim()) {
        e.preventDefault();
        addTag(input.trim());
      }
    }
  };

  return (
    <div>
      <label className="text-base mb-3 block text-gray-900 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-2 text-sm gap-2 bg-blue-50 text-blue-900 border border-blue-200 chip-enter shadow-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                type="button"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? <Loader2 className="size-4 text-blue-500 animate-spin" /> : <Search className="size-4 text-gray-400" />}
        </div>
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
            if (onFieldFocus) {
              onFieldFocus(label, e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowSuggestions(true);
            if (onFieldFocus) {
              onFieldFocus(label, input);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />

        {showSuggestions && !disableDropdown && (allSuggestions.items.length > 0 || input) && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto py-2">
            {allSuggestions.items.map((suggestion, index) => {
              const isRecentItem = allSuggestions.recentFlags[index];
              const isFrequentItem = allSuggestions.frequentFlags[index];
              return (
                <button
                  key={typeof suggestion === 'string' ? suggestion : suggestion.id}
                  onClick={() => addTag(suggestion)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                  }`}
                  type="button"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {isFrequentItem ? (
                        <Flame className="size-3 text-orange-500" />
                      ) : isRecentItem ? (
                        <Clock className="size-3 text-blue-500" />
                      ) : null}
                      <span className="font-medium">{typeof suggestion === 'string' ? suggestion : suggestion.name}</span>
                    </div>
                    {typeof suggestion !== 'string' && (
                      <span className="text-[10px] text-gray-400 font-mono">SCTID: {suggestion.id}</span>
                    )}
                  </div>
                  {snomedHierarchy && !isRecentItem && !isFrequentItem && (
                    <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-200">SNOMED</Badge>
                  )}
                  {snomedHierarchy && (isRecentItem || isFrequentItem) && (
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] ${isFrequentItem ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                    >
                      {isFrequentItem ? 'Frequent' : 'Recent'}
                    </Badge>
                  )}
                </button>
              );
            })}
            {allSuggestions.items.length === 0 && input && !isLoading && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Press Enter to add "{input}"
              </div>
            )}
          </div>
        )}
      </div>

      {!zenMode && (
        <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-[9px]">Enter</kbd> to add
          {onEnterNext && <span>·</span>}
          {onEnterNext && <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-[9px]">Ctrl+Enter</kbd>}
          {onEnterNext && <span>next</span>}
        </p>
      )}
    </div>
  );
}