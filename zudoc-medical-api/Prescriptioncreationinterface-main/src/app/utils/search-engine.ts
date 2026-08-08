import { SnomedConcept, SNOMED_HIERARCHIES } from './snomed';

const RECENT_ITEMS_KEY = 'zudoc_recent_concepts_v2';

export interface StoredConcept extends SnomedConcept {
  frequency: number;
  lastUsed: number;
}

// Local storage for recent items
function getRecentItemsStorage(): Record<string, StoredConcept[]> {
  try {
    const data = localStorage.getItem(RECENT_ITEMS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading recent items:', e);
    return {};
  }
}

function saveRecentItemsStorage(data: Record<string, StoredConcept[]>) {
  try {
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving recent items:', e);
  }
}

export function addRecentItem(hierarchy: string, item: SnomedConcept | string, workspaceId: string = 'shared') {
  if (!hierarchy) return;
  
  // Normalize workspace ID to ensure consistent naming across the app
  let normalizedWorkspace = workspaceId;
  if (workspaceId === 'allopathy') {
    normalizedWorkspace = 'general';
  } else if (workspaceId === 'vetnary' || workspaceId === 'vet') {
    normalizedWorkspace = 'veterinary';
  } else if (workspaceId === 'ayrvedha') {
    normalizedWorkspace = 'ayurveda';
  }

  const key = `${normalizedWorkspace}_${hierarchy}`;
  
  const data = getRecentItemsStorage();
  const hierarchyList = data[key] || [];
  
  const baseItem: SnomedConcept = typeof item === 'string' 
    ? { id: `local-${Date.now()}`, name: item, category: 'Custom' }
    : item;

  const existingIndex = hierarchyList.findIndex(i => i.name.toLowerCase() === baseItem.name.toLowerCase());
  
  if (existingIndex >= 0) {
    // Update existing item
    hierarchyList[existingIndex].frequency = (hierarchyList[existingIndex].frequency || 1) + 1;
    hierarchyList[existingIndex].lastUsed = Date.now();
  } else {
    // Add new item
    hierarchyList.push({
      ...baseItem,
      frequency: 1,
      lastUsed: Date.now()
    });
  }
  
  // Sort by frequency (descending), then lastUsed (descending)
  hierarchyList.sort((a, b) => {
    if (b.frequency !== a.frequency) {
      return b.frequency - a.frequency;
    }
    return b.lastUsed - a.lastUsed;
  });
  
  // Keep top 1000 items per field
  data[key] = hierarchyList.slice(0, 1000);
  
  saveRecentItemsStorage(data);
}

export function getStoredItems(hierarchy: string, workspaceId: string = 'shared'): StoredConcept[] {
  if (!hierarchy) return [];

  // Normalize workspace ID
  let normalizedWorkspace = workspaceId;
  if (workspaceId === 'allopathy') {
    normalizedWorkspace = 'general';
  } else if (workspaceId === 'vetnary' || workspaceId === 'vet') {
    normalizedWorkspace = 'veterinary';
  } else if (workspaceId === 'ayrvedha') {
    normalizedWorkspace = 'ayurveda';
  }

  const key = `${normalizedWorkspace}_${hierarchy}`;
  const data = getRecentItemsStorage();
  const stored = data[key] || [];
  
  // Get common defaults
  const common = COMMON_ITEMS[hierarchy] || [];
  const commonStored: StoredConcept[] = common.map((item, index) => ({
    ...item,
    frequency: 0,
    lastUsed: Date.now() - (index * 60 * 1000) - 1000000 // far in the past
  }));

  // Merge stored items with common defaults (avoiding duplicates)
  const merged = [...stored];
  commonStored.forEach(cItem => {
    if (!merged.some(mItem => mItem.name.toLowerCase() === cItem.name.toLowerCase())) {
      merged.push(cItem);
    }
  });

  return merged;
}

// Common Hardcoded Data to provide instant suggestions without hitting the database
const COMMON_ITEMS: Record<string, SnomedConcept[]> = {
  [SNOMED_HIERARCHIES.ALLERGIES]: [
    { id: '91936005', name: 'Allergy to penicillin', category: 'Allergy' },
    { id: '293586001', name: 'Allergy to aspirin', category: 'Allergy' },
    { id: '293597001', name: 'Allergy to codeine', category: 'Allergy' },
    { id: '429239002', name: 'Allergy to sulfonamide antibiotic', category: 'Allergy' },
    { id: '91931000', name: 'Allergy to erythromycin', category: 'Allergy' },
    { id: '416098002', name: 'Allergy to drug', category: 'Allergy' },
    { id: '293723005', name: 'Allergy to cocaine', category: 'Allergy' }
  ],
  [SNOMED_HIERARCHIES.SYMPTOMS]: [
    { id: '386661006', name: 'Fever', category: 'Symptom' },
    { id: '49727002', name: 'Cough', category: 'Symptom' },
    { id: '25064002', name: 'Headache', category: 'Symptom' },
    { id: '422587007', name: 'Nausea', category: 'Symptom' },
    { id: '422400008', name: 'Vomiting', category: 'Symptom' },
    { id: '62507009', name: 'Diarrhea', category: 'Symptom' },
    { id: '21522001', name: 'Abdominal pain', category: 'Symptom' },
    { id: '29857009', name: 'Chest pain', category: 'Symptom' },
    { id: '162397003', name: 'Throat pain', category: 'Symptom' },
    { id: '84229001', name: 'Fatigue', category: 'Symptom' }
  ],
  [SNOMED_HIERARCHIES.DIAGNOSIS]: [
    { id: '38341003', name: 'Hypertension', category: 'Diagnosis' },
    { id: '73211009', name: 'Diabetes mellitus', category: 'Diagnosis' },
    { id: '195967001', name: 'Asthma', category: 'Diagnosis' },
    { id: '40055000', name: 'Chronic sinusitis', category: 'Diagnosis' },
    { id: '13645005', name: 'COPD', category: 'Diagnosis' },
    { id: '85827009', name: 'Migraine', category: 'Diagnosis' }
  ],
  [SNOMED_HIERARCHIES.MEDICATIONS]: [
    { id: '322236009', name: 'Paracetamol', category: 'Medication' },
    { id: '372601001', name: 'Amoxicillin', category: 'Medication' },
    { id: '387207008', name: 'Ibuprofen', category: 'Medication' },
    { id: '372665008', name: 'Omeprazole', category: 'Medication' },
    { id: '372572004', name: 'Lisinopril', category: 'Medication' },
    { id: '372646006', name: 'Metformin', category: 'Medication' },
    { id: '372833007', name: 'Atorvastatin', category: 'Medication' }
  ],
  [SNOMED_HIERARCHIES.LAB]: [
    { id: '26604007', name: 'Complete blood count', category: 'Lab' },
    { id: '104326007', name: 'Liver function test', category: 'Lab' },
    { id: '104325002', name: 'Renal function test', category: 'Lab' },
    { id: '390886001', name: 'HbA1c', category: 'Lab' },
    { id: '275711006', name: 'Serum electrolytes', category: 'Lab' },
    { id: '121151000119106', name: 'Lipid profile', category: 'Lab' },
    { id: '104324003', name: 'Thyroid function test', category: 'Lab' }
  ],
  [SNOMED_HIERARCHIES.RADIOLOGY]: [
    { id: '399208008', name: 'Chest X-ray', category: 'Radiology' },
    { id: '16310003', name: 'Ultrasound abdomen', category: 'Radiology' },
    { id: '241517006', name: 'MRI Brain', category: 'Radiology' },
    { id: '103681000119106', name: 'CT Scan Head', category: 'Radiology' },
    { id: '28669004', name: 'Ultrasound KUB', category: 'Radiology' }
  ],
  [SNOMED_HIERARCHIES.SURGERY]: [
    { id: '80146002', name: 'Appendectomy', category: 'Surgery' },
    { id: '38102005', name: 'Cholecystectomy', category: 'Surgery' },
    { id: '174041007', name: 'Hernia repair', category: 'Surgery' },
    { id: '13155006', name: 'Cataract surgery', category: 'Surgery' },
    { id: '11466000', name: 'Caesarean section', category: 'Surgery' }
  ],
  [SNOMED_HIERARCHIES.AYUSH]: [
    { id: 'ayush-1', name: 'Ayurvedic consultation', category: 'AYUSH' },
    { id: 'ayush-2', name: 'Panchakarma therapy', category: 'AYUSH' },
    { id: 'ayush-3', name: 'Homeopathic remedy', category: 'AYUSH' },
    { id: 'ayush-4', name: 'Yoga therapy', category: 'AYUSH' },
    { id: 'ayush-5', name: 'Unani medicine', category: 'AYUSH' }
  ],
  [SNOMED_HIERARCHIES.DENTAL]: [
    { id: '2512003', name: 'Tooth extraction', category: 'Dental' },
    { id: '108290001', name: 'Dental scaling', category: 'Dental' },
    { id: '70281006', name: 'Root canal therapy', category: 'Dental' },
    { id: '172082006', name: 'Dental filling', category: 'Dental' },
    { id: 'dental-5', name: 'Dental checkup', category: 'Dental' }
  ],
  [SNOMED_HIERARCHIES.NURSING]: [
    { id: '182777000', name: 'Nursing care plan', category: 'Nursing' },
    { id: '225224009', name: 'Wound care', category: 'Nursing' },
    { id: '225225005', name: 'Dressing change', category: 'Nursing' },
    { id: '133901003', name: 'Patient monitoring', category: 'Nursing' },
    { id: 'nursing-5', name: 'Intravenous therapy', category: 'Nursing' }
  ],
  [SNOMED_HIERARCHIES.VET]: [
    { id: 'vet-1', name: 'Veterinary consultation', category: 'Veterinary' },
    { id: 'vet-2', name: 'Animal vaccination', category: 'Veterinary' },
    { id: 'vet-3', name: 'Deworming', category: 'Veterinary' },
    { id: 'vet-4', name: 'Pet grooming', category: 'Veterinary' },
    { id: 'vet-5', name: 'Veterinary physical exam', category: 'Veterinary' }
  ]
};

export function getLocalSuggestions(query: string, hierarchy: string, workspaceId: string = 'shared'): { items: SnomedConcept[], isRecent: boolean[], isFrequent: boolean[] } {
  if (!hierarchy) return { items: [], isRecent: [], isFrequent: [] };
  
  const storedItems = getStoredItems(hierarchy, workspaceId);
  
  // Recent logic: definition is used in last 24h OR top 5 latest
  const recentThreshold = Date.now() - (24 * 60 * 60 * 1000); // last 24h
  
  // Map stored items to include isRecent and isFrequent flags
  const allLocal = storedItems.map(item => ({
    ...item,
    isFrequent: item.frequency >= 3,
    isRecent: item.lastUsed > recentThreshold || storedItems.indexOf(item) < 5
  }));
  
  if (!query) {
    // Return top 15 defaults when query is empty, sorted by frequent first, then recent
    const sorted = [...allLocal].sort((a, b) => {
      if (a.isFrequent && !b.isFrequent) return -1;
      if (!a.isFrequent && b.isFrequent) return 1;
      if (a.isRecent && !b.isRecent) return -1;
      if (!a.isRecent && b.isRecent) return 1;
      return 0;
    });
    const top = sorted.slice(0, 15);
    return {
      items: top,
      isRecent: top.map(t => t.isRecent),
      isFrequent: top.map(t => t.isFrequent)
    };
  }
  
  const lowerQuery = query.toLowerCase();
  const filtered = allLocal.filter(item => item.name.toLowerCase().includes(lowerQuery)).slice(0, 15);
  
  return {
    items: filtered,
    isRecent: filtered.map(t => t.isRecent),
    isFrequent: filtered.map(t => t.isFrequent)
  };
}
