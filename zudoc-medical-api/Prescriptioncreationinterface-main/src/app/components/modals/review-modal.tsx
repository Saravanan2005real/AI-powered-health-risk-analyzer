import { Prescription } from '../../types/prescription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sparkles, Send, Bot } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  prescription: Prescription;
  onClose: () => void;
  onProceedToAnalysis: () => void;
  onApproveAndSend: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  prescription,
  onProceedToAnalysis,
  onApproveAndSend
}: ReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[66.67vw] sm:max-w-[66.67vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Prescription</DialogTitle>
          <DialogDescription>
            Review the prescription details carefully. You can check with AI for safety analysis or approve and send directly to Zudoc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Identity */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Avatar className="size-16">
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {prescription.patient.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{prescription.patient.name}</h3>
              <p className="text-sm text-gray-600">
                {prescription.patient.age}y / {prescription.patient.gender} / {prescription.patient.weight}kg
              </p>
              <p className="text-sm text-gray-600">ID: {prescription.patient.patientId}</p>
            </div>
          </div>

          {/* Symptoms */}
          {prescription.symptoms && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
              <p className="text-gray-700">{prescription.symptoms}</p>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
            <div className="flex flex-wrap gap-2">
              {prescription.diagnoses.map(diagnosis => (
                <Badge
                  key={diagnosis.id}
                  variant="secondary"
                  className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200"
                >
                  {diagnosis.name}
                  {diagnosis.addedFromAI && <Sparkles className="size-3 ml-1 inline" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Medications</h4>
            <div className="space-y-3">
              {prescription.medications.map((med, index) => (
                <div key={med.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {index + 1}. {med.drugName}
                    </span>
                    {med.addedFromAI && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 gap-1">
                        <Sparkles className="size-3" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Dose:</span> {med.dose} |{' '}
                      <span className="font-medium">Frequency:</span> {med.frequency} |{' '}
                      <span className="font-medium">Duration:</span> {med.duration}
                    </p>
                    <p>
                      <span className="font-medium">Route:</span> {med.route} |{' '}
                      <span className="font-medium">Instructions:</span> {med.instructions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investigations */}
          {prescription.investigations && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Investigations</h4>
              <p className="text-gray-700 whitespace-pre-line">{prescription.investigations}</p>
            </div>
          )}

          {/* Notes */}
          {prescription.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notes & Advice</h4>
              <p className="text-gray-700 whitespace-pre-line">{prescription.notes}</p>
            </div>
          )}

          {/* Follow-up */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Follow-up</h4>
            <p className="text-gray-700">{prescription.followUp}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
              Back to Edit
            </Button>
            <Button onClick={onProceedToAnalysis} variant="outline" size="lg" className="flex-1">
              <Bot className="size-4 mr-2" />
              Check with AI
            </Button>
            <Button onClick={onApproveAndSend} size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
              <Send className="size-4 mr-2" />
              Approve & Send to Zudoc
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}