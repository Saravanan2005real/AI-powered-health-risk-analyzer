import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { History, Save, Clock, FileText, ChevronRight } from 'lucide-react';
import { Patient, Prescription } from '../../types/prescription';
import { mockPreviousPrescriptions } from '../../data/mockData';
import { toast } from 'sonner';

interface PreviousRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onRestoreDraft: (draftData: Prescription) => void;
}

export function PreviousRecordsModal({
  isOpen,
  onClose,
  patient,
  onRestoreDraft
}: PreviousRecordsModalProps) {
  const [draft, setDraft] = useState<{ id: string; data: Prescription; updatedAt: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the draft when modal opens
  useEffect(() => {
    if (isOpen && patient) {
      setIsLoading(true);
      fetch(`http://localhost:3001/api/drafts/${patient.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setDraft(data);
          } else {
            setDraft(null);
          }
        })
        .catch(err => {
          console.error("Failed to fetch draft:", err);
          setDraft(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, patient]);

  if (!patient) return null;

  // Filter mock history for this patient
  const history = mockPreviousPrescriptions.filter(p => p.patient.id === patient.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <History className="size-6 text-blue-600" />
            Previous Records & Drafts
          </DialogTitle>
          <DialogDescription>
            View past prescriptions or resume an unfinished draft for {patient.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Unfinished Draft Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Save className="size-5 text-amber-500" />
              Unfinished Draft
            </h3>
            
            {isLoading ? (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <div className="animate-spin size-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                Loading draft...
              </div>
            ) : draft ? (
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Saved Prescription Draft</h4>
                    <p className="text-sm text-amber-700 flex items-center gap-1.5 mb-3">
                      <Clock className="size-3.5" />
                      Last updated: {new Date(draft.updatedAt).toLocaleString()}
                    </p>
                    
                    <div className="flex gap-2 text-xs">
                      {draft.data.diagnoses && draft.data.diagnoses.length > 0 && (
                        <Badge variant="outline" className="bg-white/50 border-amber-300 text-amber-800">
                          {draft.data.diagnoses.length} Diagnoses
                        </Badge>
                      )}
                      {draft.data.medications && draft.data.medications.length > 0 && (
                        <Badge variant="outline" className="bg-white/50 border-amber-300 text-amber-800">
                          {draft.data.medications.length} Medications
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      onRestoreDraft(draft.data);
                      toast.success("Draft loaded successfully");
                      onClose();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                  >
                    Resume Draft
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                No unfinished drafts found for this patient.
              </div>
            )}
          </div>

          {/* Past Prescriptions Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="size-5 text-blue-600" />
              Past Prescriptions
            </h3>
            
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((record, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {new Date(record.timestamp || Date.now()).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </h4>
                        <p className="text-sm text-gray-600 truncate max-w-md">
                          {record.diagnoses?.map(d => d.name).join(', ') || 'General Visit'}
                        </p>
                      </div>
                      <ChevronRight className="size-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                No previous history found for this patient.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
