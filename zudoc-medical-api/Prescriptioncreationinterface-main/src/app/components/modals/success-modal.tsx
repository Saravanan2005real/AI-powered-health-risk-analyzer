import { Dialog, DialogContent, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, FileText, Printer, Plus } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  rxId: string;
  deliveryOptions: string[];
  onClose: () => void;
  onStartNew: () => void;
}

export function SuccessModal({
  isOpen,
  rxId,
  deliveryOptions,
  onClose,
  onStartNew
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogDescription className="sr-only">
          Prescription successfully sent
        </DialogDescription>
        <div className="flex flex-col items-center text-center py-6 space-y-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="size-16 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Prescription Sent Successfully!
            </h2>
            <p className="text-gray-600">Your prescription has been signed and delivered.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
            <p className="text-sm text-gray-600 mb-1">Prescription ID</p>
            <p className="text-xl font-mono font-semibold text-gray-900">{rxId}</p>
          </div>

          {deliveryOptions.length > 0 && (
            <div className="w-full text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">Delivered via:</p>
              <div className="space-y-1 text-sm text-gray-600">
                {deliveryOptions.includes('app') && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Patient App Inbox</span>
                  </div>
                )}
                {deliveryOptions.includes('whatsapp') && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>WhatsApp</span>
                  </div>
                )}
                {deliveryOptions.includes('print') && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Printed</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full pt-4">
            <Button onClick={onStartNew} size="lg" className="w-full">
              <Plus className="size-4 mr-2" />
              Start New Prescription
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" className="flex-1">
                <FileText className="size-4 mr-2" />
                View PDF
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Printer className="size-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}