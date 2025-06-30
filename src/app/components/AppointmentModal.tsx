import React, { useState } from 'react';
import AppointmentForm from './Appointmentform';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppointmentUtil } from '../datautils';
import { Utils } from '../utils';
import { DATE_TIME_FORMAT } from '../config/Constants';
import { deleteAppointmentData } from '../api/appointments/DeleteAppointment';
import { appointmentData } from '../ducks/AppointmentContext';

interface AppointmentModalProps {
  appointment?: any;
  patients?: any;
  categories?: any;
  onClose?: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  onClose,
  patients,
  categories,
}) => {
  const { setData }: any = appointmentData();
  const [isEditing, setIsEditing] = useState(false);

  if (!appointment) return null;

  const handleDelete = async () => {
    const { data, error } = await deleteAppointmentData(AppointmentUtil.id(appointment));

    if (error) {
      alert(`${error.message}`)
    } else {
      setData((prev: any) => ({
        ...prev,
        appointments: prev.appointments.filter((item: any) => item.id !== AppointmentUtil.id(appointment)),
      }));
      alert('Appointment deleted!');
      onClose?.()
    }

  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {!isEditing ? 'Terminübersicht' : 'Termin bearbeiten'}
            <button
              aria-label="Close"
              className="text-gray-500 hover:text-gray-700 transition"
              onClick={onClose}
            >
            </button>
          </DialogTitle>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-4 mt-2">
            <p>
              <strong>Titel:</strong> {AppointmentUtil.title(appointment)}
            </p>
            <p>
              <strong>Beginn:</strong> {Utils.formatDate(AppointmentUtil.start_time(appointment), DATE_TIME_FORMAT)}
            </p>
            <p>
              <strong>Ende:</strong> {Utils.formatDate(AppointmentUtil.end_time(appointment), DATE_TIME_FORMAT)}
            </p>
            <p>
              <strong>Ort:</strong> {AppointmentUtil.location(appointment)}
            </p>
            <p>
              <strong>Beschreibung:</strong> {AppointmentUtil.notes(appointment)}
            </p>

            <div className="flex justify-between mt-6">
              <Button
                variant="default"
                onClick={() => setIsEditing(true)}
                className="mr-2"
              >
                Termin bearbeiten
              </Button>

              <Button variant="destructive" onClick={handleDelete}>
                Termin löschen
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <AppointmentForm
              appointment={appointment}
              onClose={onClose}
              patients={patients}
              categories={categories}
            />
          </div>
        )}

        <DialogFooter>
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Bearbeitung abbrechen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;

