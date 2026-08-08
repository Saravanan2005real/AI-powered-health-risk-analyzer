import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Calendar, Clock, UserPlus, FlaskConical, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { mockDoctors } from '../../data/mockData';

export interface AdvancedFollowUp {
  type: 'doctor' | 'lab' | 'test';
  dates: Date[];
  times: string[];
  referralDoctor?: string;
  labTests?: string;
  notes?: string;
  summary: string;
}

interface AdvancedFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (followUp: AdvancedFollowUp) => void;
  initialData?: AdvancedFollowUp;
}

export function AdvancedFollowUpModal({
  open,
  onClose,
  onSave,
  initialData
}: AdvancedFollowUpModalProps) {
  const [followUpType, setFollowUpType] = useState<'doctor' | 'lab' | 'test'>(
    initialData?.type || 'doctor'
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>(initialData?.dates || []);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(initialData?.times || []);
  const [currentTime, setCurrentTime] = useState('09:00');
  const [referralDoctor, setReferralDoctor] = useState(initialData?.referralDoctor || '');
  const [labTests, setLabTests] = useState(initialData?.labTests || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleAddTime = () => {
    if (currentTime && !selectedTimes.includes(currentTime)) {
      setSelectedTimes([...selectedTimes, currentTime]);
    }
  };

  const handleRemoveTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter(t => t !== time));
  };

  const handleSave = () => {
    onSave({
      type: followUpType,
      dates: selectedDates,
      times: selectedTimes,
      referralDoctor: followUpType === 'doctor' ? referralDoctor : undefined,
      labTests: followUpType === 'lab' || followUpType === 'test' ? labTests : undefined,
      notes,
      summary: `${followUpType === 'doctor' ? 'Referral to ' + referralDoctor : followUpType === 'lab' ? 'Lab: ' + labTests : 'Follow-up'} on ${selectedDates.map(d => format(d, 'MMM dd')).join(', ')}`
    });
    onClose();
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    // Filter out invalid dates
    const validDates = dates.filter(d => d instanceof Date && !isNaN(d.getTime()));
    setSelectedDates(validDates);
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter(d => d.getTime() !== dateToRemove.getTime()));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Follow-up Scheduling</DialogTitle>
          <DialogDescription>
            Schedule follow-up visits, refer to specialists, or arrange lab tests with multiple dates and times.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Follow-up Type Selection */}
          <div>
            <Label className="text-base mb-3 block">Follow-up Type</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFollowUpType('doctor')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  followUpType === 'doctor'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserPlus className="size-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Refer to Doctor</div>
              </button>
              <button
                onClick={() => setFollowUpType('lab')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  followUpType === 'lab'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FlaskConical className="size-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Lab Test</div>
              </button>
              <button
                onClick={() => setFollowUpType('test')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  followUpType === 'test'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className="size-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Follow-up Visit</div>
              </button>
            </div>
          </div>

          {/* Doctor Referral */}
          {followUpType === 'doctor' && (
            <div>
              <Label htmlFor="referral-doctor" className="text-base mb-3 block">
                Refer to Specialist
              </Label>
              <select
                id="referral-doctor"
                value={referralDoctor}
                onChange={e => setReferralDoctor(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select a specialist...</option>
                {mockDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lab Tests */}
          {(followUpType === 'lab' || followUpType === 'test') && (
            <div>
              <Label htmlFor="lab-tests" className="text-base mb-3 block">
                {followUpType === 'lab' ? 'Lab Tests Required' : 'Tests/Investigations'}
              </Label>
              <Textarea
                id="lab-tests"
                placeholder="e.g., CBC, Blood Sugar, Liver Function Test"
                value={labTests}
                onChange={e => setLabTests(e.target.value)}
                className="min-h-20"
              />
            </div>
          )}

          {/* Date Selection */}
          <div>
            <Label className="text-base mb-3 block">
              Select Date(s) <span className="text-sm text-gray-500">(Click to select multiple)</span>
            </Label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <CalendarComponent
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelect}
                disabled={{ before: new Date() }}
                className="mx-auto"
              />
            </div>
            {selectedDates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    <Calendar className="size-3" />
                    {format(date, 'MMM dd, yyyy')}
                    <button
                      onClick={() => handleRemoveDate(date)}
                      className="hover:text-red-600"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div>
            <Label className="text-base mb-3 block">Preferred Time(s)</Label>
            <div className="flex gap-2 mb-3">
              <Input
                type="time"
                value={currentTime}
                onChange={e => setCurrentTime(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddTime} variant="outline" size="icon">
                <Plus className="size-4" />
              </Button>
            </div>
            {selectedTimes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTimes.map((time, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    <Clock className="size-3" />
                    {time}
                    <button
                      onClick={() => handleRemoveTime(time)}
                      className="hover:text-red-600"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="followup-notes" className="text-base mb-3 block">
              Additional Notes
            </Label>
            <Textarea
              id="followup-notes"
              placeholder="Any special instructions or notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedDates.length === 0}
          >
            Save Follow-up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}