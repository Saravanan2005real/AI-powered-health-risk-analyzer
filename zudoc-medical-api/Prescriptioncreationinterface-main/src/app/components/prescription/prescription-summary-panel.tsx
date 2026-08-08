import { Prescription } from '../../types/prescription';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import { useState } from 'react';

interface PrescriptionSummaryPanelProps {
  prescription: Prescription | null;
  onSectionClick: (section: string) => void;
  onExpandReview: () => void;
}

export function PrescriptionSummaryPanel({
  prescription,
  onSectionClick,
  onExpandReview
}: PrescriptionSummaryPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!prescription) return null;

  if (isCollapsed) {
    return (
      <div 
        className="w-12 h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200 flex items-start justify-center pt-4 cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden"
        onClick={() => setIsCollapsed(false)}
        title="Expand Prescription Summary"
      >
        <div className="p-2">
          <FileText className="size-5 text-gray-600" />
        </div>
      </div>
    );
  }

  const hasSummary =
    prescription.diagnoses.length > 0 ||
    prescription.medications.length > 0 ||
    prescription.symptoms ||
    prescription.investigations ||
    prescription.notes;

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 panel-transition h-full flex flex-col overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 z-10 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="size-4" />
            Current Prescription
          </h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Collapse"
          >
            <ChevronLeft className="size-4 text-gray-600" />
          </button>
        </div>
        <p className="text-xs text-gray-600">Quick review & navigation</p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {!hasSummary && (
          <div className="text-center py-8 text-sm text-gray-500">
            Start adding data to see summary
          </div>
        )}

        {/* Symptoms */}
        {prescription.symptoms && (
          <button
            onClick={() => onSectionClick('symptoms')}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Symptoms</div>
            <p className="text-sm text-gray-700 line-clamp-2">{prescription.symptoms}</p>
          </button>
        )}

        {/* Diagnoses */}
        {prescription.diagnoses.length > 0 && (
          <button
            onClick={() => onSectionClick('diagnosis')}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Diagnoses ({prescription.diagnoses.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {prescription.diagnoses.map(d => (
                <Badge key={d.id} variant="secondary" className="text-xs bg-blue-50 text-blue-900">
                  {d.name}
                </Badge>
              ))}
            </div>
          </button>
        )}

        {/* Medications */}
        {prescription.medications.length > 0 && (
          <button
            onClick={() => onSectionClick('medications')}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Medications ({prescription.medications.length})
            </div>
            <div className="space-y-2">
              {prescription.medications.slice(0, 3).map((med, idx) => (
                <div key={med.id} className="text-xs">
                  <p className="font-medium text-gray-900 truncate">
                    {idx + 1}. {med.drugName}
                  </p>
                  <p className="text-gray-600 truncate">
                    {med.dose} · {med.frequency} · {med.duration}
                  </p>
                </div>
              ))}
              {prescription.medications.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{prescription.medications.length - 3} more
                </p>
              )}
            </div>
          </button>
        )}

        {/* Investigations */}
        {prescription.investigations && (
          <button
            onClick={() => onSectionClick('investigations')}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Investigations</div>
            <p className="text-sm text-gray-700 line-clamp-2">{prescription.investigations}</p>
          </button>
        )}

        {/* Notes */}
        {prescription.notes && (
          <button
            onClick={() => onSectionClick('notes')}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes & Advice</div>
            <p className="text-sm text-gray-700 line-clamp-2">{prescription.notes}</p>
          </button>
        )}

        {hasSummary && (
          <Button onClick={onExpandReview} variant="outline" className="w-full" size="sm">
            Expand Full Review
          </Button>
        )}
      </div>
    </div>
  );
}