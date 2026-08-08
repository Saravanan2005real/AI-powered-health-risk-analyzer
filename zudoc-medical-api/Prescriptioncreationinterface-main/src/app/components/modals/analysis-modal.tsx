import { useState } from 'react';
import { Prescription, SafetyCheck } from '../../types/prescription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  prescription: Prescription;
  onClose: () => void;
  onProceedToSign: () => void;
}

export function AnalysisModal({
  isOpen,
  prescription,
  onClose,
  onProceedToSign
}: AnalysisModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  // Mock safety checks - simulate analysis
  useState(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 2000);
    }
  });

  // Generate mock safety checks based on prescription
  const safetyChecks: SafetyCheck[] = [
    {
      type: 'allergy',
      severity: 'ok',
      message: 'No allergy conflicts detected',
      explanation: `Checked all medications against patient allergies: ${
        prescription.patient.allergies.length > 0
          ? prescription.patient.allergies.join(', ')
          : 'None'
      }. All medications are safe to prescribe.`
    },
    {
      type: 'dose',
      severity: prescription.patient.age < 12 ? 'ok' : 'ok',
      message: 'Dosage within acceptable range',
      explanation: `All medication dosages verified against patient weight (${prescription.patient.weight}kg) and age (${prescription.patient.age}y). Doses are within therapeutic range.`
    },
    {
      type: 'interaction',
      severity: 'ok',
      message: 'No drug-drug interactions found',
      explanation: 'Analyzed all prescribed medications for potential interactions. No significant interactions detected.'
    }
  ];

  // Add antibiotic stewardship warning if Azithromycin is prescribed
  if (prescription.medications.some(m => m.drugName.includes('Azithromycin'))) {
    safetyChecks.push({
      type: 'duplicate',
      severity: 'warning',
      message: 'Antibiotic stewardship reminder',
      explanation: 'Antibiotic prescribed. Ensure bacterial etiology is confirmed or strongly suspected. Consider culture if symptoms persist. Follow antimicrobial stewardship guidelines.'
    });
  }

  const severityIcon = (severity: SafetyCheck['severity']) => {
    switch (severity) {
      case 'ok':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-amber-600" />;
      case 'severe':
        return <XCircle className="size-5 text-red-600" />;
    }
  };

  const severityColor = (severity: SafetyCheck['severity']) => {
    switch (severity) {
      case 'ok':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'severe':
        return 'border-red-200 bg-red-50';
    }
  };

  const hasSevereIssues = safetyChecks.some(check => check.severity === 'severe');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Safety Analysis</DialogTitle>
          <DialogDescription>
            AI-powered safety checks for your prescription.
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <Loader2 className="size-12 animate-spin text-blue-600" />
            <p className="text-gray-600">Analyzing prescription for safety...</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-full transition-all duration-500" />
              </div>
              <span className="text-sm text-gray-600">Complete</span>
            </div>

            {safetyChecks.map((check, index) => (
              <div
                key={index}
                className={`border rounded-lg transition-all ${severityColor(check.severity)}`}
              >
                <button
                  onClick={() => setExpandedCheck(expandedCheck === check.type ? null : check.type)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  {severityIcon(check.severity)}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{check.message}</div>
                    <div className="text-xs text-gray-600 mt-0.5 capitalize">{check.type} check</div>
                  </div>
                  {check.severity === 'warning' && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                      Review
                    </Badge>
                  )}
                  {expandedCheck === check.type ? (
                    <ChevronUp className="size-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="size-4 text-gray-500" />
                  )}
                </button>
                {expandedCheck === check.type && (
                  <div className="px-4 pb-4">
                    <div className="pl-8 text-sm text-gray-700 bg-white/50 rounded p-3">
                      {check.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasSevereIssues && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Severe Issues Detected</h4>
                    <p className="text-sm text-red-800">
                      Please resolve severe issues before proceeding with prescription signing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
                Back
              </Button>
              <Button
                onClick={onProceedToSign}
                disabled={hasSevereIssues}
                size="lg"
                className="flex-1"
              >
                Continue to Sign
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}