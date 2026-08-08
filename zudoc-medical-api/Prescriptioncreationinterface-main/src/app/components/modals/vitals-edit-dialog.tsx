import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Vitals } from '../../types/prescription';
import { Thermometer, Heart, Activity, Droplet, Wind, Candy, Ruler } from 'lucide-react';

interface VitalsEditDialogProps {
  isOpen: boolean;
  vitals: Vitals;
  onClose: () => void;
  onSave: (vitals: Vitals) => void;
}

const vitalFields = [
  { key: 'temperature', label: 'Temperature', unit: '°F', icon: Thermometer, placeholder: '98.6' },
  { key: 'bpSystolic', label: 'BP Systolic', unit: 'mmHg', icon: Activity, placeholder: '120' },
  { key: 'bpDiastolic', label: 'BP Diastolic', unit: 'mmHg', icon: Activity, placeholder: '80' },
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: Heart, placeholder: '72' },
  { key: 'respiratoryRate', label: 'Respiratory Rate', unit: '/min', icon: Wind, placeholder: '16' },
  { key: 'spo2', label: 'SpO2', unit: '%', icon: Droplet, placeholder: '98' },
  { key: 'bloodSugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Candy, placeholder: '100' },
  { key: 'height', label: 'Height', unit: 'cm', icon: Ruler, placeholder: '170' },
];

export function VitalsEditDialog({ isOpen, vitals, onClose, onSave }: VitalsEditDialogProps) {
  const [editedVitals, setEditedVitals] = useState<Vitals>(vitals);

  const handleChange = (key: string, value: string) => {
    setEditedVitals(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedVitals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vital Signs</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {vitalFields.map(field => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 text-gray-500" />
                  {field.label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={field.key}
                    type="text"
                    placeholder={field.placeholder}
                    value={editedVitals[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 min-w-[60px] justify-center">
                    {field.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
