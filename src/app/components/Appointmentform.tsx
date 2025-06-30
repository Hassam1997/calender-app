import React, { useState } from 'react';
import { appointmentData } from '../ducks/AppointmentContext';
import { AppointmentUtil } from '../datautils';
import { postAppointmentData } from '../api/appointments/PostAppointment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming you export these from your shadcn/ui folder
import { updateAppointmentData } from '../api/appointments/UpdateAppointment';
import { INITIAL_FORMDATA } from '../config/Constants';

interface Patient {
  id: string;
  firstname: string;
  lastname: string;
  pronoun: string;
}

interface Category {
  id: string;
  label: string;
}

interface AppointmentFormProps {
  appointment?: any;
  onClose?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (appointment: any) => void;
  onSubmit?: () => void;
  patients?: Patient[];
  categories?: Category[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  patients,
  categories,
  onClose,
  onSubmit
}) => {
  const { setData }: any = appointmentData();
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: AppointmentUtil.title(appointment),
    start: AppointmentUtil.start_time(appointment),
    end_time: AppointmentUtil.end_time(appointment),
    location: AppointmentUtil.location(appointment),
    notes: AppointmentUtil.notes(appointment),
    patient: AppointmentUtil.patient_id(appointment) || '',
    category: AppointmentUtil.category_id(appointment) || '',
    attachments: '{}',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    if (id === 'end_time' && new Date(value) <= new Date(formData.start)) {
      setErrorMessage('Die Endzeit muss größer als die Startzeit sein');
      return;
    }
    setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (appointment) {

      const { data: updatedAppointment, error } = await updateAppointmentData(AppointmentUtil.id(appointment), formData);

      if (error) {
        alert(error.message)
      } else {
        setData((prev: any) => ({
          ...prev,
          appointments: prev.appointments.map((appointment: any) =>
            appointment.id === updatedAppointment[0].id ? updatedAppointment[0] : appointment
          ),
        }));
        alert('Termin wurde aktualisiert!');
        onClose?.()
      }
    } else {
      const { data: newAppointment, error } = await postAppointmentData(formData);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setData((prev: any) => ({
          ...prev,
          appointments: [...prev.appointments, newAppointment[0]],
        }));
        alert('Termin wurde erstellt!');
        setFormData(INITIAL_FORMDATA);
        setErrorMessage('');
        onSubmit?.()
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {appointment ? 'Termin bearbeiten	' : 'Termin erstellen'}
      </h2>

      {errorMessage && (
        <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="mb-1">Titel</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        {/* Start */}
        <div>
          <Label htmlFor="start" className="mb-1 block">Startzeit</Label>
          <Input
            id="start"
            type="datetime-local"
            value={formData.start}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End */}
        <div>
          <Label htmlFor="end_time" className="mb-1">Endzeit</Label>
          <Input
            id="end_time"
            type="datetime-local"
            value={formData.end_time}
            min={formData.start}
            onChange={handleChange}
            required
            className="w-full pr-12"
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="mb-1">Ort</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Patient */}
        <div>
          <Label htmlFor="patient" className="mb-1">Patient</Label>
          <Select
            value={formData.patient}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                patient: val,
              }))
            }
            required
          >
            <SelectTrigger id="patient" className="w-full flex items-center justify-between">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients?.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {`${patient.firstname} ${patient.lastname} (${patient.pronoun})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="mb-1">Kategorie</Label>
          <Select
            value={formData.category}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                category: val,
              }))
            }
            required
          >
            <SelectTrigger id="category" className="w-full flex items-center justify-between">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="mb-1">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Weitere Notizen hinzufügen..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" className="w-full max-w-xs">
            {appointment ? 'Termin bearbeiten	' : 'Termin erstellen'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

