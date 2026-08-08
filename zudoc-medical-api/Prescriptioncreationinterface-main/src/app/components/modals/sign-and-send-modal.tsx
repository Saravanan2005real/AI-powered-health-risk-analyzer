import { useState } from 'react';
import { Prescription } from '../../types/prescription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { FileText, Send, Smartphone, Printer, CheckCircle } from 'lucide-react';

interface SignAndSendModalProps {
  isOpen: boolean;
  prescription: Prescription;
  onClose: () => void;
  onSubmit: (deliveryOptions: string[], rxId: string) => void;
}

export function SignAndSendModal({
  isOpen,
  prescription,
  onClose,
  onSubmit
}: SignAndSendModalProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [pin, setPin] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>(['app']);

  const toggleDeliveryOption = (option: string) => {
    setDeliveryOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!isApproved || pin.length !== 4) return;
    
    // Generate prescription ID
    const rxId = `RX-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(
      Math.floor(Math.random() * 99999)
    ).padStart(5, '0')}`;
    
    onSubmit(deliveryOptions, rxId);
    
    // Reset form
    setIsApproved(false);
    setPin('');
    setDeliveryOptions(['app']);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign & Send Prescription</DialogTitle>
          <DialogDescription>
            Verify delivery options and sign with your PIN to send the prescription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Prescription Preview */}
          <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{prescription.doctor.clinic}</h3>
                <p className="text-sm text-gray-600">{prescription.doctor.name}</p>
                <p className="text-sm text-gray-600">{prescription.doctor.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">Reg. No: {prescription.doctor.registrationNo}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>{new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mb-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold text-gray-900">{prescription.patient.name}</p>
                <p className="text-sm text-gray-600">
                  {prescription.patient.age}y / {prescription.patient.gender} / {prescription.patient.weight}kg
                </p>
                <p className="text-sm text-gray-600">ID: {prescription.patient.patientId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnosis</p>
                <p className="text-gray-900">{prescription.diagnoses.map(d => d.name).join(', ')}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Medications</p>
                <div className="space-y-2">
                  {prescription.medications.map((med, index) => (
                    <div key={med.id} className="text-sm">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {med.drugName}
                      </p>
                      <p className="text-gray-600 text-xs ml-4">
                        {med.dose} - {med.frequency} - {med.duration} - {med.route} - {med.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Instructions</p>
                  <p className="text-sm text-gray-700">{prescription.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-300 pt-3 mt-4">
                <p className="text-xs text-gray-600 italic">Digitally signed by {prescription.doctor.signature}</p>
              </div>
            </div>
          </div>

          {/* Approval Checkbox */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="approve"
                checked={isApproved}
                onCheckedChange={checked => setIsApproved(checked as boolean)}
              />
              <label htmlFor="approve" className="text-sm text-gray-700 cursor-pointer">
                <span className="font-semibold">I approve and sign this prescription</span>
                <p className="text-xs text-gray-600 mt-1">
                  I confirm that I have reviewed all details and authorize this prescription for the
                  patient listed above.
                </p>
              </label>
            </div>
          </div>

          {/* PIN Entry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter PIN to Sign
            </label>
            <InputOTP maxLength={4} value={pin} onChange={setPin}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-gray-500 mt-1">Enter your 4-digit security PIN</p>
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Options (select multiple)
            </label>
            <div className="space-y-2">
              <button
                onClick={() => toggleDeliveryOption('app')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  deliveryOptions.includes('app')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`size-5 rounded border-2 flex items-center justify-center ${
                  deliveryOptions.includes('app') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {deliveryOptions.includes('app') && <CheckCircle className="size-4 text-white" />}
                </div>
                <FileText className="size-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Send to Zudoc App</p>
                  <p className="text-xs text-gray-600">Patient will receive in their app</p>
                </div>
              </button>

              <button
                onClick={() => toggleDeliveryOption('whatsapp')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  deliveryOptions.includes('whatsapp')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`size-5 rounded border-2 flex items-center justify-center ${
                  deliveryOptions.includes('whatsapp') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {deliveryOptions.includes('whatsapp') && <CheckCircle className="size-4 text-white" />}
                </div>
                <Smartphone className="size-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-600">Send to {prescription.patient.phone}</p>
                </div>
              </button>

              <button
                onClick={() => toggleDeliveryOption('print')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  deliveryOptions.includes('print')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`size-5 rounded border-2 flex items-center justify-center ${
                  deliveryOptions.includes('print') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {deliveryOptions.includes('print') && <CheckCircle className="size-4 text-white" />}
                </div>
                <Printer className="size-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Print</p>
                  <p className="text-xs text-gray-600">Print physical copy</p>
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isApproved || pin.length !== 4}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Send className="size-4 mr-2" />
              Sign & Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}