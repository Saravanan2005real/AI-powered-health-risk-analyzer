import { useState, useMemo } from 'react';
import { Patient } from '../../types/prescription';
import { mockPatients } from '../../data/mockData';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
}

export function PatientSearch({ onPatientSelect }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return mockPatients.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.patientId.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search patient by name / phone / patient ID…"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => searchTerm && setIsOpen(true)}
          className="pl-12 h-14 text-lg border-gray-300"
        />
      </div>

      {isOpen && filteredPatients.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredPatients.map(patient => (
            <button
              key={patient.id}
              onClick={() => handleSelect(patient)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-left"
            >
              <Avatar className="size-12">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {patient.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-600">
                  {patient.age}y/{patient.gender} · {patient.patientId}
                  {patient.guardian && ` · Guardian: ${patient.guardian}`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div className="text-sm text-gray-500">{patient.phone}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
