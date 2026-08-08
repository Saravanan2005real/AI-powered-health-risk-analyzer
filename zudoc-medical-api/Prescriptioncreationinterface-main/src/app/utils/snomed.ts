export interface SnomedConcept {
  id: string;
  name: string;
  category: string;
}

export const SNOMED_HIERARCHIES = {
  SYMPTOMS: '<< 404684003 MINUS << 64572001', // Clinical finding excluding Disease
  DIAGNOSIS: '<< 64572001',  // Disease
  MEDICATIONS: '<< 373873005', // Pharmaceutical / biologic product
  LAB: '<< 71388002',        // Procedure (for lab tests)
  RADIOLOGY: '<< 363679005',  // Imaging
  SURGERY: '<< 387713003',    // Surgical procedure
  AYUSH: 'AYUSH',             // Custom tag mapped to '*' in fetch
  DENTAL: '<< 277132007',     // Dental procedure (Standard SNOMED concept)
  DENTAL_SYMPTOMS: '<< 278544002', // Tooth finding
  DENTAL_DIAGNOSIS: '<< 105995000', // Disorder of teeth AND/OR supporting structures
  NURSING: 'NURSING',         // Custom tag mapped to '*' in fetch
  VET: 'VET',                 // Custom tag mapped to '*' in fetch
  ALLERGIES: '<< 420134006',   // Propensity to adverse reaction (covers drug, food, environmental, etc.)
};

// Frontend caches for coalescing and memoizing search results to avoid redundant network overhead
const snomedPromises = new Map<string, Promise<SnomedConcept[]>>();
const drugPromises = new Map<string, Promise<SnomedConcept[]>>();

export async function searchSnomed(query: string, ecl: string, limit: number = 15, signal?: AbortSignal, workspaceId?: string): Promise<SnomedConcept[]> {
  if (!query || !query.trim() || query.trim().length < 3) {
    return [];
  }

  const cacheKey = `${query.trim().toLowerCase()}||${ecl}||${workspaceId || 'shared'}||${limit}`;

  if (snomedPromises.has(cacheKey)) {
    return snomedPromises.get(cacheKey)!;
  }

  const actualEcl = ['AYUSH', 'NURSING', 'VET'].includes(ecl) ? '*' : ecl;

  const promise = (async () => {
    try {
      const params = new URLSearchParams({
        active: 'true',
        limit: limit.toString(),
        ecl: actualEcl
      });
      if (query) {
        params.append('term', query);
      }
      const response = await fetch(`/api/MAIN/concepts?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      
      const showVet = workspaceId === 'veterinary';
      const results = (data.items || [])
        .map((item: any) => ({
          id: item.conceptId,
          name: item.pt?.term || item.idAndFsnTerm.split('|')[1]?.trim() || item.idAndFsnTerm,
          category: ''
        }))
        .filter((concept: SnomedConcept) => showVet || !concept.id.includes('1000009'));
      
      return results;
    } catch (error: any) {
      // Evict failed requests from cache so they can be retried
      snomedPromises.delete(cacheKey);
      if (error.name === 'AbortError') {
        return [];
      }
      console.error('Snowstorm fetch error:', error);
      return [];
    }
  })();

  snomedPromises.set(cacheKey, promise);
  return promise;
}

export async function searchDrugs(query: string): Promise<SnomedConcept[]> {
  if (!query || !query.trim() || query.trim().length < 3) {
    return [];
  }

  const cacheKey = query.trim().toLowerCase();

  if (drugPromises.has(cacheKey)) {
    return drugPromises.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const response = await fetch(`/api/drugs?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      
      const results = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.marketer || ''
      }));
      return results;
    } catch (error) {
      // Evict failed requests from cache
      drugPromises.delete(cacheKey);
      console.error('Drug search error:', error);
      return [];
    }
  })();

  drugPromises.set(cacheKey, promise);
  return promise;
}

